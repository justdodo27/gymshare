#!/bin/bash
python manage.py migrate & gunicorn gymshareapi.wsgi:application