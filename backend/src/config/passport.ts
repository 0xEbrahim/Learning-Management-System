import passport from "passport";
import google from "passport-google-oauth20";
import prisma from "./prisma";
import config from "./env";
import APIError from "../utils/APIError";
import { hashPassword } from "../utils/Functions/functions";

const strategy = new google.Strategy(
  {
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL:
      config.NODE_ENV === "development"
        ? config.GOOGLE_DEV_CALLBACK
        : config.GOOGLE_PROD_CALLBACK,
    passReqToCallback: true,
  },
  async function (req, accessToken, refreshToken, profile, cb) {
    try {
      let user;
      user = await prisma.user.findUnique({
        where: {
          googleId: profile.id,
        },
      });
      if (!user) {
        user = await prisma.user.findUnique({
          where: {
            email: profile._json.email as string,
          },
        });
        if (!user) {
          const pass = await hashPassword(
            (Math.random() * 10000000000 + "-" + "aaggs").toString()
          );
          user = await prisma.user.create({
            data: {
              name: profile._json.name as string,
              email: profile._json.email as string,
              googleId: profile._json.sub,
              avatar: profile._json.picture,
              emailVerified: true,
              password: pass,
            },
          });
        } else {
          user = await prisma.user.update({
            where: {
              email: user.email,
            },
            data: {
              googleId: profile.id,
            },
          });
        }
      }
      cb(null, user);
    } catch (e: any) {
      throw new APIError(e.message, 500);
    }
  }
);

passport.use(strategy);
passport.serializeUser((user: any, cb) => cb(null, user.id));
passport.deserializeUser(async (id, cb) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id as string,
    },
  });
  cb(null, user);
});

export default passport;
