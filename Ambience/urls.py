from django.urls import path
from . import views

#URLConf
urlpatterns = [
    path('', views.AmbienceView.as_view(), name="Ambience")
]