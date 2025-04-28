# EventFlow - Flask Edition

This is a Flask-based web application for managing events.

## Features

- User Authentication (Organizer & Attendee roles)
- Event Browsing & Booking (Attendees)
- CRUD Operations for Events, Venues, Speakers, Tickets (Organizers)

## Setup

1.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

2.  **Configure Database:**
    - Create a MySQL database based on the provided schema.
    - Update database connection details in `config.py` or via environment variables.

3.  **Run the Application:**
    ```bash
    flask run
    ```

    The application will be available at `http://127.0.0.1:5000`.

## Database Schema

Refer to the `schema.sql` file for the database table structure.
