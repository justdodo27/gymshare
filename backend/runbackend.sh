#!/bin/bash
<<<<<<< HEAD
python manage.py migrate & python manage.py initstats & gunicorn gymshareapi.wsgi:application -w 100
=======
python manage.py migrate & python manage.py initstats & gunicorn gymshareapi.wsgi:application
>>>>>>> f05807a84c02fac1d8b93cced8805c7bbe4385b7
