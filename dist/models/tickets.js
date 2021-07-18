"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTicketComplete = exports.updateTicketAttempts = exports.updateTicketSearchFailed = exports.createTicket = exports.getTicketByID = exports.getAllTickets = exports.getTickets = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTickets = (uuid) => __awaiter(void 0, void 0, void 0, function* () {
    const tickets = yield prisma.ticket.findMany({
        where: {
            userId: uuid,
        },
        include: {
            searches: {
                include: {
                    response: true,
                },
            },
        },
    });
    return tickets;
});
exports.getTickets = getTickets;
const getAllTickets = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('getting all tickets');
    const tickets = yield prisma.ticket.findMany({
        include: {
            searches: {
                include: {
                    response: true,
                },
            },
        },
    });
    return tickets;
});
exports.getAllTickets = getAllTickets;
const getTicketByID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield prisma.ticket.findUnique({
        where: {
            id: id,
        },
    });
    return ticket;
});
exports.getTicketByID = getTicketByID;
const createTicket = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const ticket = yield prisma.ticket.create({
        data: Object.assign({}, body),
    });
    return ticket;
});
exports.createTicket = createTicket;
const updateTicketSearchFailed = (id, err, message) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.ticket.update({
        where: {
            id: id,
        },
        data: {
            status: 'failed',
            comment: `Failed at ${message} with Error ${err}`,
        },
    });
});
exports.updateTicketSearchFailed = updateTicketSearchFailed;
const updateTicketAttempts = (id, count) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.ticket.update({
        where: {
            id: id,
        },
        data: {
            attempt: count + 1,
        },
    });
});
exports.updateTicketAttempts = updateTicketAttempts;
const updateTicketComplete = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.ticket.update({
        where: {
            id: id,
        },
        data: {
            status: 'complete',
        },
    });
});
exports.updateTicketComplete = updateTicketComplete;
//# sourceMappingURL=tickets.js.map