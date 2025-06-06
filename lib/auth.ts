import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, user } from "./db";
import { anonymous } from "better-auth/plugins";
import { eq } from "drizzle-orm";

export const auth = betterAuth({
  user: {
    additionalFields: {
      credits: {
        type: "number",
        default: 10,
      },
    },
  },
  plugins: [
    anonymous(),
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  secret: process.env.BETTER_AUTH_SECRET!,
  trustedOrigins: [process.env.BETTER_AUTH_URL!],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
export const getUser = async (id: string) => {
  const [dbUser] = await db.select().from(user).where(eq(user.id, id));
  return dbUser;
};

