# Generated by Django 4.0 on 2022-01-01 15:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vaccinationdb', '0002_alter_citizenuser_amka'),
    ]

    operations = [
        migrations.AlterField(
            model_name='citizenuser',
            name='amka',
            field=models.CharField(max_length=11),
        ),
    ]
