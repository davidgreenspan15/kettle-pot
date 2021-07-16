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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReserveOBJ = exports.reservation = void 0;
const axios_1 = __importDefault(require("axios"));
const tickets_1 = require("../models/tickets");
const reservation = (body, cookies, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promise = yield axios_1.default({
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookies,
            },
            method: 'post',
            url: 'https://bergencountyrba.ezlinksgolf.com/api/search/reservation',
            data: body,
        });
        return promise;
    }
    catch (err) {
        tickets_1.updateTicketSearchFailed(id, err, 'reservation Request');
    }
});
exports.reservation = reservation;
const createReserveOBJ = (response) => {
    let d = response.data;
    let match = d.r06[0];
    let body = {
        p02: [
            {
                r01: match.r06,
                r02: match.r05,
                r03: match.r13,
                r04: match.r03,
                r05: match.r03,
                r06: match.r02.toFixed(0),
                r07: match.r20, //r20
            },
        ],
        p01: match.r01,
        p03: d.r02, // in root r02
    };
    let cookies = response.headers['set-cookie'][0].split(';')[0];
    console.log({ body, cookies });
    return { body, cookies };
};
exports.createReserveOBJ = createReserveOBJ;
//# sourceMappingURL=reservation.js.map