from workouts.models import Exercise, Workout

# Admins accounts
ADMINS = (
    ('admin', 'admin@admin.com', 'Strong2137'),
)

# Users accounts
USERS = (
    ('dodo', 'dodo@dodo.com', 'Strong2137'),
)

# Exercises
EXERCISES = [
    (
        'Push Ups', 
        'The push-up (sometimes called a press-up in British English) is a common calisthenics exercise beginning from the prone position. By raising and lowering the body using the arms, push-ups exercise the pectoral muscles, triceps, and anterior deltoids, with ancillary benefits to the rest of the deltoids, serratus anterior, coracobrachialis and the midsection as a whole.',
        3,
        0.0063,
        '/backend/mediafiles/thumbnails/pushups.png',
        '/backend/mediafiles/videos/push-ups.mp4',
        Exercise.WITH_OWN_BODY_WEIGHT
    ),
    (
        'Deadlift',
        'The deadlift is a weight training exercise in which a loaded barbell or bar is lifted off the ground to the level of the hips, torso perpendicular to the floor, before being placed back on the ground. It is one of the three powerlifting exercises, along with the squat and bench press.',
        10,
        0.033,
        '/backend/mediafiles/thumbnails/deadlift.png',
        '/backend/mediafiles/videos/deadlift.mp4',
        Exercise.WITH_A_WEIGHT
    ),
    (
        'Running (Treadmill)',
        'Running on treadmill lol',
        1,
        0.13,
        '/backend/mediafiles/thumbnails/running-treadmill.png',
        '/backend/mediafiles/videos/running.mp4',
        Exercise.WITH_TIME
    ),
]

# Workouts
WORKOUTS = [
    (
        1,
        'Turbo Admin Workout',
        'Workout only for admin\'s',
        Workout.PUBLIC,
        2
    )
]

EXERCISE_IN_WORKOUTS = [
    (
        1,
        1,
        1,
        10,
        None,
        3
    ),
    (
        2,
        1,
        2,
        10,
        None,
        3
    ),
    (
        3,
        1,
        3,
        None,
        3600,
        1
    ),
]

# Statistics
STATISTIC_CALORIES = [
    {
        "date": "2022-08-29",
        "calories": 90.8625,
        "user": 1
    },
]

STATISTIC_EXERCISE = [
    {   
        "date": "2022-08-29T19:25:49.739738Z",
        "repeats": 30,
        "time": None,
        "weight": None,
        "exercise": 1,
        "user": 1
    },
    {
        "date": "2022-08-29T19:26:12.781326Z",
        "repeats": 30,
        "time": None,
        "weight": None,
        "exercise": 1,
        "user": 1
    },
    {
        "date": "2022-08-29T19:26:12.789855Z",
        "repeats": None,
        "time": "15.000",
        "weight": None,
        "exercise": 3,
        "user": 1
    },
    {
        "date": "2022-08-29T19:26:12.797326Z",
        "repeats": 30,
        "time": None,
        "weight": "100.000",
        "exercise": 2,
        "user": 1
    } 
]