from django.shortcuts import render

# Create your views here.

# Create a homepage view
def home_view(request, *args, **kwargs):
    return render(request, 'home.html')

# Create the about page
def about_view(request, *args, **kwargs):
    return render(request, 'about.html')
