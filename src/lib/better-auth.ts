import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
    maxPasswordLength: 128,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    modelName: "User",
    fields: {
      name: "name",
      email: "email",
      emailVerified: "emailVerified",
      image: "image",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  },
  session: {
    modelName: "Session",
    fields: {
      expiresAt: "expiresAt",
      token: "token",
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [],
});

export type Auth = typeof auth;