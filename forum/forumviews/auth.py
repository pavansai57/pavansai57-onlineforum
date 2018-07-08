import ipdb
import jwt
from django import forms
from django.contrib.auth import authenticate, login, logout, user_logged_in
from django.contrib.auth.models import User
from django.views import View
from django.shortcuts import render, redirect
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from onlineforum import settings
from rest_framework_jwt.serializers import jwt_payload_handler


class LoginForm(forms.Form):

    username = forms.CharField(
        max_length=50,
        required=True,
        widget=forms.TextInput(attrs={'class': "form-control", "placeholder": "enter username"})
    )

    password = forms.CharField(
        max_length=50,
        required=True,
        widget=forms.PasswordInput(attrs={'class': "form-control", "placeholder": "enter password"})
    )

class LoginFormView(View):

    def get(self,request):
        login_form=LoginForm()
        return render(request,template_name="templates/login.html",context={"form":login_form})

    def post(self,request):
        login_form=LoginForm(request.POST)
        if login_form.is_valid():
            #ipdb.set_trace()
            user=authenticate(request,username=login_form.cleaned_data['username'],password=login_form.cleaned_data['password'])
            if user is not None:
                login(request,user)
                return redirect("forum:hello")
            else:
                return redirect("templates/error.html")





class SignUpForm(forms.Form):
    first_name=forms.CharField(
        max_length=50,
        required=True,
        widget=forms.TextInput(attrs={'class':"form-control","placeholder":"enter firstname"})
    )

    last_name = forms.CharField(
        max_length=50,
        required=True,
        widget=forms.TextInput(attrs={'class': "form-control", "placeholder": "enter lastname"})
    )

    username = forms.CharField(
        max_length=50,
        required=True,
        widget=forms.TextInput(attrs={'class': "form-control", "placeholder": "enter username"})
    )

    password = forms.CharField(
        max_length=50,
        required=True,
        widget=forms.PasswordInput(attrs={'class': "form-control", "placeholder": "enter password"})
    )


class SignUpFormView(View):

    def get(self,request):
        signup_form=SignUpForm()
        return render(request,template_name="templates/signup.html",context={"form":signup_form})

    def post(self,request,*args,**kwargs):
        form=SignUpForm(request.POST)
        if form.is_valid():      ## if u dont give is_valid u wont get cleaneddata
            user=User.objects.create_user(**form.cleaned_data)
            #user.save()
            user=authenticate(
                request,
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password']
            )

            if user is not None:
                login(request,user)
                return redirect("forum:hello")
            else:
                return redirect("forum:login_form")
        pass

def logout_view(request):
    logout(request)
    return redirect("forum:login_form")



"""
import base64
from django.contrib.auth import authenticate
from django.http import JsonResponse


def basic_authentication(data_function):
    def wrapper(request,*args,**kwargs):
        #ipdb.set_trace()
        if 'HTTP_AUTHORIZATION' in request.META:
            auth = request.META['HTTP_AUTHORIZATION'].split()
            if len(auth) == 2:
                if auth[0].lower() == "basic":
                    username, password = base64.b64decode(auth[1]).split(b':', 1)
                    username=username.decode('utf-8')
                    password=password.decode('utf-8')
                    user = authenticate(username=username, password=password)
                    if user is not None:
                        return data_function(request,*args,**kwargs)
            # otherwise ask for authentification
        return JsonResponse({'WWW-Authenticate':'Basic realm="restricted area"'},status=401)
    return wrapper


"""
"""
@api_view(['POST'])
@permission_classes([AllowAny, ])
def authenticate_user(request):
    ipdb.set_trace()
    try:
        username = request.data['username']
        password = request.data['password']

        user=authenticate(username=username,password=password)
        #user = User.objects.get(username=username, password=password)
        if user:
            try:
                payload = jwt_payload_handler(user)
                token = jwt.encode(payload, settings.SECRET_KEY)
                user_details = {}
                user_details['name'] = "%s %s" % (
                    user.first_name, user.last_name)
                user_details['token'] = token
                user_logged_in.send(sender=user.__class__,
                                    request=request, user=user)
                return Response(user_details, status=status.HTTP_200_OK)

            except Exception as e:
                raise e
        else:
            res = {
                'error': 'can not authenticate with the given credentials or the account has been deactivated'}
            return Response(res, status=status.HTTP_403_FORBIDDEN)
    except KeyError:
        res = {'error': 'please provide a email and a password'}
        return Response(res)
    """
