API deployed on AWS EC2: ``` http://13.48.136.54:3000/```


## 1 - You don't have docker installed

#### 1 - Create your `.env` file.

- use `.env.example` file as a refrence for the variables that should be exist on the `.env` file.

#### 2 - Install the dpendencies

```shell
 npm install
```

#### 3 - start the server

- for development

```shell
npm run dev
```

- for build

```shell
npm run build
```

- To start

```shell
npm run start
```

<br>

## .env file

```txt
# Env
NODE_ENV="PRODUCTION OR DEVELOPMENT"
PORT="PORT"
DEV_URL="BASE URL ON DEVELOPMENT"
PROD_URL="YOUR BASE URL ON PRODUCTION"
FRONT_END_BASE=YOUR_FRONT_END_BASE_URL


# DB
DB_PASS="DATABASE PASSWORD"
DATABASE_URL="DATABASE URI"

# Logs
LOGS_HOST="LOG SERVICE HOST"
LOGS_TOKEN="LOG SERVICE TOKEN"

# CAHCHING
REDIS_USERNAME=REDIS_USERNAME
REDIS_PASSWORD=REDIS_PASSWORD
REDIS_SOCKET_HOST=REDIS_HOST
REDIS_SOCKET_PORT=REDIS_PORT

# Token
JWT_SECRET="JWT SECRET"
JWT_EXPIRES_IN="JWT EXPIRATION TIME"
REFRESH_SECRET="JWT REFRESH TOKEN SECRET"
REFRESH_EXPIRES_IN="JWT REFRESH TOKEN EXPIRATION TIME"

# Cloud
CLOUD_NAME="CLOUDINARY NAME"
CLOUD_KEY="CLOUDINARY KEY"
CLOUD_SECRET="CLOUDINARY SECRET"
CLOUDINARY_URL="CLOUDINARY URI"

# Email
SMTP_HOST="SMTP SERVICE"
SMTP_PORT="SMTP PORT"
SMTP_USER="YOUR SMTP EMAIL"
SMTP_PASS="SMTP PASSWORD"

# Session
SESSION_SECRET="SESSION SECRET"


# Google Auth 2.0
GOOGLE_CLIENT_ID="GOOGLE AUTH CLIENT ID"
GOOGLE_CLIENT_SECRET="GOOGLE AUTH SECRET"
GOOGLE_DEV_CALLBACK="YOUR GOOGLE AUTH CALLBACK ON DEVELOPMENT"
GOOGLE_PROD_CALLBACK="YOUR GOOGLE AUTH CALLBACK ON PRODUCTION"

STRIPE_PUBLIC_KEY=STRIPE PUBLIC KEY
STRIPE_SECRET_KEY=STRIPE SECRET KEY
STRIPE_WEBHOOK_SECRET=STRIPE WEBHOOK SECRET KEY

# Public
DEFAULT_PROF_PIC=DEFAULT PFP LINK
```

<br>

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
│   │   ├── hasAccess.ts
│   │   └── isCourseAuthor.ts
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
│   │   ├── APIError.ts
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
