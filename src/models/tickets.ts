import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const getTickets = async (uuid: string) => {
  const tickets = await prisma.ticket.findMany({
    where: {
      userId: uuid,
    },
    include: {
      response: true,
    },
  });
  return tickets;
};

export const getAllTickets = async () => {
  const tickets = await prisma.ticket.findMany({
    include: {
      response: true,
    },
  });
  return tickets;
};

export const getTicketByID = async (id: number) => {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: id,
    },
  });
  return ticket;
};

export const createTicket = async (body: SearchForm) => {
  const ticket = await prisma.ticket.create({
    data: {
      ...body,
    },
  });
  return ticket;
};

interface SearchForm {
  userId: string;
  courses: number[];
  date: string;
  startTime: string;
  endTime: string;
  min: number;
  max: number;
}
