import { Prisma } from '@prisma/client';

export function throwMappedPrismaError(
  error: unknown,
  handlers: Partial<Record<Prisma.PrismaClientKnownRequestError['code'], () => never>>,
): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const handler = handlers[error.code];
    if (handler) {
      return handler();
    }
  }

  throw error;
}
