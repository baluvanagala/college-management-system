from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    StudentViewSet, FacultyViewSet, DepartmentViewSet,
    LeaveViewSet, SemesterViewSet, FeeViewSet,
    DashboardStatsView, UserViewSet
)

router = DefaultRouter()
router.register("students", StudentViewSet, basename='student')
router.register("faculty", FacultyViewSet, basename='faculty')
router.register("departments", DepartmentViewSet, basename='department')
router.register("leaves", LeaveViewSet, basename='leave')
router.register("semesters", SemesterViewSet, basename='semester')
router.register("fees", FeeViewSet, basename='fee')
router.register("users", UserViewSet, basename='user')

urlpatterns = [
    path("", include(router.urls)),
    path("dashboard/", DashboardStatsView.as_view(), name='dashboard'),
]