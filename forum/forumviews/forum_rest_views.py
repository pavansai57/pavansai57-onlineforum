import os
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from forum.models import *
from forum.forumviews.serialization import *
from django.http import JsonResponse
from rest_framework.views import APIView
from .auth import *
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from rest_framework.filters import *
from django_filters import rest_framework as filters

import ipdb


from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

import logging

from django.views.generic import View
from django.http import HttpResponse
from django.conf import settings
import os

class FrontendAppView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `yarn
    run build`).
    """

    def get(self, request):
        try:
            with open(os.path.join(settings.REACT_APP_DIR,'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            logging.exception('Production build of app not found')
            return HttpResponse(
                """
                This URL is only used when you have built the production
                version of the app. Visit http://localhost:3000/ instead, or
                run `yarn run build` to test the production version.
                """,
                status=501,
            )



class PostsSerializerView(APIView):
    #permission_classes = (IsAuthenticated,)
    #authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticatedOrReadOnly,)
    authentication_classes = (SessionAuthentication,)
    #permission_classes = (IsAuthenticated,)
    filter_backends=(DjangoFilterBackend,SearchFilter,OrderingFilter)
    search_fields= ['body','title','user__username']
    filter_fields = ('title', 'body','user__username')
    ordering_fields = '__all__'
    #ordering = ('created', 'votes',)

    def get(self,request,*args,**kwargs):
        # query=request.GET.get('q')
        # sort=request.GET.get('sort')
        # if query:
        #     posts=Post.objects.all().filter((Q(title__icontains=query) | Q(body__icontains=query)))
        # else:
        #     posts=Post.objects.all()
        posts=Post.objects.all()
        if self.request.GET.get('filter'):
            self.search_fields=[self.request.GET.get('filter')]
        #ipdb.set_trace()
        posts=self.filter_queryset(posts)

        paginator = Paginator(posts, 5)
        page = request.GET.get('page')
        #ipdb.set_trace()
        try:
            posts = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            posts = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            posts = paginator.page(paginator.num_pages)


        data={}
        posts_serializer=PostSerializer(posts,many=True)
        try:
            data['next_page_number']=posts.next_page_number()
        except Exception as e:
            data['next_page_number']=-1
        try:
            data['previous_page_number']=posts.previous_page_number()
        except Exception as e:
            data['previous_page_number']=-1
        data['has_next']=posts.has_next()
        data['has_previous']=posts.has_previous()
        data['results'] = posts_serializer.data
        # return Response(posts_serializer.data, status=status.HTTP_200_OK)
        return Response(data, status=status.HTTP_200_OK)

    def post(self,request,*args,**kwargs):
        data=self.request.data.copy()
        #ipdb.set_trace()
        data['user']=self.request.user.id
        post_serializer=PostSerializer2(data=data)
        if post_serializer.is_valid():
            post=post_serializer.save()
            post.save()
            return Response({"post_id":post.id},status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def filter_queryset(self,queryset):
        """
        Given a queryset, filter it with whichever filter backend is in use.
        You are unlikely to want to override this method, although you may need
        to call it either from a list view, or from a custom `get_object`
        method if you want to apply the configured filtering backend to the
        default queryset.
        """
        #ipdb.set_trace()
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)
        return queryset

        pass



class CommentsSerializerView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self,request,*args,**kwargs):
        post=Post.objects.all().get(pk=self.kwargs['pk'])
        comments=Comment.objects.all().filter(post=post).order_by("-accepted")
        #ipdb.set_trace()
        comments_serializer=CommentSerializer(comments,many=True,context=self.get_serializer_context())
        return Response(comments_serializer.data,status=status.HTTP_200_OK)
        pass

    def post(self,request,*args,**kwargs):
        try:
            #ipdb.set_trace()
            post = Post.objects.all().get(pk=self.kwargs['pk'])
            data=self.request.data.copy()
            data['user']=self.request.user.id
            data['post']=post.id
            comment_serializer=CommentSerializer2(data=data)
            if comment_serializer.is_valid():
                c=comment_serializer.save()
                c.save()
                return Response({"comment_id":c.id},status=status.HTTP_200_OK)
            else:
                return Response("invalid comment",status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response("post not found",status=status.HTTP_400_BAD_REQUEST)
        pass


    def get_serializer_context(self):
        user_id = -1
        try:
            user_id = self.request.user.id
        except Exception as e:
            user_id=-1
            pass
        return {"request_user_id": user_id}


class CommentDetailSerializerView(APIView):

    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self,request,*args,**kwargs):
        try:
            #ipdb.set_trace()
            post = Post.objects.all().get(pk=self.kwargs['pk'])
            comment = Comment.objects.all().get(post=post,id=self.kwargs['id'])
            context=self.get_serializer_context()
            comment_serializer=CommentSerializer(instance=comment,context=context)
            return Response(comment_serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response("not found",status=status.HTTP_400_BAD_REQUEST)


    def get_serializer_context(self):
        user_id = -1
        try:
            user_id = self.request.user.id
        except Exception as e:
            user_id=-1
            pass
        return {"request_user_id": user_id}


    def put(self,request,*args,**kwargs):
        try:
            post = Post.objects.all().get(pk=self.kwargs['pk'])
            comment = Comment.objects.all().get(post=post,id=self.kwargs['id'])
            if comment.user==self.request.user or self.request.user.groups.filter(name='moderator').exists():
                data=self.request.data.copy()
                data['post']=post.id
                data['user']=comment.user.id
                context = self.get_serializer_context()
                comment_serializer=CommentSerializer2(data=data,instance=comment,context=context)
                if comment_serializer.is_valid():
                    c=comment_serializer.save()
                    c.save()
                    return Response({"comment_id",c.id}, status=status.HTTP_200_OK)
                else:
                    return Response("invalid comment",status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response("invalid user",status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response("not found",status=status.HTTP_400_BAD_REQUEST)

    def delete(self,request,*args,**kwargs):
        try:
            post = Post.objects.all().get(pk=self.kwargs['pk'])
            comment = Comment.objects.all().get(post=post, id=self.kwargs['id'])
            if comment.user == self.request.user or self.request.user.groups.filter(name='moderator').exists():
                comment.delete()
                return Response({"response":"ok"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response("invalid user", status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response("not found", status=status.HTTP_400_BAD_REQUEST)
    pass




class PostDetailSerializerView(APIView):

    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self,request,*args,**kwargs):
        post=Post.objects.all().get(pk=self.kwargs['pk'])
        postdetail_serializer=PostDetailSerializer(instance=post,context=self.get_serializer_context())

        #ipdb.set_trace()
        owner=-1
        data = postdetail_serializer.data
        try:
            if post.user.id==self.request.user.id :
                owner=1
                data["owner"]=1
                if self.request.user.groups.filter(name='moderator').exists():
                    data['owner'] = 3
            elif self.request.user.groups.filter(name='moderator').exists():
                data['owner'] = 2
            else:
                owner=0
                data["owner"] = 0
        except Exception as e:
            owner=-1
            data["owner"]=-1
            if self.request.user.groups.filter(name='moderator').exists():
                data['owner'] = 2
        #l=[1,2,3]
        #ipdb.set_trace()
        data['comments']=sorted(data['comments'], key=lambda x: -x['accepted'])
        #sorted(data.comments,key =lambda x: x.accepted)
        return Response(data,status=status.HTTP_200_OK)

    def put(self,request,*args,**kwargs):
        try:
            post=Post.objects.all().get(pk=self.kwargs['pk'])
            if(post.user==self.request.user or self.request.user.groups.filter(name='moderator').exists()):
                data=self.request.data.copy()
                data['user']=post.user.id
                #ipdb.set_trace()
                post_serializer=PostSerializer2(data=data,instance=post,partial=True)
                if post_serializer.is_valid():
                    p=post_serializer.save()
                    p.save()
                    return Response({"post_id": post.id}, status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response("wrong user",status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response("post dosent exist",status=status.HTTP_400_BAD_REQUEST)
        pass

    def delete(self,request,*args,**kwargs):
        try:
            post=Post.objects.all().get(pk=self.kwargs['pk'])
            if(post.user==self.request.user or self.request.user.groups.filter(name='moderator').exists()):
                post.delete()
                return Response({"post_id": post.id}, status=status.HTTP_200_OK)
            else:
                return Response("wrong user",status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response("post dosent exist",status=status.HTTP_400_BAD_REQUEST)



    def get_serializer_context(self):
        user_id = -1
        try:
            user_id = self.request.user.id
        except Exception as e:
            user_id=-1
            pass
        return {"request_user_id": user_id}


class PostVoteSerializerView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self,request,*args,**kwargs):
        try:
            post=Post.objects.all().get(pk=self.kwargs['pk'])
            if "upvote" in self.request.GET:
                if request.user not in post.upvotedby.all():
                    if request.user in post.downvotedby.all():
                        post.downvotedby.remove(request.user)
                        post.votes=post.votes+1
                        post.user.profile.postkarma=post.user.profile.postkarma+1
                    post.votes=post.votes+1
                    post.user.profile.postkarma = post.user.profile.postkarma + 1
                    post.upvotedby.add(request.user)
                    post.user.profile.save()
                    post.save()
                    return Response({"response":"ok"},status=status.HTTP_200_OK)
                else:
                    return Response({"response":"already upvoted"},status=status.HTTP_200_OK)
            elif "downvote" in self.request.GET:
                if request.user not in post.downvotedby.all():
                    if request.user in post.upvotedby.all():
                        post.upvotedby.remove(request.user)
                        post.votes = post.votes - 1
                        post.user.profile.postkarma = post.user.profile.postkarma -1
                    post.votes=post.votes-1
                    post.user.profile.postkarma = post.user.profile.postkarma - 1
                    post.downvotedby.add(request.user)
                    post.user.profile.save()
                    post.save()
                    return Response({"response":"ok"},status=status.HTTP_200_OK)
                else:
                    return Response({"response":"already downvoted"},status=status.HTTP_200_OK)
            elif "unvote" in self.request.GET:
                try:
                    if request.user in post.upvotedby.all():
                        post.upvotedby.remove(request.user)
                        post.votes = post.votes - 1
                        post.user.profile.postkarma = post.user.profile.postkarma - 1
                        post.user.profile.save()
                        post.save()
                        return Response({"response": "ok"}, status=status.HTTP_200_OK)
                    elif request.user in post.downvotedby.all():
                        post.downvotedby.remove(request.user)
                        post.votes=post.votes+1
                        post.user.profile.postkarma = post.user.profile.postkarma+1
                        post.user.profile.save()
                        post.save()
                        return Response({"response": "ok"}, status=status.HTTP_200_OK)
                    else:
                        return Response({"response": "notvoted yet"}, status=status.HTTP_200_OK)
                except Exception as e:
                    return Response({"response":"error user nt exits or logged in"},status=status.HTTP_400_BAD_REQUEST)
            pass
        except Exception as e:
            return Response({"response":"user does not exit or other error"},status=status.HTTP_400_BAD_REQUEST)
    pass



class CommentVoteSerializerView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self,request,*args,**kwargs):
        try:
            #ipdb.set_trace()
            comment=Comment.objects.all().get(pk=self.kwargs['id'])
            if "upvote" in self.request.GET:
                if request.user not in comment.upvotedby.all():
                    if request.user in comment.downvotedby.all():
                        comment.downvotedby.remove(request.user)
                        comment.votes=comment.votes+1
                        comment.user.profile.commentkarma = comment.user.profile.commentkarma + 1
                    comment.votes=comment.votes+1
                    comment.user.profile.commentkarma = comment.user.profile.commentkarma + 1
                    comment.upvotedby.add(request.user)
                    comment.user.profile.save()
                    comment.save()
                    return Response({"response":"ok"},status=status.HTTP_200_OK)
                else:
                    return Response({"response":"already upvoted"},status=status.HTTP_200_OK)
            elif "downvote" in self.request.GET:
                if request.user not in comment.downvotedby.all():
                    if request.user in comment.upvotedby.all():
                        comment.upvotedby.remove(request.user)
                        comment.votes = comment.votes - 1
                        comment.user.profile.commentkarma = comment.user.profile.commentkarma - 1
                    comment.votes=comment.votes-1
                    comment.user.profile.commentkarma = comment.user.profile.commentkarma - 1
                    comment.downvotedby.add(request.user)
                    comment.user.profile.save()
                    comment.save()
                    return Response({"response":"ok"},status=status.HTTP_200_OK)
                else:
                    return Response({"response":"already downvoted"},status=status.HTTP_200_OK)
            elif "unvote" in self.request.GET:
                if request.user in comment.upvotedby.all():
                    comment.upvotedby.remove(request.user)
                    comment.votes = comment.votes - 1
                    comment.user.profile.commentkarma = comment.user.profile.commentkarma - 1
                    comment.user.profile.save()
                    comment.save()
                    return Response({"response": "ok"}, status=status.HTTP_200_OK)
                elif request.user in comment.downvotedby.all():
                    comment.downvotedby.remove(request.user)
                    comment.votes = comment.votes + 1
                    comment.user.profile.commentkarma = comment.user.profile.commentkarma + 1
                    comment.user.profile.save()
                    comment.save()
                    return Response({"response": "ok"}, status=status.HTTP_200_OK)
                else:
                    return Response({"response": "not voted yet"}, status=status.HTTP_400_BAD_REQUEST)
            pass
        except Exception as e:
            return Response({"response": "user does not exit or other error"}, status=status.HTTP_400_BAD_REQUEST)
    pass






class UserDetailSerializerView(APIView):

    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self,request,*args,**kwargs):
        try:
            user=User.objects.all().get(pk=self.kwargs['pk'])
            user_serializer=UserSerializer1(instance=user)
            return Response(user_serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response("no such user",status=status.HTTP_400_BAD_REQUEST)

    def put(self,request,*args,**kwargs):
        try:
            #ipdb.set_trace()
            user = User.objects.all().get(pk=self.kwargs['pk'])
            if user== self.request.user:
                #ipdb.set_trace()
                data=self.request.data.copy()
                user_serializer=UserSerializer2(data=data,instance=user,partial=True)
                if user_serializer.is_valid():
                    u=user_serializer.save()
                    #ipdb.set_trace()
                    u.save()
                    return Response({"id":u.id},status=status.HTTP_200_OK)
                else:
                    return Response("wrong fields",status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response("wrong user",status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response("user dosent exist",status=status.HTTP_400_BAD_REQUEST)
            pass
        pass
    pass




class UserSerializerView(APIView):

    def get(self,request,*args,**kwargs):
        try:
            users = User.objects.all()
            user_serializer = UserSerializer1(users,many=True)
            return Response(user_serializer.data,status=status.HTTP_200_OK)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        pass


    def post(self,request,*agrs,**kwargs):
        try:
            data=self.request.data.copy()
            user_serializer=UserSerializer2(data=data)
            if user_serializer.is_valid():
                u=user_serializer.save()
                u.save()
                return Response({"id":u.id},status=status.HTTP_200_OK)
            else:
                return Response(user_serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
            pass
        pass

class CommentAccept(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self,request,*args,**kwargs):
        post=Post.objects.all().get(pk=self.kwargs['pk'])
        comment=Comment.objects.all().get(pk=self.kwargs['id'])
        if post.user==self.request.user:
            #ipdb.set_trace()
            try:
                comment_notaccepted=Comment.objects.all().get(accepted=True)
                #ipdb.set_trace()
                comment_notaccepted.accepted=False
                comment_notaccepted.save()
            except Exception as e:
                pass
            comment.accepted=True
            post.accepted=True
            #post.closed=True
            comment.save()
            post.save()
            return Response({"response":"ok"},status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
            pass
        pass
    pass

class CommentUnaccept(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self,request,*args,**kwargs):
        post=Post.objects.all().get(pk=self.kwargs['pk'])
        comment=Comment.objects.all().get(pk=self.kwargs['id'])
        if post.user==self.request.user:
            comment.accepted=False
            post.accepted=False
            comment.save()
            post.save()
            return Response({"response":"ok"},status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
            pass
        pass
    pass

class ClosePost(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self,request,*args,**kwargs):
        post=Post.objects.all().get(pk=self.kwargs['pk'])
        if self.request.user.groups.filter(name='moderator').exists():
            post.closed=True
            post.save()
            return Response({"response":"ok"},status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
            pass
    pass

class OpenPost(APIView):
    permission_classes=(IsAuthenticated,)

    def post(self,request,*args,**kwargs):
        try:
            post=Post.objects.all().get(pk=self.kwargs['pk'])
            if self.request.user.groups.filter(name='moderator').exists():
                post.closed=False
                post.save()
                return Response({"response":"ok"},status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
                pass
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
            pass

class UserPostsSerializerView(APIView):
    # permission_classes = (IsAuthenticated,)
    # authentication_classes = (SessionAuthentication, BasicAuthentication)
    permission_classes = (IsAuthenticatedOrReadOnly,)
    # permission_classes = (IsAuthenticated,)
    filter_backends = (DjangoFilterBackend, SearchFilter, OrderingFilter)
    search_fields = ['body', 'title', 'user__username']
    filter_fields = ('title', 'body', 'user__username')
    ordering_fields = '__all__'

    # ordering = ('created', 'votes',)

    def get(self, request, *args, **kwargs):
        # query=request.GET.get('q')
        # sort=request.GET.get('sort')
        # if query:
        #     posts=Post.objects.all().filter((Q(title__icontains=query) | Q(body__icontains=query)))
        # else:
        #     posts=Post.objects.all()
        posts = Post.objects.all().filter(user=User.objects.all().get(id=self.kwargs['pk'])).order_by("-created")
        if self.request.GET.get('filter'):
            self.search_fields = [self.request.GET.get('filter')]
        # ipdb.set_trace()
        posts = self.filter_queryset(posts)

        paginator = Paginator(posts, 5)
        page = request.GET.get('page')
        # ipdb.set_trace()
        try:
            posts = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            posts = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            posts = paginator.page(paginator.num_pages)

        data = {}
        posts_serializer = PostSerializer(posts, many=True)
        try:
            data['next_page_number'] = posts.next_page_number()
        except Exception as e:
            data['next_page_number'] = -1
        try:
            data['previous_page_number'] = posts.previous_page_number()
        except Exception as e:
            data['previous_page_number'] = -1
        data['has_next'] = posts.has_next()
        data['has_previous'] = posts.has_previous()
        data['results'] = posts_serializer.data




        # posts_serializer = PostSerializer(posts, many=True)
        # return Response(posts_serializer.data, status=status.HTTP_200_OK)
        return Response(data, status=status.HTTP_200_OK)

    def filter_queryset(self,queryset):
        """
        Given a queryset, filter it with whichever filter backend is in use.
        You are unlikely to want to override this method, although you may need
        to call it either from a list view, or from a custom `get_object`
        method if you want to apply the configured filtering backend to the
        default queryset.
        """
        #ipdb.set_trace()
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)
        return queryset

        pass

    pass

class UserCommentsSerializerView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get(self, request, *args, **kwargs):
        #post = Post.objects.all().get(pk=self.kwargs['pk'])
        comments = Comment.objects.all().filter(user=User.objects.all().get(id=self.kwargs['pk']))
        # ipdb.set_trace()
        comments_serializer = CommentSerializer(comments, many=True, context=self.get_serializer_context())
        return Response(comments_serializer.data, status=status.HTTP_200_OK)
        pass

    def get_serializer_context(self):
        user_id = -1
        try:
            user_id = self.request.user.id
        except Exception as e:
            user_id=-1
            pass
        return {"request_user_id": user_id}
    pass