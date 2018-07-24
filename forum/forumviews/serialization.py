from rest_framework import serializers
from rest_framework.fields import SerializerMethodField

from forum.models import *
from rest_framework.renderers import JSONRenderer
from django.utils.six import BytesIO
from rest_framework.parsers import JSONParser

import ipdb

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=Profile
        fields=('user','bio','postkarma','commentkarma')
    pass

"""
 user=models.OneToOneField(User,on_delete=models.CASCADE)
    bio=models.TextField(max_length=500,null=True)
    postkarma=models.IntegerField(default=0)
    commentkarma=models.IntegerField(default=0)
"""

class UserSerializer1(serializers.ModelSerializer):
    profile=ProfileSerializer("profile")
    class Meta:
        model=User
        fields=('id','username',"first_name","last_name","email","profile","groups",)
        #fields=('username','first_name','last_name','email')



class ProfileSerializer2(serializers.ModelSerializer):
    class Meta:
        model=Profile
        fields=('bio',)
    pass


class UserSerializer2(serializers.ModelSerializer):
    profile = ProfileSerializer2("profile")

    def create(self, validated_data):
        #ipdb.set_trace()
        userdata=validated_data
        username=validated_data.get("username")
        password=validated_data.get("password")
        first_name=validated_data.get("first_name")
        last_name=validated_data.get("last_name")
        email=validated_data.get("email")
        user=User(username=username,password=password,first_name=first_name,last_name=last_name,email=email)
        user.set_password(validated_data.get("password"))
        try:
            profiledata=validated_data.pop("profile")
            profile_serializer=ProfileSerializer2(data=profiledata)
        except Exception as e:
            profiledata=None
            profile_serializer = ProfileSerializer2(data=profiledata)

        user.save()
        if profile_serializer.is_valid():
            profile=Profile(**profile_serializer.data,user=user)
            profile.save()
        else:
            profile=Profile(user=user)
            profile.save()
        return user

    def update(self, instance, validated_data):
        #ipdb.set_trace()
        userdata = validated_data
        #instance.username = validated_data.get("username",instance.username)
        # instance.password = validated_data.get("password",instance.password)
        # instance.set_password(validated_data.get("password",instance.password))
        instance.email=validated_data.get("email",instance.email)
        instance.first_name = validated_data.get("first_name",instance.first_name)
        instance.last_name = validated_data.get("last_name",instance.last_name)
        #user = User(username=username, password=password, first_name=first_name, last_name=last_name)
        p=validated_data.get("profile",instance.profile)
        instance.profile.bio=p.get("profile",instance.profile.bio)
        instance.save()
        instance.profile.save()
        return instance
        pass


    class Meta:
        model = User
        fields = ('id', 'username', "first_name", "last_name", "email","password","profile",)
        # fields=('username','first_name','last_name','email')
"""
 "username": "anish",
    "first_name": "Anish",
    "last_name": "Skanda",
    "email": "anish@gmail.com",
    "password"""

class PostSerializer(serializers.ModelSerializer):
    userdetail=UserSerializer1(source="user")
    class Meta:
        model=Post
        fields=('id','accepted','title','body','created','modified','closed','upvotedby','downvotedby','votes','userdetail')
    pass


class PostSerializer2(serializers.ModelSerializer):
    class Meta:
        model=Post
        fields=('title','body','user','accepted')
    pass

class CommentSerializer(serializers.ModelSerializer):
    userdetail=UserSerializer1(source="user")
    owner=serializers.SerializerMethodField()
    voted=serializers.SerializerMethodField()
    postowner=serializers.SerializerMethodField()
    class Meta:
        model = Comment
        fields = ('id','user','post','owner','postowner','voted','userdetail','text','created','modified','upvotedby','downvotedby','votes','accepted')
        order_by = ['text']
        ordering = ['text']

    def get_owner(self,obj):
        owner=-1
        if obj.user_id == self.context['request_user_id']:
            owner=1
        elif self.context['request_user_id'] is not None:
            uid=self.context['request_user_id']
            if User.objects.all().get(id=uid).groups.filter(name='moderator').exists():
                owner=2
            else:
                owner=0
        else:
            owner=0
        return owner

    def get_postowner(self,obj):
        #ipdb.set_trace()
        if(obj.user==obj.post.user and (self.context['request_user_id'] is not None)):
            return 1
        else:
            return 0
        pass

    def get_voted(self,obj):
        voted=0
        if obj.upvotedby.filter(id=self.context['request_user_id']).exists():
            voted=1
        elif obj.downvotedby.filter(id=self.context['request_user_id']).exists():
            voted=-1
        return voted

    pass

class CommentSerializer2(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('user','post','text')

    pass

class PostDetailSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(source='user_comment',many=True)
    userdetail=UserSerializer1(source="user")
    voted=serializers.SerializerMethodField()
    class Meta:
        model=Post
        fields=('id','accepted','title','body','userdetail','created','modified','closed','upvotedby','downvotedby','votes','comments','voted')

    def get_voted(self,obj):
        voted=0
        if obj.upvotedby.filter(id=self.context['request_user_id']).exists():
            voted=1
        elif obj.downvotedby.filter(id=self.context['request_user_id']).exists():
            voted=-1
        return voted
"""post=models.ForeignKey(Post,on_delete=models.CASCADE,related_name="user_comment")
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="post_comment")
    text=models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    upvotedby = models.ManyToManyField(User,blank=True)
    num_upvotes = models.IntegerField(default=0)
    accepted=models.BooleanField(default=False)"""


