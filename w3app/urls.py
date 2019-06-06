from django.urls import path
from . import views

app_name = 'w3app'
urlpatterns = [
    path('', views.login_page, name='login_page'),
    path('login/', views.attempt_login, name='attempt_login'),
    path('bbs/', views.bbs_main, name='bbs_main'),
    # Message Views
    path('topic_detail/<int:pk>/', views.topic_detail, name='topic_detail'),
    path('messages/<int:pk>/<int:strt>/<int:end>/', views.get_msgs, name='get_msgs'),
    path('topic_list/', views.topic_list, name='topic_list'),
    path('msg_ids/<int:topic_id>/', views.get_msg_ids, name='get_msg_ids'),
    path('msg_detail/<int:topic_id>/<int:pk>/', views.msg_detail, name='msg_detail'),
    path('messages/new', views.new_msg, name='new_msg'),
    #path('signup/', views.SignUp.as_view(), name='signup'),
]
