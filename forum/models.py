from django.contrib.auth.models import User
from django.db import models


# Create your models here.

class Profile(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    bio=models.TextField(max_length=500,null=True)
    postkarma=models.IntegerField(default=0)
    commentkarma=models.IntegerField(default=0)

    def __str__(self):
        return self.user.username
    pass


class Post(models.Model):
    title=models.CharField(max_length=100,blank=False)
    body=models.TextField(blank=False)
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="user_post")
    created=models.DateTimeField(auto_now_add=True)
    modified=models.DateTimeField(auto_now=True)
    closed=models.BooleanField(default=False)
    upvotedby=models.ManyToManyField(User,blank=True,related_name="post_upvoted_by")
    downvotedby=models.ManyToManyField(User,blank=True,related_name="post_downvoted_by")
    votes=models.IntegerField(default=0)
    accepted=models.BooleanField(default=False)

    def __str__(self):
        return self.title
    pass

class Comment(models.Model):
    post=models.ForeignKey(Post,on_delete=models.CASCADE,related_name="user_comment")
    user=models.ForeignKey(User,on_delete=models.CASCADE,related_name="post_comment")
    text=models.TextField(blank=False)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    upvotedby = models.ManyToManyField(User, blank=True, related_name="comment_upvoted_by")
    downvotedby = models.ManyToManyField(User, blank=True, related_name="comment_downvoted_by")
    votes = models.IntegerField(default=0)
    accepted=models.BooleanField(default=False)

    def __str__(self):
        return self.post.title+" "+self.user.username
    pass

