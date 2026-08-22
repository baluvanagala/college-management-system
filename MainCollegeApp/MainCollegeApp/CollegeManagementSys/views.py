from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions, serializers
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action
from .models import Student, Faculty, Department, Leave, Semester, Fee
from .serializers import StudentSerializer, FacultySerializer, DepartmentSerializer, UserSerializer, LeaveSerializer, SemesterSerializer, FeeSerializer
from .permissions import IsAdminUserOnly
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from django.db.models import Count
from rest_framework.filters import SearchFilter

User = get_user_model()


# 🔥 LOGIN
class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user is None:
            return Response({"error": "Invalid credentials"}, status=400)

        refresh = RefreshToken.for_user(user)

        data = {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "role": user.role,
            "username": user.username,
            "user_id": user.id,
        }

        # ✅ Send student_id if student
        if user.role == "student":
            try:
                prof = user.student_profile
                data["student_id"] = prof.id
                if prof.profile_pic:
                    data["profile_pic"] = request.build_absolute_uri(prof.profile_pic.url)
            except Exception:
                pass

        # ✅ Send faculty_id if faculty
        if user.role == "faculty":
            try:
                prof = user.faculty_profile
                data["faculty_id"] = prof.id
                if prof.profile_pic:
                    data["profile_pic"] = request.build_absolute_uri(prof.profile_pic.url)
            except Exception:
                pass

        return Response(data)


# 🔥 ADMIN DASHBOARD
class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUserOnly]

    def get(self, request):
        return Response({
            "students": Student.objects.count(),
            "faculty": Faculty.objects.count(),
            "departments": Department.objects.count(),
            "pending_leaves": Leave.objects.filter(status='pending').count()
        })


# 🔥 STUDENT VIEWSET
class StudentViewSet(ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ["name", "roll_no", "department__name"]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            qs = Student.objects.all()
        elif user.role == "faculty":
            qs = Student.objects.filter(department=user.faculty_profile.department)
        elif user.role == "student":
            qs = Student.objects.filter(user=user)
        else:
            return Student.objects.none()

        # Optional year filter
        year = self.request.query_params.get("year")
        if year:
            qs = qs.filter(year=year)

        # Optional department filter
        dept = self.request.query_params.get("department")
        if dept:
            qs = qs.filter(department_id=dept)

        return qs

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=["get"])
    def semester_graph(self, request, pk=None):
        student = self.get_object()
        data = student.semesters.order_by("sem_no").values("sem_no", "gpa")
        return Response(data)


# 🔥 FACULTY VIEWSET
class FacultyViewSet(ModelViewSet):
    queryset = Faculty.objects.all()
    serializer_class = FacultySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ["name", "department__name"]

    def perform_create(self, serializer):
        serializer.save()

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return Faculty.objects.all()
        elif user.role == "faculty":
            return Faculty.objects.filter(user=user)
        return Faculty.objects.none()


# 🔥 DEPARTMENT VIEWSET
class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return Department.objects.all()
        if user.role == "faculty":
            return Department.objects.filter(faculties__user=user)
        return Department.objects.all()

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsAdminUserOnly()]
        return [IsAuthenticated()]


# 🔥 USER VIEWSET
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


# 🔥 LEAVE VIEWSET
class LeaveViewSet(ModelViewSet):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Leave.objects.none()

        if user.role == "admin":
            return Leave.objects.all().order_by('-created_at')
        
        elif user.role == "faculty":
            try:
                # Get the department ID directly from the faculty profile
                dept_id = user.faculty_profile.department_id
                # Filter leaves where student belongs to the same department
                return Leave.objects.filter(student__department_id=dept_id).order_by('-created_at')
            except (AttributeError, Faculty.DoesNotExist):
                return Leave.objects.none()
        
        elif user.role == "student":
            try:
                # Filter leaves for the specific student profile linked to this user
                return Leave.objects.filter(student__user=user).order_by('-created_at')
            except (AttributeError, Student.DoesNotExist):
                return Leave.objects.none()
        
        return Leave.objects.none()

    def perform_create(self, serializer):
        # If a student is applying, automatically link their profile
        if self.request.user.role == "student":
            try:
                student_profile = self.request.user.student_profile
                serializer.save(student=student_profile, status='pending')
            except Student.DoesNotExist:
                raise serializers.ValidationError("Student profile not found for this user.")
        else:
            serializer.save()

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        leave = self.get_object()
        leave.status = "approved"
        leave.approved_by = request.user.faculty_profile
        leave.save()
        return Response({"message": "Leave approved"})

    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        leave = self.get_object()
        leave.status = "rejected"
        leave.approved_by = request.user.faculty_profile
        leave.save()
        return Response({"message": "Leave rejected"})


# 🔥 FEE VIEWSET
class FeeViewSet(ModelViewSet):
    queryset = Fee.objects.all()
    serializer_class = FeeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return Fee.objects.all()
        elif user.role == "student":
            return Fee.objects.filter(student__user=user)
        return Fee.objects.none()


# 🔥 DASHBOARD STATS
class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = {}
        user = request.user

        if user.role == "admin":
            data["total_students"] = Student.objects.count()
            data["total_faculty"] = Faculty.objects.count()
            data["total_departments"] = Department.objects.count()
            data["pending_leaves"] = Leave.objects.filter(status="pending").count()
            data["year_wise"] = list(
                Student.objects.values("year").annotate(count=Count("id"))
            )
            data["department_wise"] = list(
                Student.objects.values("department__name").annotate(count=Count("id"))
            )
            data["leave_stats"] = list(
                Leave.objects.values("status").annotate(count=Count("id"))
            )
            data["fee_stats"] = list(
                Fee.objects.values("status").annotate(count=Count("id"))
            )
            data["total_fees_collected"] = sum(f.paid_amount for f in Fee.objects.all())
            data["pending_fees_count"] = Fee.objects.filter(status='pending').count()
        elif user.role == "faculty":
            try:
                prof = user.faculty_profile
                dept = prof.department
                data["name"] = prof.name
                if prof.profile_pic:
                    data["profile_pic"] = request.build_absolute_uri(prof.profile_pic.url)
                data["total_students"] = Student.objects.filter(department_id=dept.id).count()
                data["pending_leaves"] = Leave.objects.filter(
                    student__department_id=dept.id, status="pending"
                ).count()
                data["year_wise"] = list(
                    Student.objects.filter(department_id=dept.id)
                    .values("year")
                    .annotate(count=Count("id"))
                )
                data["leave_stats"] = list(
                    Leave.objects.filter(student__department_id=dept.id)
                    .values("status")
                    .annotate(count=Count("id"))
                )
            except Exception as e:
                data["error"] = "Faculty profile not fully configured."
        elif user.role == "student":
            try:
                student = user.student_profile
                data["name"] = student.name
                data["roll_no"] = student.roll_no
                data["department_name"] = student.department.name
                if student.profile_pic:
                    data["profile_pic"] = request.build_absolute_uri(student.profile_pic.url)
                data["total_semesters"] = student.semesters.count()
                data["pending_leaves"] = student.leaves.filter(status="pending").count()
                data["semester_results"] = list(
                    student.semesters.order_by("sem_no").values("sem_no", "gpa")
                )
                fee = student.fees.first()
                if fee:
                    data["fee_status"] = fee.status
                    data["fee_balance"] = float(fee.balance)
                else:
                    data["fee_status"] = "No Record"
                    data["fee_balance"] = 0.0
            except Exception:
                data["error"] = "Student profile not found"

        return Response(data)


# 🔥 SEMESTER VIEWSET
class SemesterViewSet(ModelViewSet):
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role == "admin":
            queryset = Semester.objects.all()
        elif user.role == "faculty":
            queryset = Semester.objects.filter(
                student__department=user.faculty_profile.department
            )
        elif user.role == "student":
            queryset = Semester.objects.filter(student__user=user)
        else:
            return Semester.objects.none()

        # Filter by student_id if provided
        student_id = self.request.query_params.get("student")
        if student_id:
            queryset = queryset.filter(student_id=student_id)

        return queryset