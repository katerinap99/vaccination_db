# Generated by Django 4.0 on 2022-01-04 12:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vaccinationdb', '0006_alter_vaccine_vaccine_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='citizenuser',
            name='date_of_birth',
            field=models.DateField(default='1984-06-21'),
            preserve_default=False,
        ),
    ]
