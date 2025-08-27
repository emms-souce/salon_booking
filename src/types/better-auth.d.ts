// Type augmentation for better-auth session and user types
import type { User as PrismaUser } from "@prisma/client";

declare module "better-auth" {
  export interface Session {
    user: PrismaUser;
    session: {
      id: string;
      userId: string;
      expiresAt: Date;
      token: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }
}

export {}