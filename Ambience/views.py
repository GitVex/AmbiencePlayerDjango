from traceback import format_tb
from django.views.generic import TemplateView
from Ambience.forms import SavePresetForm, SavePresetItemForm, SaveVideoForm
from django.shortcuts import render

class AmbienceView(TemplateView):
    template_name = 'playerManager.html'

    def get(self, request):
        form = SavePresetForm()
        return render(request, self.template_name, {'form': form})

    def postSavePreset(self, request):
        formA = SavePresetForm(request.POST)
        formB = SaveVideoForm(request.POST)
        formC = SavePresetItemForm(request.POST)
        if formA.is_valid():
            text = formA.cleaned_data['Title']

        args = {'form': formA, 'text': text}
        return render(request, self.template_name, args)