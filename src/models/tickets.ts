import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const getTickets = async (uuid: string) => {
  const tickets = await prisma.ticket.findMany({
    where: {
      userId: uuid,
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
    orderBy: {
      createdAt: 'desc',
    },
  });
  return tickets;
};

export const getAllTickets = async () => {
  const tickets = await prisma.ticket.findMany({
    include: {
      searches: {
        include: {
          response: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
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
  try {
    const ticket = await prisma.ticket.create({
      data: {
        ...body,
      },
    });
    console.log(ticket);

    return ticket;
  } catch (e) {
    console.log(e);
  }
};

export const updateTicketSearchFailed = async (
  id: number,
  err: any,
  message: string
) => {
  await prisma.ticket.update({
    where: {
      id: id,
    },
    data: {
      status: 'Failed',
      comment: `Failed at ${message} with Error ${err}`,
    },
  });
};

export const updateTicketAttempts = async (id: number, count: number) => {
  await prisma.ticket.update({
    where: {
      id: id,
    },
    data: {
      attempt: count + 1,
    },
  });
};
export const updateTicketComplete = async (id: number) => {
  await prisma.ticket.update({
    where: {
      id: id,
    },
    data: {
      status: 'complete',
    },
  });
};
export const cancelTicket = async (id: number) => {
  const ticket = await prisma.ticket.update({
    where: {
      id: id,
    },
    data: {
      status: 'cancelled',
      comment: 'Cancelled Search Request',
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
