import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const getUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
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
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          searches: {
            include: {
              response: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      },
    },
  });
  return user;
};
export const createUser = async (
  username: string,
  password: string,
  golferUsername: string,
  golferPassword: string
) => {
  const user = await prisma.user.create({
    data: {
      username: username,
      password: password,
      golferUsername: golferUsername,
      golferPassword: golferPassword,
    },
    include: {
      tickets: true,
    },
  });
  return user;
};
