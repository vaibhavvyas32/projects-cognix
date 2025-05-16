from django.db import models

# Create your models here.

from django.db import models

class User(models.Model):
    username = models.CharField(max_length=255, unique=True)
    password = models.CharField(max_length=255)

    def __str__(self):
        return self.username

class UserDetails(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    full_name = models.CharField(max_length=255)
    weight = models.FloatField(null=True, blank=True)
    height = models.CharField(max_length=50, null=True, blank=True)

    def __str__(self):
        return self.full_name

class Exercise(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class UserExercise(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.user.username} - {self.exercise.name}"

class Set(models.Model):
    user_exercise = models.ForeignKey(UserExercise, on_delete=models.CASCADE)
    day = models.DateField()
    set_counts = models.IntegerField()
    rep_counts = models.IntegerField()

    def __str__(self):
        return f"{self.user_exercise.user.username} - {self.user_exercise.exercise.name} on {self.day}"
    

class DayOfExercise(models.Model):
    DAY_CHOICES = [
            ('Monday', 'Monday'),
            ('Tuesday', 'Tuesday'),
            ('Wednesday', 'Wednesday'),
            ('Thursday', 'Thursday'),
            ('Friday', 'Friday'),
            ('Saturday', 'Saturday'),
            ('Sunday', 'Sunday'),
        ]
    user_exercise = models.ManyToManyField('UserExercise', related_name='days')
    day = models.CharField(max_length=9,choices=DAY_CHOICES, unique=True)

    def __str__(self):
        return self.day
