# Generated by Django 4.0.1 on 2022-02-15 09:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Ambience', '0003_alter_video_video_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='video',
            name='isAvailable',
        ),
    ]
