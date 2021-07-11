import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();
export const createSearch = async (id: number, body: any) => {
  let json = body as Prisma.JsonObject;
  const search = await prisma.search.create({
    data: {
      ticketId: id,
      searchRequest: json,
      searchResponse: null,
      reservationRequest: null,
      reservationResponse: null,
      loginRequest: null,
      loginResponse: null,
      addRequest: null,
      addResponse: null,
      getAllItemsRequest: null,
      getAllItemsResponse: null,
      holdReservationRequest: null,
      holdReservationResponse: null,
    },
  });
  return search;
};

export const addSearchResponse = async (id: number, body: any) => {
  let json = body as Prisma.JsonObject;
  const search = await prisma.search.update({
    where: { id: id },
    data: {
      searchResponse: json,
    },
  });
  return search;
};
