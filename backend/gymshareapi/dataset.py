from workouts.models import Exercise

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
        11,
        '/backend/mediafiles/thumbnails/pushups.png',
        None,
        Exercise.WITH_OWN_BODY_WEIGHT
    ),
    (
        'Deadlift',
        'The deadlift is a weight training exercise in which a loaded barbell or bar is lifted off the ground to the level of the hips, torso perpendicular to the floor, before being placed back on the ground. It is one of the three powerlifting exercises, along with the squat and bench press.',
        10,
        3,
        '/backend/mediafiles/thumbnails/deadlift.png',
        None,
        Exercise.WITH_A_WEIGHT
    ),
    (
        'Running (Treadmill)',
        'Running on treadmill lol',
        1,
        10,
        '/backend/mediafiles/thumbnails/running-treadmill.png',
        None,
        Exercise.WITH_TIME
    ),
]