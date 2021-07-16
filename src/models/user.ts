import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const getUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    include: {
      tickets: true,
    },
  });
  return user;
};
export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    include: {
      tickets: {
        include: {
          searches: {
            include: {
              response: true,
            },
          },
        },
      },
    },
  });
  return user;
};
export const createUser = async (name: string, email: string) => {
  const user = await prisma.user.create({
    data: {
      email: email,
      name: name,
    },
    include: {
      tickets: true,
    },
  });
  return user;
};
