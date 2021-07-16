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
exports.getAllItems = void 0;
const axios_1 = __importDefault(require("axios"));
const tickets_1 = require("../models/tickets");
const getAllItems = (cookies, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promise = yield axios_1.default({
            headers: {
                Cookie: cookies,
            },
            method: 'get',
            url: 'https://bergencountyrba.ezlinksgolf.com/api/cart/getallitems',
        });
        return promise;
    }
    catch (err) {
        tickets_1.updateTicketSearchFailed(id, err, 'getAllItems Request');
    }
});
exports.getAllItems = getAllItems;
//# sourceMappingURL=getAllItems.js.map