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
exports.createHoldReZObj = exports.holdReservation = void 0;
const axios_1 = __importDefault(require("axios"));
const tickets_1 = require("../models/tickets");
const holdReservation = (body, cookies, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promise = yield axios_1.default({
            headers: {
                Cookie: cookies,
            },
            method: 'post',
            url: 'https://bergencountyrba.ezlinksgolf.com/api/cart/holdreservation',
            data: body,
        });
        return promise;
    }
    catch (err) {
        tickets_1.updateTicketSearchFailed(id, err, 'holdReservation Request');
    }
});
exports.holdReservation = holdReservation;
const createHoldReZObj = (sponsorID, loggedIn, masterSponsorID) => {
    return {
        PriceWindowIDs: null,
        SponsorID: `${sponsorID}`,
        ContactID: loggedIn.ContactID,
        SessionID: loggedIn.SessionID,
        MasterSponsorID: `${masterSponsorID}`,
    };
};
exports.createHoldReZObj = createHoldReZObj;
//# sourceMappingURL=holdReservation.js.map