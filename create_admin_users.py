from app import app, db, User, hash_password
from datetime import datetime

def create_admin_users():
    with app.app_context():
        # Create administrator account
        admin = User(
            name="System Administrator",
            email="admin@eventhub.com",
            password=hash_password("Admin@123"),  # Strong password
            user_type="administrator"
        )

        # Create organizer accounts
        organizer1 = User(
            name="Event Organizer 1",
            email="organizer1@eventhub.com",
            password=hash_password("Org1@123"),  # Strong password
            user_type="organizer"
        )

        organizer2 = User(
            name="Event Organizer 2",
            email="organizer2@eventhub.com",
            password=hash_password("Org2@123"),  # Strong password
            user_type="organizer"
        )

        try:
            # Add users to database
            db.session.add(admin)
            db.session.add(organizer1)
            db.session.add(organizer2)
            db.session.commit()
            print("Successfully created administrator and organizer accounts!")
            print("\nLogin credentials:")
            print("Administrator:")
            print("Email: admin@eventhub.com")
            print("Password: Admin@123")
            print("\nOrganizer 1:")
            print("Email: organizer1@eventhub.com")
            print("Password: Org1@123")
            print("\nOrganizer 2:")
            print("Email: organizer2@eventhub.com")
            print("Password: Org2@123")
        except Exception as e:
            db.session.rollback()
            print(f"Error creating accounts: {e}")

if __name__ == "__main__":
    create_admin_users() 