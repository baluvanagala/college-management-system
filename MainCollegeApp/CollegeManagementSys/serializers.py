from rest_framework import serializers
from .models import User, Student, Faculty, Department, Semester, Leave, Fee
from django.db.models import Avg


# User
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "role"]


# Department
class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = "__all__"


# Student
class StudentSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    cgpa = serializers.SerializerMethodField()
    
    # Auth fields for creation
    username = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Student
        fields = "__all__"
        
    def get_cgpa(self, obj):
        semesters = obj.semesters.all()
        if semesters.exists():
            return round(semesters.aggregate(avg=Avg("gpa"))["avg"], 2)
        return 0
    
    def create(self, validated_data):
        # Extract username and password before creating the Student
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)
        user = None
        
        if username and password:
            # Check if username already exists
            if User.objects.filter(username=username).exists():
                raise serializers.ValidationError({"username": f"Username '{username}' already exists. Please choose a different username."})
            user = User.objects.create_user(username=username, password=password, role='student')
        
        validated_data['user'] = user
        return super().create(validated_data)


# Faculty
class FacultySerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source="department.name", read_only=True)
    username_display = serializers.CharField(source="user.username", read_only=True)
    
    # Auth fields for creation
    username = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Faculty
        fields = "__all__"
    
    def create(self, validated_data):
        # Extract username and password before creating the Faculty
        username = validated_data.pop('username', None)
        password = validated_data.pop('password', None)
        user = None
        
        if username and password:
            # Check if username already exists
            if User.objects.filter(username=username).exists():
                raise serializers.ValidationError({"username": f"Username '{username}' already exists. Please choose a different username."})
            user = User.objects.create_user(username=username, password=password, role='faculty')
        
        validated_data['user'] = user
        return super().create(validated_data)


#  Semester
class SemesterSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.name", read_only=True)

    class Meta:
        model = Semester
        fields = "__all__"


# Leave
class LeaveSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.name", read_only=True)
    student_username = serializers.CharField(source="student.user.username", read_only=True)
    student_department = serializers.CharField(source="student.department.name", read_only=True)

    class Meta:
        model = Leave
        fields = "__all__"


# Fee
class FeeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.name", read_only=True)
    balance = serializers.ReadOnlyField()

    class Meta:
        model = Fee
        fields = "__all__"