# Generated by Django 2.0.5 on 2018-07-04 15:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('forum', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='accepted',
            field=models.BooleanField(default=False),
        ),
    ]
