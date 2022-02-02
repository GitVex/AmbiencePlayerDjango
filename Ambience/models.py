from django.db import models

# Create your models here.
class Preset(models.Model):
    title = models.CharField(max_length = 100)
    playerNum = models.IntegerField()

    def __str__(self):
        return self.title

class Video(models.Model):
    video_title = models.CharField(max_length = 100)
    video_ID = models.CharField(max_length = 11)
    isAvailable = models.BooleanField()

    def __str__(self):
        return self.video_title

class PresetItem(models.Model):
    preset = models.ForeignKey(Preset, on_delete=models.CASCADE)
    video = models.ForeignKey(Video, on_delete=models.CASCADE, default=None)

    # def __str__(self):
    #     return self.video.video_title

