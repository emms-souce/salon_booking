// Global type definitions for better-auth
import type { User as PrismaUser } from "@prisma/client";

declare global {
  namespace BetterAuth {
    type User = PrismaUser
  }
}

export {}