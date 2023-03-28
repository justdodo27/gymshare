#!/bin/bash
python manage.py migrate & python manage.py initexercises & gunicorn gymshareapi.wsgi:application