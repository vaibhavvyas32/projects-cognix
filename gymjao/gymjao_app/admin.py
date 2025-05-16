from django.contrib import admin
from .models import User, UserDetails,UserExercise,Exercise,Set,DayOfExercise

admin.site.register(User)
admin.site.register(UserDetails)
admin.site.register(UserExercise)
admin.site.register(Exercise)
admin.site.register(Set)
admin.site.register(DayOfExercise)


