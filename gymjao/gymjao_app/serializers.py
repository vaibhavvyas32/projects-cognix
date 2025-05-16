from rest_framework import serializers
from .models import User,UserDetails,UserExercise,Exercise,Set,DayOfExercise

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class UserDetailsSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = UserDetails
        fields = ['user', 'full_name', 'weight', 'height']

    def create(self, validated_data):
        return UserDetails.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.weight = validated_data.get('weight', instance.weight)
        instance.height = validated_data.get('height', instance.height)
        instance.save()
        return instance

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'description']

class UserExerciseSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    exercise = ExerciseSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user', write_only=True)
    exercise_id = serializers.PrimaryKeyRelatedField(queryset=Exercise.objects.all(), source='exercise', write_only=True)
    class Meta:
        model = UserExercise
        fields = ['id', 'user', 'exercise', 'user_id', 'exercise_id']

class SetSerializer(serializers.ModelSerializer):
    user_exercise = UserExerciseSerializer(read_only=True)
    user_exercise_id = serializers.PrimaryKeyRelatedField(
        queryset=UserExercise.objects.all(),
        source='user_exercise',
        write_only=True
    )
    class Meta:
        model = Set
        fields = ['id', 'user_exercise', 'user_exercise_id', 'day', 'set_counts', 'rep_counts']

class DayOfExerciseSerializer(serializers.ModelSerializer):
    user_exercise = UserExerciseSerializer(many=True, read_only=True)
    user_exercise_ids = serializers.PrimaryKeyRelatedField(
        queryset=UserExercise.objects.all(),
        many=True,
        write_only=True,
        source='user_exercise'
    )
    class Meta:
        model = DayOfExercise
        fields = ['id','day','user_exercise','user_exercise_ids']
