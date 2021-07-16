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
exports.createUser = exports.getUserById = exports.getUserByEmail = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
        where: {
            email: email,
        },
        include: {
            tickets: true,
        },
    });
    return user;
});
exports.getUserByEmail = getUserByEmail;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.findUnique({
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
});
exports.getUserById = getUserById;
const createUser = (name, email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma.user.create({
        data: {
            email: email,
            name: name,
        },
        include: {
            tickets: true,
        },
    });
    return user;
});
exports.createUser = createUser;
//# sourceMappingURL=user.js.map