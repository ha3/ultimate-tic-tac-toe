FROM python:3.8-slim AS base

RUN mkdir app
WORKDIR /app
COPY ./requirements.txt .
RUN pip install -r requirements.txt
COPY . .
ENV CONFIG_PATH /app/settings.cfg

FROM base AS dev
EXPOSE 5000
CMD ["python", "app.py"]

FROM base AS prod
EXPOSE 80
CMD ["gunicorn", "--worker-class", "eventlet", "-w", "1", "-b", "0.0.0.0:80", "src.app:app"]
