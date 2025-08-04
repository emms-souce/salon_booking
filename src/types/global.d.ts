// Global type definitions for better-auth
import type { User as PrismaUser } from "@prisma/client";

declare global {
  namespace BetterAuth {
    interface User extends PrismaUser {}
  }
}

export {}