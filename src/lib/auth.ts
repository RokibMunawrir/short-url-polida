import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username } from "better-auth/plugins";
import { db } from "../db"; // your drizzle instance
import { user, account, session, verification } from "../db/schema/auth-schema";
import { sendVerificationEmail } from "./email/send-verification";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "mysql",
        schema: {
            user,
            account,
            session,
            verification,
        }
    }),
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async ({ user, url }) => {
            void sendVerificationEmail({ user, url });
        },
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                input: true
            },
            status: {
                type: "string",
                input: true
            },
        }
    },
    plugins: [
        username()
    ]
});