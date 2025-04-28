#!/usr/bin/env python
"""
Clean Data Script for EventFlow

This script cleans all data from the database tables except the users table.
It's useful for testing and resetting the application state.
"""

import os
from app import app, db, User, Event, Venue, Ticket, Order, Payment, Speaker, TicketType

def clean_data():
    """Clean all data from the database tables except the users table."""
    with app.app_context():
        print("Starting data cleanup...")
        
        # Delete data in reverse order of dependencies
        print("Deleting tickets...")
        Ticket.query.delete()
        
        print("Deleting ticket types...")
        TicketType.query.delete()
        
        print("Deleting payments...")
        Payment.query.delete()
        
        print("Deleting orders...")
        Order.query.delete()
        
        print("Deleting speakers...")
        Speaker.query.delete()
        
        print("Deleting events...")
        Event.query.delete()
        
        print("Deleting venues...")
        Venue.query.delete()
        
        # Commit the changes
        db.session.commit()
        
        print("Data cleanup completed successfully!")
        print("All tables have been cleared except the users table.")

if __name__ == "__main__":
    # Ask for confirmation before proceeding
    confirm = input("This will delete all data from the database except users. Are you sure? (y/n): ")
    if confirm.lower() == 'y':
        clean_data()
    else:
        print("Operation cancelled.") 