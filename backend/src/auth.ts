import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./db.js";

passport.serializeUser((user: any, done: (err: any, id?: string) => void) => done(null, user.id));

passport.deserializeUser(async (id: string, done: (err: any, user?: any) => void) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
    },
    async (accessToken: string, refreshToken: string, profile: any, done: (err: any, user?: any) => void) => {
      try {
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;

        let user = await prisma.user.findUnique({ where: { googleId } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              googleId,
              email,
              name: profile.displayName,
              picture: profile.photos?.[0]?.value,
            },
          });
        }

        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

export default passport;

