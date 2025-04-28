import os
from flask import Flask, render_template, request, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from dotenv import load_dotenv
import bcrypt
from functools import wraps
from typing import List

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'default_secret_key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:Tanishpoddar.18@127.0.0.1/eventhub'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# --- Database Models ---
class User(db.Model):
    __tablename__ = 'User'
    user_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    user_type = db.Column(db.Enum('organizer', 'attendee', 'administrator'), nullable=False)
    orders = db.relationship('Order', backref='user', lazy=True)

class Venue(db.Model):
    __tablename__ = 'Venue'
    venue_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    address = db.Column(db.Text)
    capacity = db.Column(db.Integer)
    city = db.Column(db.String(255))
    state = db.Column(db.String(255))
    zip_code = db.Column(db.String(255))
    events = db.relationship('Event', backref='venue', lazy=True)

class Event(db.Model):
    __tablename__ = 'Event'
    event_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    location_id = db.Column(db.Integer, db.ForeignKey('Venue.venue_id'), nullable=False)
    speakers = db.relationship('Speaker', backref='event', lazy=True, cascade="all, delete-orphan")
    tickets = db.relationship('Ticket', backref='event', lazy=True, cascade="all, delete-orphan")

class Speaker(db.Model):
    __tablename__ = 'Speaker'
    speaker_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    bio = db.Column(db.Text)
    event_id = db.Column(db.Integer, db.ForeignKey('Event.event_id'), nullable=False)

class Order(db.Model):
    __tablename__ = 'Order'
    order_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), nullable=False)
    date = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    payment_id = db.Column(db.Integer, db.ForeignKey('Payment.payment_id'), nullable=True)
    tickets = db.relationship('Ticket', backref='order', lazy=True)
    payment = db.relationship('Payment', backref=db.backref('order', uselist=False))

class Ticket(db.Model):
    __tablename__ = 'Ticket'
    ticket_id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('Event.event_id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('Order.order_id'), nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    type = db.Column(db.Enum('general admission', 'vip', 'other'), nullable=False)
    seat_number = db.Column(db.Integer)

class Payment(db.Model):
    __tablename__ = 'Payment'
    payment_id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, nullable=False, unique=True)
    payment_method = db.Column(db.Enum('credit card', 'paypal', 'other'), nullable=False)
    transaction_id = db.Column(db.String(255))


# --- Helper Functions ---
def hash_password(password):
    """Hashes a password using bcrypt."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

def check_password(hashed_password, user_password):
    """Checks if the provided password matches the hashed password."""
    return bcrypt.checkpw(user_password.encode('utf-8'), hashed_password)

# --- Decorators ---
def login_required(role="attendee"):
    """Decorator to require login and specific role."""
    def wrapper(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user_id' not in session:
                flash('Please log in to access this page.', 'warning')
                return redirect(url_for('login'))
            user = User.query.get(session['user_id'])
            if not user or user.user_type not in (role, 'administrator'): # Allow admin access too
                 if user.user_type == 'organizer' and role == 'attendee': # Organizer can access attendee pages
                     pass # Allow organizer to see attendee views
                 else:
                    flash('You do not have permission to access this page.', 'danger')
                    return redirect(url_for('index')) # Redirect to a safe page
            return f(*args, **kwargs)
        return decorated_function
    return wrapper

def organizer_required(f):
     """Simplified decorator for organizer role."""
     return login_required(role="organizer")(f)


# --- Routes ---
@app.route('/')
def index():
    """Home page displaying upcoming events."""
    events = Event.query.order_by(Event.date.asc()).limit(6).all() # Show upcoming events
    return render_template('index.html', events=events)

@app.route('/events')
def list_events():
    """Page displaying all events."""
    events = Event.query.order_by(Event.date.asc()).all()
    return render_template('events.html', events=events)

@app.route('/events/<int:event_id>')
def event_details(event_id):
    """Page displaying details for a specific event."""
    event = Event.query.get_or_404(event_id)
    # Fetch available ticket types for this event (assuming types are defined elsewhere or based on existing tickets)
    # For simplicity, let's simulate ticket types here. In reality, this might involve a TicketType model or logic.
    ticket_types = [
        {'type': 'general admission', 'price': 50.00},
        {'type': 'vip', 'price': 150.00}
    ] # Example
    return render_template('event_details.html', event=event, ticket_types=ticket_types)

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Handles user login."""
    if 'user_id' in session:
        return redirect(url_for('index')) # Already logged in

    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter_by(email=email).first()

        if user and check_password(user.password.encode('utf-8'), password):
            session['user_id'] = user.user_id
            session['user_name'] = user.name
            session['user_role'] = user.user_type
            flash('Login successful!', 'success')
            if user.user_type == 'organizer':
                 return redirect(url_for('dashboard'))
            else:
                 return redirect(url_for('index'))
        else:
            flash('Invalid email or password.', 'danger')

    return render_template('login.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    """Handles user registration."""
    if 'user_id' in session:
        return redirect(url_for('index')) # Already logged in

    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        user_type = request.form['user_type']

        if password != confirm_password:
            flash('Passwords do not match.', 'danger')
            return render_template('signup.html')

        hashed_pw = hash_password(password)

        new_user = User(name=name, email=email, password=hashed_pw, user_type=user_type)

        try:
            db.session.add(new_user)
            db.session.commit()
            flash('Account created successfully! Please log in.', 'success')
            return redirect(url_for('login'))
        except IntegrityError:
            db.session.rollback()
            flash('Email address already exists.', 'danger')
        except Exception as e:
             db.session.rollback()
             flash(f'An error occurred: {e}', 'danger')


    return render_template('signup.html')

@app.route('/logout')
def logout():
    """Logs the user out."""
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('index'))

# --- Organizer Routes (Require 'organizer' role) ---
@app.route('/dashboard')
@organizer_required
def dashboard():
    """Organizer dashboard."""
    # Fetch data relevant to the organizer (e.g., their events)
    # For now, just show all events as an example
    events = Event.query.order_by(Event.date.asc()).all()
    venues = Venue.query.all()
    speakers = Speaker.query.all()
    tickets = Ticket.query.all() # Be cautious with large datasets
    orders = Order.query.all()   # Be cautious with large datasets

    return render_template('dashboard.html',
                           events=events,
                           venues=venues,
                           speakers=speakers,
                           tickets=tickets,
                           orders=orders)


# --- CRUD Operations for Events (Organizer Only) ---

@app.route('/events/create', methods=['GET', 'POST'])
@organizer_required
def create_event():
    """Create a new event."""
    venues = Venue.query.order_by(Venue.name).all()
    if request.method == 'POST':
        name = request.form['name']
        description = request.form.get('description')
        date = request.form['date']
        time = request.form['time']
        location_id = request.form['location_id']

        new_event = Event(name=name, description=description, date=date, time=time, location_id=location_id)
        try:
            db.session.add(new_event)
            db.session.commit()
            flash('Event created successfully!', 'success')
            return redirect(url_for('dashboard'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error creating event: {e}', 'danger')

    return render_template('event_form.html', venues=venues, form_action=url_for('create_event'), form_title="Create New Event")


@app.route('/events/<int:event_id>/edit', methods=['GET', 'POST'])
@organizer_required
def edit_event(event_id):
    """Edit an existing event."""
    event = Event.query.get_or_404(event_id)
    venues = Venue.query.order_by(Venue.name).all()

    if request.method == 'POST':
        event.name = request.form['name']
        event.description = request.form.get('description')
        event.date = request.form['date']
        event.time = request.form['time']
        event.location_id = request.form['location_id']
        try:
            db.session.commit()
            flash('Event updated successfully!', 'success')
            return redirect(url_for('dashboard'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error updating event: {e}', 'danger')

    return render_template('event_form.html', event=event, venues=venues, form_action=url_for('edit_event', event_id=event_id), form_title="Edit Event")


@app.route('/events/<int:event_id>/delete', methods=['POST'])
@organizer_required
def delete_event(event_id):
    """Delete an event."""
    event = Event.query.get_or_404(event_id)
    try:
        # Manually delete related Speakers and Tickets if cascade doesn't work as expected
        # Speaker.query.filter_by(event_id=event_id).delete()
        # Ticket.query.filter_by(event_id=event_id).delete()
        db.session.delete(event)
        db.session.commit()
        flash('Event deleted successfully!', 'success')
    except Exception as e:
        db.session.rollback()
        flash(f'Error deleting event: {e}', 'danger')
    return redirect(url_for('dashboard'))


# --- CRUD Operations for Venues (Organizer Only) ---

@app.route('/venues/create', methods=['GET', 'POST'])
@organizer_required
def create_venue():
     if request.method == 'POST':
        name = request.form['name']
        address = request.form.get('address')
        capacity = request.form.get('capacity', type=int)
        city = request.form.get('city')
        state = request.form.get('state')
        zip_code = request.form.get('zip_code')
        new_venue = Venue(name=name, address=address, capacity=capacity, city=city, state=state, zip_code=zip_code)
        try:
             db.session.add(new_venue)
             db.session.commit()
             flash('Venue created successfully!', 'success')
             return redirect(url_for('dashboard'))
        except Exception as e:
             db.session.rollback()
             flash(f'Error creating venue: {e}', 'danger')
     return render_template('venue_form.html', form_action=url_for('create_venue'), form_title="Create New Venue")


@app.route('/venues/<int:venue_id>/edit', methods=['GET', 'POST'])
@organizer_required
def edit_venue(venue_id):
     venue = Venue.query.get_or_404(venue_id)
     if request.method == 'POST':
         venue.name = request.form['name']
         venue.address = request.form.get('address')
         venue.capacity = request.form.get('capacity', type=int)
         venue.city = request.form.get('city')
         venue.state = request.form.get('state')
         venue.zip_code = request.form.get('zip_code')
         try:
             db.session.commit()
             flash('Venue updated successfully!', 'success')
             return redirect(url_for('dashboard'))
         except Exception as e:
             db.session.rollback()
             flash(f'Error updating venue: {e}', 'danger')
     return render_template('venue_form.html', venue=venue, form_action=url_for('edit_venue', venue_id=venue_id), form_title="Edit Venue")


@app.route('/venues/<int:venue_id>/delete', methods=['POST'])
@organizer_required
def delete_venue(venue_id):
     venue = Venue.query.get_or_404(venue_id)
     if venue.events: # Check if venue is linked to events
          flash('Cannot delete venue. It is linked to existing events.', 'danger')
          return redirect(url_for('dashboard'))
     try:
         db.session.delete(venue)
         db.session.commit()
         flash('Venue deleted successfully!', 'success')
     except Exception as e:
         db.session.rollback()
         flash(f'Error deleting venue: {e}', 'danger')
     return redirect(url_for('dashboard'))


# --- CRUD Operations for Speakers (Organizer Only) ---

@app.route('/speakers/create', methods=['GET', 'POST'])
@organizer_required
def create_speaker():
     events = Event.query.order_by(Event.name).all()
     if request.method == 'POST':
         name = request.form['name']
         bio = request.form.get('bio')
         event_id = request.form['event_id']
         new_speaker = Speaker(name=name, bio=bio, event_id=event_id)
         try:
             db.session.add(new_speaker)
             db.session.commit()
             flash('Speaker created successfully!', 'success')
             return redirect(url_for('dashboard'))
         except Exception as e:
             db.session.rollback()
             flash(f'Error creating speaker: {e}', 'danger')
     return render_template('speaker_form.html', events=events, form_action=url_for('create_speaker'), form_title="Add New Speaker")


@app.route('/speakers/<int:speaker_id>/edit', methods=['GET', 'POST'])
@organizer_required
def edit_speaker(speaker_id):
     speaker = Speaker.query.get_or_404(speaker_id)
     events = Event.query.order_by(Event.name).all()
     if request.method == 'POST':
         speaker.name = request.form['name']
         speaker.bio = request.form.get('bio')
         speaker.event_id = request.form['event_id']
         try:
             db.session.commit()
             flash('Speaker updated successfully!', 'success')
             return redirect(url_for('dashboard'))
         except Exception as e:
             db.session.rollback()
             flash(f'Error updating speaker: {e}', 'danger')
     return render_template('speaker_form.html', speaker=speaker, events=events, form_action=url_for('edit_speaker', speaker_id=speaker_id), form_title="Edit Speaker")


@app.route('/speakers/<int:speaker_id>/delete', methods=['POST'])
@organizer_required
def delete_speaker(speaker_id):
     speaker = Speaker.query.get_or_404(speaker_id)
     try:
         db.session.delete(speaker)
         db.session.commit()
         flash('Speaker deleted successfully!', 'success')
     except Exception as e:
         db.session.rollback()
         flash(f'Error deleting speaker: {e}', 'danger')
     return redirect(url_for('dashboard'))


# --- CRUD Operations for Tickets (Conceptual - Booking is attendee, managing is organizer) ---
# Note: Full ticket CRUD might be complex. Organizer might manage ticket *types* per event.

@app.route('/events/<int:event_id>/tickets/manage')
@organizer_required
def manage_event_tickets(event_id):
    event = Event.query.get_or_404(event_id)
    # Fetch or define ticket types/pricing specific to this event
    # This could involve a separate TicketType model or simple management within the event
    flash("Ticket management feature is conceptual.", "info")
    # return render_template('manage_tickets.html', event=event)
    return redirect(url_for('dashboard'))


# --- Attendee Actions ---
@app.route('/book/<int:event_id>', methods=['POST'])
@login_required(role="attendee") # Only logged-in attendees can book
def book_ticket(event_id):
    """Handles ticket booking (Conceptual)."""
    event = Event.query.get_or_404(event_id)
    user_id = session['user_id']
    ticket_type = request.form.get('ticket_type')
    quantity = request.form.get('quantity', 1, type=int) # Example quantity

    # --- Placeholder Logic for Booking ---
    # 1. Validate ticket type and availability (check event capacity, ticket stock)
    # 2. Calculate total price
    # 3. Create Order record
    # 4. Create Ticket records linked to the Order and Event
    # 5. (Optional) Integrate with Payment gateway
    # 6. Update Payment record
    # 7. Commit transaction
    # --- End Placeholder ---

    flash(f"Booking {quantity} '{ticket_type}' ticket(s) for '{event.name}' (Feature under development).", "info")
    # In a real app, redirect to order confirmation or payment page
    return redirect(url_for('event_details', event_id=event_id))

@app.route('/my-tickets')
@login_required(role="attendee")
def my_tickets():
     """Displays tickets booked by the current attendee."""
     user_id = session['user_id']
     # Fetch orders and associated tickets for the user
     orders = Order.query.filter_by(user_id=user_id).options(db.joinedload(Order.tickets).joinedload(Ticket.event)).order_by(Order.date.desc()).all()
     # tickets = Ticket.query.join(Order).filter(Order.user_id == user_id).options(db.joinedload(Ticket.event)).all() # Alternative query
     return render_template('my_tickets.html', orders=orders)


# --- Main Execution ---
if __name__ == '__main__':
    with app.app_context():
        # Create database tables if they don't exist
        # In production, consider using Flask-Migrate for database migrations
        db.create_all()
    app.run(debug=True) # Set debug=False in production
