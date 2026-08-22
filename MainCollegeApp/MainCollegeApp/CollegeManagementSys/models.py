from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES=(
        ('admin','Admin'),
        ('faculty','Faculty'),
        ('student','Student'),
    )
    role=models.CharField(max_length=20,choices=ROLE_CHOICES, default='student')
    must_change_password=models.BooleanField(default=True)
    is_first_login=models.BooleanField(default=True)

    def __str__(self):
        return f'{self.username} ({self.role})'
class Department(models.Model):
    name=models.CharField(max_length=100,unique=True)
    code=models.CharField(max_length=10,unique=True)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


BLOOD_GROUP_CHOICES = (
    ('A+', 'A+'), ('A-', 'A-'),
    ('B+', 'B+'), ('B-', 'B-'),
    ('O+', 'O+'), ('O-', 'O-'),
    ('AB+', 'AB+'), ('AB-', 'AB-'),
)

GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    )

class Student(models.Model):
    YEAR_CHOICES = (
        (1, '1st Year'),
        (2, '2nd Year'),
        (3, '3rd Year'),
        (4, '4th Year'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE,blank=True,null=True,unique=True ,related_name="student_profile")

    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name="students")

    roll_no = models.CharField(max_length=20, unique=True)
    year = models.IntegerField(choices=YEAR_CHOICES,blank=True,null=True)

    profile_pic = models.ImageField(upload_to="student_profiles/", null=True, blank=True)
    mobile_no = models.CharField(max_length=15, null=True, blank=True)
    dob = models.DateField(null=True, blank=True)

    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES, null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)

    address = models.TextField(null=True, blank=True)

    guardian_name = models.CharField(max_length=100, null=True, blank=True)
    guardian_contact = models.CharField(max_length=15, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def clean(self):
        # ✅ Limit 30 students per year per department
        count = Student.objects.filter(
            department=self.department,
            year=self.year
        ).exclude(id=self.id).count()

        if count >= 30:
            raise ValidationError("Only 30 students allowed per year in this department")

    def __str__(self):
        return f"{self.name} ({self.roll_no})"


class Faculty(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,null=True,blank=True ,unique=True,related_name="faculty_profile")

    name = models.CharField(max_length=100)
    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name="faculties")

    profile_pic = models.ImageField(upload_to="faculty_profiles/", null=True, blank=True)
    mobile_no = models.CharField(max_length=15, null=True, blank=True)

    highest_qualification = models.CharField(max_length=100, null=True, blank=True)
    specialization = models.CharField(max_length=100, null=True, blank=True)
    university = models.CharField(max_length=150, null=True, blank=True)
    experience_years = models.IntegerField(null=True, blank=True)

    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES, null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Fee(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="fees")

    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    payment_date = models.DateField(null=True, blank=True)

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('partial', 'Partial'),
        ('paid', 'Paid'),
    )
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def balance(self):
        return self.total_amount - self.paid_amount

    def save(self, *args, **kwargs):
        if self.paid_amount == 0:
            self.status = 'pending'
        elif self.paid_amount < self.total_amount:
            self.status = 'partial'
        else:
            self.status = 'paid'

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.name} - {self.status}"
    
class Semester(models.Model):
    student=models.ForeignKey(Student,on_delete=models.CASCADE,related_name='semesters')
    sem_no=models.IntegerField()
    gpa=models.FloatField()
    created_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering=['-created_at']
    def clean(self):
        if self.sem_no > 4:
            raise ValidationError("Maximum 4 semesters allowed")

    def __str__(self):
        return f'{self.student.user.username} - Sem {self.sem_no}'


class Leave(models.Model):
    STATUS_CHOICES = (
        ('pending','Pending'),
        ('approved','Approved'),
        ('rejected','Rejected'),
    )

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='leaves')
    reason = models.TextField()
    from_date = models.DateField()
    to_date = models.DateField()

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    approved_by = models.ForeignKey(
        Faculty,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def clean(self):
        if self.to_date < self.from_date:
            raise ValidationError("Invalid date range")

    # Optional: prevent overlapping leaves
        if Leave.objects.filter(
            student=self.student,
            from_date__lte=self.to_date,
            to_date__gte=self.from_date
        ).exclude(id=self.id).exists():
            raise ValidationError("Overlapping leave exists")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.student.name} - {self.status}'

