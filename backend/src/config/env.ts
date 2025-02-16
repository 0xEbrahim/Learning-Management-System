export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT:parseInt(process.env.PORT as string) as Number,
  DB_PASS: process.env.DB_PASS,
  DATABASE_URL: process.env.DATABASE_URL,
  LOGS_TOKEN: process.env.LOGS_TOKEN as string,
  LOGS_HOST: process.env.LOGS_HOST
};
