import { PrismaClient, Prisma } from '@prisma/client';
import { FinishResponse } from '../requests/finish';
const prisma = new PrismaClient();
export const createResponse = async (id: number, body: FinishResponse) => {
  const search = await prisma.response.create({
    data: {
      searchId: id,
      ...body,
    },
  });
  return search;
};
