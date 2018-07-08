from forum.forumviews.serialization import *

def jwt_response_payload_handler(token, user=None, request=None):
    return {
        'token': token,
        'user': UserSerializer1(user, context={'request': request}).data
    }