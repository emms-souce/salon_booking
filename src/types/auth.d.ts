// Type augmentation for better-auth session and user types
import type { User as PrismaUser } from "@prisma/client";

// Global augmentation for better-auth
import "better-auth";

declare module "better-auth" {
  interface Session {
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
  
  interface User extends PrismaUser {}
}

// Type helper for session
export type AuthUser = PrismaUser;

// Type guard for authenticated sessions
export function isAuthenticatedSession(
  session: any
): session is { user: PrismaUser } {
  return session?.user?.id !== undefined;
}

export type AuthenticatedSession = {
  user: PrismaUser;
};