from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserDetailsViewSet, ExerciseViewSet, UserExerciseViewSet, SetViewSet, DayViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'user-details', UserDetailsViewSet)
router.register(r'exercises', ExerciseViewSet)
router.register(r'user-exercises', UserExerciseViewSet)
router.register(r'sets', SetViewSet)
router.register(r'dayOfExercise', DayViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
