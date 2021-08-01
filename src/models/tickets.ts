import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const getTickets = async (uuid: string) => {
  const tickets = await prisma.ticket.findMany({
    where: {
      userId: uuid,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      searches: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          response: true,
        },
      },
    },
  });
  return tickets;
};

export const getAllTickets = async () => {
  console.log('getting all tickets');
  const tickets = await prisma.ticket.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      searches: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          response: true,
        },
      },
    },
  });
  return tickets;
};

export const getTicketByID = async (id: number) => {
  const ticket = await prisma.ticket.findUnique({
    where: {
      id: id,
    },
    include: {
      searches: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          response: true,
        },
      },
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
      status: 'failed',
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

export const updateExpired = async (id: number) => {
  await prisma.ticket.update({
    where: {
      id: id,
    },
    data: {
      status: 'Expired',
      comment: 'Date has already passed',
    },
  });
};

export const cancelTicket = async (id: number) => {
  const ticket = await prisma.ticket.update({
    where: {
      id: id,
    },
    include: {
      searches: {
        include: {
          response: true,
        },
      },
    },
    data: {
      comment: 'Cancelled Ticket Request',
      status: 'cancelled',
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
