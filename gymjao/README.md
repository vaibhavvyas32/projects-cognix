# Gym Exercises App

A web application to track daily exercise routines, including sets and reps, for personal use and sharing with friends. The app allows users to record exercises, view progress, and keep track of workout history.

## Features

- **User Management**: Register and log in to track personal exercise data.
- **Exercise Tracking**: Record sets and reps for different exercises on specific days.
- **User Profile**: Maintain personal details such as full name, weight, and height.
- **Exercise Database**: Add and manage different exercises with descriptions.
- **Progress Tracking**: View workout history over time.

## Technologies Used

- **Backend**: Django (Python)
- **Database**: SQLite (default for Django, can be replaced with PostgreSQL/MySQL)
- **Frontend**: HTML, CSS, JavaScript (can be extended with a frontend framework)
- **Dependencies**: Django REST Framework (for API development if needed)

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/gym-exercises-app.git
   cd gym-exercises-app
2. **Create virtual env**
   ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
4. **Run Migrations**
   ```bash
    python manage.py makemigrations
    python manage.py migrate
5. **Create superuser**
   ```bash
   python manage.py createsuperuser
6. **Run Server**
    ```bash
    python manage.py runserver


## Structure of Folder Should look like 

  ```bash

      gym-exercises-app/
      │
      ├── gymapp/               # Main Django app containing models, views, etc.
      │   ├── migrations/       # Database migration files
      │   ├── templates/        # HTML templates for the web app
      │   ├── models.py         # Database models
      │   ├── views.py          # Logic for handling requests
      │   ├── urls.py           # URL routing for the app
      │   └── ...
      │
      ├── gym_exercises/        # Project configuration
      │   ├── settings.py       # Django settings
      │   ├── urls.py           # URL routing for the project
      │   └── ...
      │
      ├── requirements.txt      # List of dependencies
      ├── README.md             # Project description
      └── manage.py             # Django management script
