from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.

def helloview(request):
    helloworld= "<h1>helloworld</h1>"
    #return helloworld
    return HttpResponse(helloworld)

class AddPost():
    pass