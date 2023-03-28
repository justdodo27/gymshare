#!/bin/bash
python manage.py migrate & python manage.py initaccounts & gunicorn gymshareapi.wsgi:application