# Generated by Django 4.0 on 2022-01-01 15:05

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('vaccinationdb', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='citizenuser',
            name='amka',
            field=models.ForeignKey(db_column='amka', default=None, on_delete=django.db.models.deletion.CASCADE, to='vaccinationdb.citizen'),
        ),
    ]
