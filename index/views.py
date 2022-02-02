from django.shortcuts import render

# Create your views here.
def renderedHTML(request):
    return render(request, 'index.html')