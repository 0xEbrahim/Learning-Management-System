# Learning-Management-System

#### 1 - you need to clone the repository

```git
git clone https://github.com/0xEbrahim/Learning-Management-System
```

```bash
cd backend
```

## If you have docker installed

#### 2 - Create your `.env` file.

- use `.env.example` file as a refrence for the variables that should be exist on the `.env` file, if you specified a PORT that is not 3000 make sure you changes to exposed ports at `dockerfile` and `docker-compose` files

#### 3 - build the docker image from the `docker-compose.yml` file and make it up using

```shell
docker-compose up --build
```

- You can use `-d` tag with the command above to make it work on the background

#### 4 - Now you need to migrate your database before start working with the application

```shell
docker-compose exec web npx prisma migrate dev --name migrate_my_db
```

#### 5 - You can access you prisma studio

```shell
docker-compose exec web npx prisma studio
```

#### 6 - Now your application is running on the port you specified at the `.env` file, you can start working with it
