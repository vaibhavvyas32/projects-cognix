from django.core.management.base import BaseCommand
from gymjao_app.models import User, UserDetails, Exercise, UserExercise, Set, DayOfExercise
from datetime import date
import random

class Command(BaseCommand):
    help = 'Populate the database with dummy data for testing'

    def handle(self, *args, **kwargs):
        # Create Users
        users = []
        for i in range(3):
            user, _ = User.objects.get_or_create(username=f'user{i+1}', defaults={'password': 'password'})
            users.append(user)
            UserDetails.objects.get_or_create(user=user, defaults={
                'full_name': f'User {i+1}',
                'weight': 70 + i * 5,
                'height': f'{170 + i*2}cm'
            })

        # Create Exercises
        exercises = []
        for name, desc in [
            ('Push Up', 'A basic upper body exercise'),
            ('Squat', 'A basic lower body exercise'),
            ('Plank', 'A core strength exercise')
        ]:
            exercise, _ = Exercise.objects.get_or_create(name=name, defaults={'description': desc})
            exercises.append(exercise)

        # Create UserExercises
        user_exercises = []
        for user in users:
            for exercise in exercises:
                ue, _ = UserExercise.objects.get_or_create(user=user, exercise=exercise)
                user_exercises.append(ue)

        # Create Sets
        for ue in user_exercises:
            for i in range(2):
                Set.objects.get_or_create(
                    user_exercise=ue,
                    day=date.today(),
                    set_counts=random.randint(2, 5),
                    rep_counts=random.randint(8, 15)
                )

        # Create Days of Exercise
        days = ['Monday', 'Wednesday', 'Friday']
        for day in days:
            day_obj, _ = DayOfExercise.objects.get_or_create(day=day)
            # Assign all user_exercises to this day
            for ue in user_exercises:
                day_obj.user_exercise.add(ue)

        self.stdout.write(self.style.SUCCESS('Dummy data populated successfully!')) 