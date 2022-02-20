from dataclasses import fields
from django import forms

from Ambience.models import *

class SavePresetForm(forms.ModelForm):

    class Meta:
        model = Preset
        fields = ('title',)

# class SaveVideoForm(forms.ModelForm):
#    video_title = forms.CharField(max_length = 100)
#    video_ID = forms.CharField(max_length = 11)
#
#    class Meta:
#        model = Video
#        fields = ('video_title', 'video_ID')
#
# class SavePresetItemForm(forms.ModelForm):
#    video = forms.IntegerField()
#    preset = forms.IntegerField()
#
#    class Meta:
#        model = PresetItem
#        fields = ('video', 'preset') 