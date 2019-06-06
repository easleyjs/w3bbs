from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from django.conf import settings


class BBS_User(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    is_sysop = models.BooleanField(default=False)
    is_cosysop = models.BooleanField(default=False)
    is_31337 = models.BooleanField(default=False)


class Topic(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255,blank=True,null=True)

    def __str__(self):
        return self.title

class Message(models.Model):
    msg_date = models.DateTimeField(default=timezone.now)
    msg_author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    msg_title = models.CharField(max_length=255, null=True, blank=True)
    msg_body = models.TextField()
    parent_id = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    topic_id = models.ForeignKey(Topic, on_delete=models.CASCADE)

    def __str__(self):
        if self.msg_title:
            return self.msg_title
        else:
            return 'Blank'

    class Meta:
        ordering = ('msg_date',)
