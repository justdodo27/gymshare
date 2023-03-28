#!/bin/bash
python manage.py migrate & python manage.py initworkouts & gunicorn gymshareapi.wsgi:application