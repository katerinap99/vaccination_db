from datetime import *
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User, Group
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, permissions, status
from . import serializers, models


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        # ...

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class JWTViewSet(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        content = {}
        return Response(content)


class CertificateViewSet(viewsets.ModelViewSet):
    queryset = models.Certificate.objects.all()
    serializer_class = serializers.CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        if request.user.is_superuser == 1:
            serializer = self.serializer_class(self.queryset, many=True)
        else:
            serializer = self.serializer_class(self.action)(self.queryset.filter(amka=request.user.amka), many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        instance = get_object_or_404(self.queryset, pk=pk)
        instance_amka = getattr(instance, models.Certificate._meta.get_field('amka').attname)
        if request.user.is_superuser:
            serializer= self.serializer_class(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            if instance_amka == request.user.amka:
                serializer = self.serializer_class(instance)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(status = status.HTTP_403_FORBIDDEN)

    def user_has_requested_certificate(self, certificate_type, user_amka):
        if certificate_type == 'vax':
            user_appointments = models.Vaccination.objects.filter(amka=user_amka, took_place=1)
            if len(user_appointments)>2:
                return True
            return False
        elif certificate_type == 'test':  # certification of negative test
            negative_user_tests = models.Test.objects.filter(amka=user_amka, result='negative')
            if len(negative_user_tests) == 0:
                return False
            else:
                test_dates = [test.date for test in negative_user_tests]
                for date in test_dates:
                    if date < (date.today())-timedelta(days=7):
                        return False
                    return True
        elif certificate_type == 'desease': #certification of positive test: disease
            positive_user_tests = models.Test.objects.filter(amka=user_amka, result='positive')
            if len(positive_user_tests) > 0:
                return True

    def create(self, request):
        certificate_type = request.data.get('type',None)
        data = request.data
        if certificate_type is not None:
            user_eligible_for_requested_cert = self.user_has_requested_certificate(certificate_type, request.user.amka)
            if user_eligible_for_requested_cert:
                data['amka'] = request.user.amka
                data['issue_date'] = date.today()
                serializer = self.serializer_class(data=data)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        serializer.save()


class CitizenViewSet(viewsets.ModelViewSet):
    queryset = models.Citizen.objects.all()
    serializer_class = serializers.CitizenSerializer
    # permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        if request.user.is_superuser == 1:
            serializer = self.serializer_class(self.queryset, many=True)
        else:
            serializer = self.serializer_class(self.queryset.filter(amka=request.user.amka), many=True)
        return Response(serializer.data)

    def create(self, request):
        data = request.data
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class VaccinationSpotsViewSet(viewsets.ModelViewSet):
    queryset = models.VaccinationSpot.objects.all()
    serializer_class = serializers.VaccinationSpotSerializer
    permission_classes = [permissions.IsAuthenticated]

    def vax_spots_with_free_slots(self, vax_spots, date):
        """ Calculates if vax spots have reached their appointment capacity"""
        spots_with_free_slots = []
        for vax_spot in vax_spots:
            free_slots = models.Vaccination.objects.filter(vax_spot_id=vax_spot.vax_spot_id, took_place=0)
            free_slots_for_requested_date = free_slots.filter(date=date)
            if len(free_slots_for_requested_date) < vax_spot.capacity:
                spots_with_free_slots.append(vax_spot)
        return spots_with_free_slots

    def list(self, request):
        requested_district = request.query_params.get('district_name',None)
        # get the first vax spot in the requested district, regardless of its availability
        vax_spots_in_district = self.queryset.filter(district_name=requested_district)
        requested_date = request.query_params.get('date',None)
        available_spots = self.vax_spots_with_free_slots(vax_spots_in_district, requested_date)
        serializer = serializers.VaccinationSpotSerializer(available_spots, many=True)
        return Response(serializer.data)


class VaccinationViewSet(viewsets.ModelViewSet):
    queryset = models.Vaccination.objects.all()
    serializer_class = serializers.VaccinationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        if request.user.is_superuser:
            if request.query_params.get('amka', None) is not None:
                serializer = self.serializer_class(self.queryset.filter(amka=request.query_params['amka']), many=True)
            else:
                serializer = self.serializer_class(self.queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            serializer = self.serializer_class(self.queryset.filter(amka=request.user.amka), many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, pk=None):
        instance = get_object_or_404(self.queryset, pk=pk)
        instance_amka = getattr(instance, models.Certificate._meta.get_field('amka').attname)
        if request.user.is_superuser:
            serializer= self.serializer_class(instance)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            if instance_amka == request.user.amka:
                serializer = self.serializer_class(instance)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(status = status.HTTP_403_FORBIDDEN)

    def assign_vaccine_to_appointment(self, vax_spot):
        """ Each appointment creation requires a vaccine to be assigned. Thus, we check the available vaccines
        for the selected vax spot, check which ones have not been assigned to another vaccination and assign one
        to this vaccination appointment. """
        available_vaccines_in_spot = models.Vaccine.objects.filter(vax_spot_id=vax_spot)
        assigned_vaccines = [str(vaccine) for vaccine in list(models.Vaccination.objects.all().values_list('vaccine_id', flat=True))]
        non_assigned_vaccines = available_vaccines_in_spot.exclude(vaccine_id__in=assigned_vaccines)
        if len(non_assigned_vaccines) > 0:
            vaccine_to_assign = non_assigned_vaccines[0].vaccine_id
            return vaccine_to_assign
        return None

    def create(self, request):
        data = request.data
        data['amka'] = request.user.amka
        data['took_place'] = 0
        requested_vax_spot = request.data.get('vax_spot', None)
        available_vaccine = self.assign_vaccine_to_appointment(requested_vax_spot)
        if available_vaccine is not None:
            data['vaccine'] = available_vaccine
            print(available_vaccine)
            serializer = self.serializer_class(data=data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def perform_create(self, serializer):
        serializer.save()

    def partial_update(self, request, pk=None):
        instance = self.get_object()
        data = request.data
        if request.user.is_superuser:
            data['took_place'] = 1  # confirm appointment taking place -> appointment counts as vaccination
            serializer = self.serializer_class(instance, data=data, partial=True)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)


class DistrictViewSet(viewsets.ModelViewSet):
    queryset = models.District.objects
    serializer_class = serializers.DistrictSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class VaccineViewSet(viewsets.ModelViewSet):
    queryset = models.Vaccine.objects
    serializer_class = serializers.VaccineSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class VaccineManufacturerViewSet(viewsets.ModelViewSet):
    queryset = models.VaccineManufacturer.objects
    serializer_class = serializers.VaccineManufacturerSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class TestViewSet(viewsets.ModelViewSet):
    queryset = models.Test.objects
    serializer_class = serializers.TestSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class TestingSpotViewSet(viewsets.ModelViewSet):
    queryset = models.TestingSpot.objects
    serializer_class = serializers.TestingSpotSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class HealthcareStaffViewSet(viewsets.ModelViewSet):
    queryset = models.HealthcareStaff.objects
    serializer_class = serializers.HealthcareStaffSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


class VaccinationSpotHasHealthcareStaffViewSet(viewsets.ModelViewSet):
    queryset = models.VaccinationSpotHasHealthcareStaff.objects
    serializer_class = serializers.VaccinationSpotHasHealthcareStaffSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]


# auth views
class RegistrationAPIView(APIView):
    # Allow any user (authenticated or not) to hit this endpoint.
    permission_classes = (AllowAny,)
    serializer_class = serializers.RegistrationSerializer

    def post(self, request):
        user = request.data.get('user', {})

        # The create serializer, validate serializer, save serializer pattern
        # below is common and you will see it a lot throughout this course and
        # your own work later on. Get familiar with it.
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
    permission_classes = (AllowAny,)
    serializer_class = serializers.LoginSerializer

    def post(self, request):
        user = request.data.get('user', {})
        # Notice here that we do not call `serializer.save()` like we did for
        # the registration endpoint. This is because we don't  have
        # anything to save. Instead, the `validate` method on our serializer
        # handles everything we need.
        serializer = self.serializer_class(data=user)
        serializer.is_valid(raise_exception=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
