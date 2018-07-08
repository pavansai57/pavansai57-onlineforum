from rest_framework_jwt.views import obtain_jwt_token

from forum.views import *
from django.contrib import admin
from django.urls import path
from forum.forumviews.auth import *
from forum.forumviews.forum_rest_views import *

app_name='forum'

urlpatterns = [
    path('hello/',helloview,name="hello"),
    path("signup/",SignUpFormView.as_view(),name="signup_form"),
    path("login/",LoginFormView.as_view(),name="login_form"),
    path("logout/",logout_view,name="logout"),
    path("api/v1/forum",PostsSerializerView.as_view(),name="posts_view"),
    path("api/v1/forum/posts/<int:pk>/comments",CommentsSerializerView.as_view(),name="comments_view"),
    path("api/v1/forum/posts/<int:pk>",PostDetailSerializerView.as_view(),name="postdetail_view"),
    path("api/v1/forum/posts/<int:pk>/comments/<int:id>",CommentDetailSerializerView.as_view(),name="commentdetail_view"),
    path("api/v1/forum/users/<int:pk>",UserDetailSerializerView.as_view(),name="userdetail_view"),
    path("api/v1/forum/users",UserSerializerView.as_view(),name="user_view"),
    path("api/v1/login",obtain_jwt_token,name="authenticate_user"),
    path("api/v1/signup",UserSerializerView.as_view(),name="user_signup"),
    path("api/v1/forum/posts/<int:pk>/vote",PostVoteSerializerView.as_view(),name="post_vote"),
    path("api/v1/forum/posts/<int:pk>/comments/<int:id>/vote",CommentVoteSerializerView.as_view(),name="comment_vote"),
    path("api/v1/forum/posts/<int:pk>/comments/<int:id>/accept",CommentAccept.as_view(),name="comment_accept"),
    path("api/v1/forum/posts/<int:pk>/comments/<int:id>/unaccept",CommentUnaccept.as_view(),name="comment_unaccept"),
    path("api/v1/forum/posts/<int:pk>/close",ClosePost.as_view(),name="close_post"),
    path("api/v1/forum/posts/<int:pk>/open",OpenPost.as_view(),name="open_post"),
    path("api/v1/forum/users/<int:pk>/posts",UserPostsSerializerView.as_view(),name="user_posts"),
    path("api/v1/forum/users/<int:pk>/comments",UserCommentsSerializerView.as_view(),name="user_comments"),
]

