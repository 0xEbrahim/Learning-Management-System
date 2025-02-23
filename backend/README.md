# Learning-Management-System

#### 1 - you need to clone the repository

```git
git clone https://github.com/0xEbrahim/Learning-Management-System
```

```bash
cd backend
```

#### 2 - build the docker image from the Dockerfile

```docker
docker build -t lms-api:v1.0 .
```

#### 3 - Run docker container from the image but you need to pass `.env` file providing all the requirements that exists at `.env.example` file and expose PORT `3000`

```
docker container run --env-file .env -p 3000:3000 lms-api:v1.0
```

- You should see that you application is running now
