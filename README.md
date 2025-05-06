# EventFlow
EventFlow is a comprehensive event management platform built with Flask that allows organizers to create and manage events while enabling attendees to browse, book tickets, and manage their event participation.

## Features

### For Attendees
- **User Authentication**: Secure signup and login system
- **Event Discovery**: Browse through available events with detailed information
- **Ticket Booking**: Book tickets for events with multiple ticket types
- **Ticket Management**: View and manage your booked tickets
- **Ticket Cancellation**: Cancel tickets with automatic refund processing

### For Organizers
- **Dashboard**: Comprehensive dashboard with event statistics and management tools
- **Event Management**: Create, edit, and delete events
- **Venue Management**: Add and manage venues for events
- **Speaker Management**: Add speakers to events with their details
- **Ticket Management**: Create and manage different ticket types with pricing
- **Order Overview**: View all orders and tickets sold for your events

## Project Structure
```
EventFlow/
├── app.py              # Main application file
├── config.py           # Configuration settings
├── requirements.txt    # Python dependencies
├── schema.sql          # Database schema
├── create_admin_users.py  # Admin user creation script
├── clean_data.py       # Database cleanup utility
├── migrations/         # Database migration files
├── static/            # Static assets (CSS, JS, images)
├── templates/         # HTML templates
└── .env               # Environment variables (create this file)
```

## Getting Started

### Prerequisites
- Python 3.8 or higher
- MySQL 5.7 or higher
- pip (Python package manager)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tanishpoddar/EventFlow.git
   cd EventFlow
   ```

2. **Create and activate a virtual environment (recommended)**
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On Unix or MacOS
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the project root with the following variables:
   ```
   FLASK_APP=app.py
   FLASK_ENV=development
   DATABASE_URL=mysql://username:password@localhost/eventflow
   SECRET_KEY=your-secret-key-here
   ```

5. **Set up the database**
   - Create a MySQL database named `eventflow`
   - Initialize the database schema:
     ```bash
     flask db upgrade
     ```

6. **Create admin users (optional)**
   ```bash
   python create_admin_users.py
   ```

7. **Run the application**
   ```bash
   flask run
   ```
   The application will be available at `http://127.0.0.1:5000`

## Development

### Database Management
- **Migrations**: Use Flask-Migrate for database migrations
  ```bash
  flask db migrate -m "Migration message"
  flask db upgrade
  ```

- **Clean Data**: To clean all data except users:
  ```bash
  python clean_data.py
  ```

### Code Style
- The project uses `.hintrc` for code style guidelines
- Follow PEP 8 standards for Python code

## Database Schema

EventFlow uses a relational database with the following main tables:

- **User**: Stores user information and roles
- **Event**: Contains event details including name, description, date, and venue
- **Venue**: Stores venue information
- **Speaker**: Contains speaker details linked to events
- **TicketType**: Defines different ticket types for events
- **Ticket**: Represents individual tickets booked by users
- **Order**: Groups tickets purchased by a user
- **Payment**: Records payment information for orders

For detailed schema information, refer to the `schema.sql` file.

## Configuration

The application can be configured through:

1. **Environment Variables**: Set in `.env` file
2. **config.py**: Contains default configuration values
3. **Flask Configuration**: Use Flask's configuration system for additional settings

## License

This project is licensed under the GNU General Public License v3.0 License - see the LICENSE file for details.
