# Generated by Django 2.2.1 on 2019-05-10 04:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('w3app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='topic',
            name='description',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
