"""
URL configuration for pdf_converter project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from pages.views import home_view, about_view
from pdf_manip.views import MergeFileFormView

urlpatterns = [
    path('admin/', admin.site.urls),

    # add pages
    path('', home_view, name='home'),
    path('about/', about_view, name='about'),

    # add operation pages
    path('merge/', MergeFileFormView.as_view(), name='merge-sucess')
]
