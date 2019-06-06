import json
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .models import Topic, Message

# Create your views here.

def login_page(request):
    #if not request.user.is_authenticated:
    #return redirect(settings.LOGIN_URL)
    return render(request, 'w3app/login.html', {})

def bbs_main(request):
    return render(request, 'w3app/bbs.html')

#def main_view(request):
#    topic = Topic.objects.get(pk=1)
#    messages = Message.objects.filter(topic_id=1)
#    return render(request, 'w3app/main_view.html', {'messages':messages, 'topic':topic})


def attempt_login(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))
        user_name = data['user_name']
        password = data['password']
        user = authenticate(request, username=user_name, password=password)
        if user is not None:
            login(request, user)
            #request.session['username'] = user_name
            return HttpResponse("Success")
        else:
            return HttpResponse("Fail")
    else:
        return HttpResponse('Error')


def logout_view(request):
    logout(request)
    #return redirect(settings.LOGIN_URL)


def topic_list(request):
    topics = Topic.objects.all()
    topics_obj = {'topic_list': []}
    for topic in topics:
        msg_count = Message.objects.filter(topic_id=topic.pk).count()
        topics_obj['topic_list'].append({
            'pk': topic.pk,
            'topic_title': topic.title,
            'topic_desc': topic.description,
            'msg_count': msg_count,
        })
    return JsonResponse(topics_obj)


def topic_detail(request, pk):
    details = Topic.objects.get(id=pk)
    msg_count = Message.objects.filter(topic_id=details.pk).count()
    details_obj = {
        'topic_title': details.title,
        'topic_desc': details.description,
        'msg_count': msg_count,
    }
    return JsonResponse(details_obj)


def get_msgs(request, pk, strt, end):
    messages = Message.objects.filter(topic_id=pk, id__gte=strt, id__lte=end) # gt or eq to strt, lt or eq to endfor
    messages_obj = {'msg_list': []}
    for message in messages:
        messages_obj['msg_list'].append({
            'pk': message.pk,
            'msg_date': message.msg_date.strftime("%m/%d/%Y %I:%M:%S %p"),
            'msg_author': message.msg_author.username,
            'msg_title': message.msg_title,
            #'msg_body': message.msg_body,
        })
    return JsonResponse(messages_obj)


def get_msg_ids(request, topic_id):
    messages = Message.objects.filter(topic_id=topic_id)
    message_id_obj = {'msg_ids': []}
    for message in messages:
        message_id_obj['msg_ids'].append(message.pk)
    return JsonResponse(message_id_obj)

#@login_required()
def msg_detail(request, topic_id, pk):
    message = Message.objects.get(topic_id=topic_id, id=pk)
    replies = Message.objects.filter(parent_id=pk)
    reply_list = []
    if len(replies) > 0:
        for reply in replies:
            reply_list.append({
                'pk': reply.pk,
                'msg_date': reply.msg_date.strftime("%m/%d/%Y %I:%M:%S %p"),
                'msg_author': reply.msg_author.username,
                'msg_title': reply.msg_title,
                'msg_body': reply.msg_body,
                # Eventually allow recursive replying..
            })
    message_obj = {
        'pk': message.pk,
        'msg_date': message.msg_date.strftime("%m/%d/%Y %I:%M:%S %p"),
        'msg_author': message.msg_author.username,
        'msg_title': message.msg_title,
        'msg_body': message.msg_body,
        'replies': reply_list,
    }
    return JsonResponse(message_obj)

# Take a POST. Check for a parent_id (reply) and the topic id.
def new_msg(request):
    if request.method == "POST":
        data = json.loads(request.body.decode('utf-8'))

        topic_id = data['topic_id']
        topic = Topic.objects.get(id=topic_id)
        msg_title = data['msg_title']
        msg_poster = data['msg_poster']
        user = User.objects.get(username=msg_poster)
        msg_body = data['msg_body']
        parent_id = data['parent_id']


        ## Check to make sure body isn't blank/input validation
        msg = Message()
        msg.msg_author = user
        msg.msg_title = msg_title
        msg.msg_body = msg_body
        msg.topic_id = topic
        if parent_id != 0 and type(parent_id) == 'int':
            msg.parent_id = Message.objects.get(id=parent_id)
        msg.save()
        #print(data)
        ## Probably need to return msg id array here to refresh msg details.
        return HttpResponse('OK')

def delete_msg(request):
    pass
