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

## File structure
```txt
.
├── cockroach-db
├── logs/
│   ├── app.log
│   └── error.log
├── prisma/
│   ├── migrations
│   ├── .gitignore
│   └── schema.prisma
├── src/
│   ├── config/
│   │   ├── cloudinary.ts
│   │   ├── email.ts
│   │   ├── env.ts
│   │   ├── logger.ts
│   │   ├── multer.ts
│   │   ├── passport.ts
│   │   ├── prisma.ts
│   │   ├── redis.ts
│   │   └── stripe.ts
│   ├── interfaces/
│   │   └── types.ts
│   ├── middlewares/
│   │   ├── globalError.ts
│   │   ├── isAuthorized.ts
│   │   ├── isAuthenticated.ts
│   │   ├── isBuyer.ts
│   │   └── isOwner.ts
│   ├── modules/
│   │   ├── Auth/
│   │   │   ├── Auth.Controller.ts
│   │   │   ├── Auth.Routes.ts
│   │   │   ├── Auth.Interface.ts
│   │   │   ├── Auth.Service.ts
│   │   │   └── Auth.Validation.ts
│   │   ├── Category/
│   │   │   ├── Category.Controller.ts
│   │   │   ├── Category.Routes.ts
│   │   │   ├── Category.Interface.ts
│   │   │   ├── Category.Service.ts
│   │   │   └── Category.Validation.ts
│   │   ├── Course/
│   │   │   ├── Course.Controller.ts
│   │   │   ├── Course.Routes.ts
│   │   │   ├── Course.Interface.ts
│   │   │   ├── Course.Service.ts
│   │   │   └── Course.Validation.ts
│   │   ├── Order/
│   │   │   ├── Order.Controller.ts
│   │   │   ├── Order.Routes.ts
│   │   │   ├── Order.Interface.ts
│   │   │   ├── Order.Service.ts
│   │   │   └── Order.Validation.ts
│   │   ├── User/
│   │   │   ├── User.Controller.ts
│   │   │   ├── User.Routes.ts
│   │   │   ├── User.Interface.ts
│   │   │   ├── User.Service.ts
│   │   │   └── User.Validation.ts
│   │   └── Video/
│   │       ├── Video.Controller.ts
│   │       ├── Video.Routes.ts
│   │       ├── Video.Interface.ts
│   │       ├── Video.Service.ts
│   │       └── Video.Validation.ts
│   ├── Sockets/
│   │   └── init.socket.ts
│   ├── swagger/
│   │   └── swagger.yaml
│   ├── types/
│   │   └── types.d.ts
│   ├── uploads/
│   │   ├── courses/
│   │   │   └── x.png
│   │   ├── users/
│   │   │   └── x.png
│   │   ├── videos/
│   │   │   └── x.mp4
│   │   └── .gitignore
│   ├── utils/
│   │   ├── Functions/
│   │   │   └── functions.ts
│   │   ├── JWT/
│   │   │   └── token.ts
│   │   ├── APIErrir.ts
│   │   ├── APIFeatures.ts
│   │   ├── asyncHandler.ts
│   │   ├── options.ts
│   │   ├── sendResponse.ts
│   │   └── validation.ts
│   ├── views/
│   │   ├── accountReactive.ts
│   │   ├── emailVerifyTemplate.ts
│   │   ├── OrderConfirm.ts
│   │   └── passwordResetTemplate.ts
│   ├── app.ts
│   ├── copy.ts
│   └── server.ts
├── .dockerignore
├── .env
├── .env.example
├── .env.prod
├── .gitignore
├── docker-compose.yaml
├── Dockerfile
├── nodemon.json
├── package-lock.json
├── package.json
├── README.md
└── tsconfig.json
```
