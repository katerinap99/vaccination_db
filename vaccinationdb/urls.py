"""vaccinationdb URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from . import views
from rest_framework_simplejwt import views as jwt_views

router = routers.DefaultRouter()
router.register(r'certificate', views.CertificateViewSet)
router.register(r'citizenDetails', views.CitizenViewSet)
router.register(r'vaccination_spots', views.VaccinationSpotsViewSet)
router.register(r'appointment', views.VaccinationViewSet)
router.register(r'districts', views.DistrictViewSet)
router.register(r'verifiableappointments', views.AppointmentsViewSet)
router.register(r'test', views.TestViewSet)
router.register(r'testing_spot', views.TestingSpotViewSet)
router.register(r'healthcare_stuff', views.HealthcareStaffViewSet)
router.register('vaccines', views.VaccineViewSet)
router.register('vaccine_manufacturers', views.VaccineManufacturerViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('jwt/', views.JWTViewSet.as_view(), name='jwt'),
    path('register/', views.RegistrationAPIView.as_view()),
]
