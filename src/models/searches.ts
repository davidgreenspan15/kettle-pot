import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
export const createSearch = async (id: number) => {
  const search = await prisma.search.create({
    data: {
      ticketId: id,
      comments: null,
      status: 'Starting Search',
    },
  });
  return search;
};

export const updateSearchesStatus = async (
  id: number,
  err: any,
  failedAt: string
) => {
  await prisma.search.update({
    where: {
      id: id,
    },
    data: {
      status: failedAt,
      comments: `${err}`,
    },
  });
};
