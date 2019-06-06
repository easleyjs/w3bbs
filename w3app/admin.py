from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from w3app.models import BBS_User, Message, Topic

# Register your models here.
class BBSUserInline(admin.StackedInline):
    model = BBS_User
    can_delete = False
    verbose_name_plural = 'bbsuser'

# Define a new User admin
class UserAdmin(BaseUserAdmin):
    inlines = (BBSUserInline,)

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Topic)
admin.site.register(Message)
