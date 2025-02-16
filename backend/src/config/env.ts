export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT as string) as Number,
  DB_PASS: process.env.DB_PASS,
  DATABASE_URL: process.env.DATABASE_URL,
  LOGS_TOKEN: process.env.LOGS_TOKEN as string,
  LOGS_HOST: process.env.LOGS_HOST,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: parseInt(process.env.JWT_EXPIRES_IN as string),
  REFRESH_SECRET: process.env.REFRESH_SECRET,
  REFRESH_EXPIRES_IN: parseInt(process.env.REFRESH_EXPIRES_IN as string),
};
