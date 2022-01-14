# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
import jwt
from datetime import datetime, timedelta
from django.conf import settings


class Certificate(models.Model):
    certificate_id = models.BigAutoField(primary_key=True)
    issue_date = models.DateField()
    type = models.CharField(max_length=7)
    amka = models.ForeignKey('Citizen', models.DO_NOTHING, db_column='amka', unique=True)

    class Meta:
        db_table = 'certificate'


class Citizen(models.Model):
    amka = models.CharField(primary_key=True, max_length=11, blank=False)
    full_name = models.CharField(max_length=25)
    date_of_birth = models.DateField()

    class Meta:
        db_table = 'citizen'


class CitizenUserManager(BaseUserManager):
    """
    Django requires that custom users define their own Manager class. By
    inheriting from `BaseUserManager`, we get a lot of the same code used by
    Django to create a `User`.

    All we have to do is override the `create_user` function which we will use
    to create `User` objects.
    """

    def create_user(self, username, email, amka, date_of_birth, first_name, last_name, password=None):
        """Create and return a `User` with an email, username and password."""
        if username is None or amka is None:
            raise TypeError('Users must have a username and amka.')
        if date_of_birth is None:
            raise TypeError('Users must have a date of birth')

        if email is None:
            raise TypeError('Users must have an email address.')

        user = self.model(username=username, email=self.normalize_email(email), amka=amka, date_of_birth=date_of_birth,
                          first_name=first_name , last_name=last_name)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, amka, password):
        """
        Create and return a `User` with superuser (admin) permissions.
        """
        if password is None:
            raise TypeError('Superusers must have a password.')

        user = self.create_user(username, email, amka, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user


class CitizenUser(AbstractUser):
    email = models.EmailField()
    amka = models.CharField(max_length=11)
    date_of_birth = models.DateField()
    REQUIRED_FIELDS = ['first_name', 'last_name', 'amka', 'date_of_birth']
    USERNAME_FIELD = 'username'
    objects = CitizenUserManager()

    @property
    def token(self):
        """
        Allows us to get a user's token by calling `user.token` instead of
        `user.generate_jwt_token().

        The `@property` decorator above makes this possible. `token` is called
        a "dynamic property".
        """
        return self._generate_jwt_token()

    def _generate_jwt_token(self):
        """
        Generates a JSON Web Token that stores this user's ID and has an expiry
        date set to 60 days into the future.
        """
        dt = datetime.now() + timedelta(days=1)

        token = jwt.encode({
            'id': self.pk,
            'exp': dt.utcfromtimestamp(dt.timestamp())
        }, settings.SECRET_KEY, algorithm='HS256')

        return token.decode('utf-8')


class District(models.Model):
    district_name = models.CharField(primary_key=True, max_length=13)
    governor = models.CharField(max_length=25)
    population = models.PositiveIntegerField()

    class Meta:
        db_table = 'district'


class HealthcareStaff(models.Model):
    employee_id = models.BigAutoField(primary_key=True)
    medical_specialty = models.CharField(max_length=25)
    amka = models.CharField(unique=True, max_length=11)
    vaccine_received = models.CharField(max_length=15)

    class Meta:
        db_table = 'healthcare_staff'


class Test(models.Model):
    test_id = models.BigAutoField(primary_key=True)
    result = models.CharField(max_length=8)
    type = models.CharField(max_length=5)
    date = models.DateField()
    testing_spot = models.ForeignKey('TestingSpot', models.DO_NOTHING)
    amka = models.ForeignKey(Citizen, models.DO_NOTHING, db_column='amka')

    class Meta:
        db_table = 'test'


class TestingSpot(models.Model):
    testing_spot_id = models.BigAutoField(primary_key=True)
    address = models.CharField(max_length=35)
    inventory = models.PositiveIntegerField()
    type = models.CharField(max_length=8)
    district_name = models.ForeignKey(District, models.DO_NOTHING, db_column='district_name')

    class Meta:
        db_table = 'testing_spot'


class Vaccination(models.Model):
    vaccination_id = models.BigAutoField(primary_key=True)
    date = models.DateField()
    took_place = models.IntegerField()
    vaccine = models.OneToOneField('Vaccine', models.DO_NOTHING)
    vax_spot = models.ForeignKey('VaccinationSpot', models.DO_NOTHING)
    amka = models.ForeignKey(Citizen, models.DO_NOTHING, db_column='amka')

    class Meta:
        db_table = 'vaccination'


class VaccinationSpot(models.Model):
    vax_spot_id = models.BigAutoField(primary_key=True)
    capacity = models.PositiveIntegerField()
    address = models.CharField(max_length=35)
    type = models.CharField(max_length=22)
    district_name = models.ForeignKey(District, models.DO_NOTHING, db_column='district_name')

    class Meta:
        db_table = 'vaccination_spot'


class VaccinationSpotHasHealthcareStaff(models.Model):
    vax_spot = models.OneToOneField(VaccinationSpot, models.DO_NOTHING, primary_key=True)
    employee = models.ForeignKey(HealthcareStaff, models.DO_NOTHING)
    from_field = models.DateField(db_column='from')  # Field renamed because it was a Python reserved word.
    to = models.DateField(blank=True, null=True)

    class Meta:
        db_table = 'vaccination_spot_has_healthcare_staff'
        unique_together = (('vax_spot', 'employee'),)


class Vaccine(models.Model):
    vaccine_id = models.BigAutoField(primary_key=True)
    batch_id = models.CharField(max_length=11)
    num_of_dose = models.PositiveIntegerField()
    dosage = models.PositiveIntegerField()
    vaccine_name = models.ForeignKey('VaccineManufacturer', models.DO_NOTHING, db_column='vaccine_name')
    vax_spot = models.ForeignKey(VaccinationSpot, models.DO_NOTHING)

    class Meta:
        db_table = 'vaccine'


class VaccineManufacturer(models.Model):
    vaccine_name = models.CharField(primary_key=True, max_length=15)
    vaccine_type = models.CharField(max_length=10)
    production_capacity = models.PositiveIntegerField()

    class Meta:
        db_table = 'vaccine_manufacturer'
