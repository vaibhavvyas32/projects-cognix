from django.shortcuts import render

from rest_framework import viewsets
from .models import User, UserDetails, Exercise, UserExercise, Set, DayOfExercise
from .serializers import UserSerializer, UserDetailsSerializer, ExerciseSerializer, UserExerciseSerializer, SetSerializer, DayOfExerciseSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        username = self.request.query_params.get('username')
        password = self.request.query_params.get('password')
        if username and password:
            queryset = queryset.filter(username=username, password=password)
        elif username:
            queryset = queryset.filter(username=username)
        return queryset

class UserDetailsViewSet(viewsets.ModelViewSet):
    queryset = UserDetails.objects.all()
    serializer_class = UserDetailsSerializer

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class UserExerciseViewSet(viewsets.ModelViewSet):
    queryset = UserExercise.objects.all()
    serializer_class = UserExerciseSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user')
        if user_id:
            queryset = queryset.filter(user_id=user_id)
        return queryset

class SetViewSet(viewsets.ModelViewSet):
    queryset = Set.objects.all()
    serializer_class = SetSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user_exercise__user')
        user_exercise_id = self.request.query_params.get('user_exercise_id')
        day = self.request.query_params.get('day')

        if user_id:
            queryset = queryset.filter(user_exercise__user_id=user_id)
        
        if user_exercise_id:
            queryset = queryset.filter(user_exercise_id=user_exercise_id)

        if day:
            # TODO: Add validation for date format if necessary
            queryset = queryset.filter(day=day)
            
        return queryset

class DayViewSet(viewsets.ModelViewSet):
    queryset = DayOfExercise.objects.all()
    serializer_class = DayOfExerciseSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user_exercise__user')
        if user_id:
            queryset = queryset.filter(user_exercise__user_id=user_id).distinct()
        return queryset