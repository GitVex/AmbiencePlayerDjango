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

        def saveData(presetData):
            for entry in presetData:
                    curEntry = entry['playerData'][0]
                    newVideo = Video(video_title=curEntry['title'], video_ID=curEntry['ID'])

                    #checking if the video already has a database entry
                    if not Video.objects.filter(video_ID=curEntry['ID']).exists():
                        Video.objects.create(video_title=curEntry['title'], video_ID=curEntry['ID'])
                        newVideo = Video.objects.filter(video_ID=curEntry['ID']).first()
                    else:
                        newVideo = Video.objects.filter(video_ID=curEntry['ID']).first()
                    
                    #checking if the presetItem already has a database entry
                    if not PresetItem.objects.filter(video=newVideo, preset=newPreset).exists():
                        PresetItem.objects.create(video=newVideo, preset=newPreset)

                    del(newVideo)

        formA = SavePresetForm(request.POST)
        #checking if form is valid
        if formA.is_valid():

            #loading POST data
            presetTitle = formA.cleaned_data['title']
            presetData = json.loads(request.POST.get("presetData", ""))

            #saving to database
            #checking if preset already exists
            if not Preset.objects.filter(title=presetTitle).exists():
                Preset.objects.create(title=presetTitle)
                newPreset = Preset.objects.filter(title=presetTitle).first()

                saveData(presetData)
            else:
                newPreset = Preset.objects.filter(title=presetTitle).first()

                saveData(presetData)

        return render(request, self.template_name, context={'form': formA})

