from rest_framework import serializers
from django.contrib.auth import authenticate
from . import models


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Certificate
        fields = '__all__'

    def create(self, validated_data):
        return models.Certificate.objects.create(**validated_data)


class VaccinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Vaccination
        fields = '__all__'

    def create(self, validated_data):
        return models.Vaccination.objects.create(**validated_data)


class CitizenSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Citizen
        fields = '__all__'


class VaccinationSpotSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.VaccinationSpot
        fields = '__all__'


class DistrictSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.District
        fields = '__all__'


class VaccineSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Vaccine
        fields = '__all__'


class VaccineManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.VaccineManufacturer
        fields = '__all__'


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Test
        fields = '__all__'


class TestingSpotSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TestingSpot
        fields = '__all__'


class HealthcareStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.HealthcareStaff
        fields = '__all__'


class VaccinationSpotHasHealthcareStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.VaccinationSpotHasHealthcareStaff
        fields = '__all__'


class RegistrationSerializer(serializers.ModelSerializer):
    """Serializers registration requests and creates a new user."""

    # Ensure passwords are at least 8 characters long, no longer than 128
    # characters, and can not be read by the client.
    password = serializers.CharField(
        max_length=128,
        write_only=True
    )

    # The client should not be able to send a token along with a registration
    # request. Making `token` read-only handles that for us.
    token = serializers.CharField(max_length=255, read_only=True)

    class Meta:
        model = models.CitizenUser
        # List all of the fields that could possibly be included in a request
        # or response, including fields specified explicitly above.
        fields = ['email', 'username', 'amka', 'password','date_of_birth', 'token']

    def create(self, validated_data):
        # Use the `create_user` method we wrote earlier to create a new user.
        return models.CitizenUser.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255, read_only=True)
    password = serializers.CharField(max_length=128, write_only=True)
    token = serializers.CharField(max_length=255, read_only=True)


    def validate(self, data):
        # The `validate` method is where we make sure that the current
        # instance of `LoginSerializer` has "valid". In the case of logging a
        # user in, this means validating that they've provided an email
        # and password and that this combination matches one of the users in
        # our database.
        username = data.get('username', None)
        password = data.get('password', None)

        if username is None:
            raise serializers.ValidationError(
                'A username is required to log in.'
            )

        if password is None:
            raise serializers.ValidationError(
                'A password is required to log in.'
            )

        # The `authenticate` method is provided by Django and handles checking
        # for a user that matches this email/password combination. Notice how
        # we pass `email` as the `username` value since in our User
        # model we set `USERNAME_FIELD` as `email`.
        user = authenticate(username=username, password=password)

        # If no user was found matching this email/password combination then
        # `authenticate` will return `None`. Raise an exception in this case.
        if user is None:
            raise serializers.ValidationError(
                'A user with this email and password was not found.'
            )

        # Django provides a flag on our `User` model called `is_active`. The
        # purpose of this flag is to tell us whether the user has been banned
        # or deactivated. This will almost never be the case, but
        # it is worth checking. Raise an exception in this case.
        if not user.is_active:
            raise serializers.ValidationError(
                'This user has been deactivated.'
            )

        # The `validate` method should return a dictionary of validated data.
        # This is the data that is passed to the `create` and `update` methods
        # that we will see later on.
        return {
            'username': user.username,
            'token': user.token
        }

