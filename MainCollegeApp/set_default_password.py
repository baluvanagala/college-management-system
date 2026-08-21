import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MainCollegeApp.settings')
django.setup()

from CollegeManagementSys.models import Student, User

def set_default_passwords():
    """Set default password '1234' for all students"""
    
    # Get all students
    students = Student.objects.all()
    
    if not students.exists():
        print("⚠️  No students found in the database.")
        return
    
    count = 0
    skipped = 0
    
    for student in students:
        try:
            # Check if user exists
            if not student.user:
                print(f"⚠️  Skipped: {student.name} - No associated user account")
                skipped += 1
                continue
            
            # Set password to 1234
            student.user.set_password('1234')
            student.user.save()
            count += 1
            print(f"✅ {student.name} ({student.user.username}) - Password: 1234")
        except Exception as e:
            print(f"❌ Error updating {student.name}: {str(e)}")
            skipped += 1
    
    print(f"\n📊 Summary:")
    print(f"✅ Successfully updated: {count} students")
    print(f"⚠️  Skipped/Errors: {skipped} students")
    print(f"📝 Default password for all students: 1234")

if __name__ == "__main__":
    set_default_passwords()
