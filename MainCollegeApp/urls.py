from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from CollegeManagementSys.views import LoginView

def health_check(request):
    return JsonResponse({"status": "ok", "service": "college-management-api"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/', include('CollegeManagementSys.urls')),
    path('', health_check, name='health-check'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
