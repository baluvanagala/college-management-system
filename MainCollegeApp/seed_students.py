import os
import django
import random

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'MainCollegeApp.settings')
django.setup()

from CollegeManagementSys.models import Student, User, Department

def seed_students():
    names = [
        'Aarav', 'Vihaan', 'Aditya', 'Arjun', 'Sai', 'Ishaan', 'Ananya', 'Diya', 'Rhea', 'Tara', 
        'Myra', 'Kiaan', 'Kabir', 'Vivaan', 'Advait', 'Ayaan', 'Jiya', 'Sana', 'Meher', 'Sara',
        'Ishita', 'Arnav', 'Pranav', 'Rohan', 'Sneha', 'Tanvi', 'Veda', 'Yash', 'Zoya', 'Kavya',
        'Nikhil', 'Harshit', 'Akshay', 'Varun', 'Rahul', 'Kunal', 'Ankush', 'Harsh', 'Priya', 'Neha',
        'Shweta', 'Isha', 'Pooja', 'Rani', 'Shreya', 'Sunita', 'Geeta', 'Priyanka', 'Divya', 'Anushka'
    ]
    depts = list(Department.objects.all())
    
    if not depts:
        print("No departments found. Please create departments first.")
        return

    for i, name in enumerate(names, 1):
        uname = f"{name.lower()}{i}" if i > 1 else name.lower()
        if not User.objects.filter(username=uname).exists():
            user = User.objects.create_user(username=uname, password='1234', role='student')
            dept = random.choice(depts)
            year = random.randint(1, 4)
            roll = f"{random.randint(10, 99)}CMS{random.randint(100, 999)}"
            
            Student.objects.create(
                user=user,
                name=name,
                roll_no=roll,
                department=dept,
                year=year,
                mobile_no=f"98{random.randint(10000000, 99999999)}",
                dob="2004-05-15",
                gender=random.choice(['male', 'female']),
                address=f"{random.randint(1, 100)} Street, Hyderabad",
                guardian_name=f"Parent of {name}",
                guardian_contact=f"91{random.randint(10000000, 99999999)}"
            )
            print(f"✅ Added Student: {name} | Username: {uname} | Dept: {dept.name} | Year: {year}")
        else:
            print(f"⚠️  User {uname} already exists, skipping.")

if __name__ == "__main__":
    seed_students()
