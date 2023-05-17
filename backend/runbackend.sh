#!/bin/bash
python manage.py migrate & python manage.py initstats & gunicorn gymshareapi.wsgi:application -w 17
