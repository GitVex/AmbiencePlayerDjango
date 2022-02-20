from encodings import utf_8
from traceback import format_tb
from django.views.generic import TemplateView
from Ambience.forms import SavePresetForm
from django.shortcuts import render
from Ambience.models import *
import json

class AmbienceView(TemplateView):
    template_name = 'playerManager.html'

    def get(self, request):
        form = SavePresetForm()
        return render(request, self.template_name, {'form': form})

    def post(self, request):
        formA = SavePresetForm(request.POST)
        #checking if form is valid
        if formA.is_valid():

            #loading POST data
            presetTitle = formA.cleaned_data['title']
            presetData = json.loads(request.POST.get("presetData", ""))

            #saving to database
            #checking if preset already exists
            if not Preset.objects.filter(title=presetTitle).exists():
                newPreset = Preset.objects.create(title=presetTitle)
                newPreset.save()
                for entry in presetData:
                    curEntry = entry['playerData'][0]

                    #checking if the video already has a database entry
                    if not Video.objects.filter(video_ID=curEntry['ID']).exists:
                        newVideo = Video.objects.create(video_title=curEntry['title'], video_ID=curEntry['ID'])
                        newVideo.save()
                    
                    #checking if the presetItem already has a database entry
                    videoFilter = Video.objects.filter(video_ID=curEntry['ID'])
                    presetFilter = Preset.objects.filter(title=presetTitle)

                    if not PresetItem.objects.filter(video=videoFilter, preset=presetFilter).exists():
                        newPresetItem = PresetItem.objects.create(Video=videoFilter, Preset=presetFilter)
                        newPresetItem.save()

        return render(request, self.template_name)
