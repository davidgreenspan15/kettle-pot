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
exports.createAddObj = exports.createAllCookies = exports.add = exports.password = exports.username = void 0;
const axios_1 = __importDefault(require("axios"));
const tickets_1 = require("../models/tickets");
exports.username = process.env.USERNAME;
exports.password = process.env.PASSWORD;
const add = (body, cookies, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promise = yield axios_1.default({
            headers: {
                'Content-Type': 'application/json',
                Cookie: cookies,
            },
            method: 'post',
            url: 'https://bergencountyrba.ezlinksgolf.com/api/cart/add',
            data: body,
        });
        return promise;
    }
    catch (err) {
        tickets_1.updateTicketSearchFailed(id, err, 'add Request');
    }
});
exports.add = add;
const createAllCookies = (sessionCookies, setCookies) => {
    const cookiesArray = [sessionCookies];
    setCookies.forEach((c) => {
        cookiesArray.push(c.split(';')[0]);
    });
    return cookiesArray.join('; ');
};
exports.createAllCookies = createAllCookies;
const createAddObj = (reserveObj, loggedIn, reserved, searchObj) => {
    const allCookies = exports.createAllCookies(reserveObj.cookies, loggedIn === null || loggedIn === void 0 ? void 0 : loggedIn.headers['set-cookie']);
    const addRequest = {
        r01: reserveObj.body.p01,
        r02: reserved === null || reserved === void 0 ? void 0 : reserved.data.r02[0],
        r03: searchObj.p06,
        r04: false,
        r05: loggedIn === null || loggedIn === void 0 ? void 0 : loggedIn.data.ContactID,
        r06: false,
        r07: loggedIn === null || loggedIn === void 0 ? void 0 : loggedIn.data.SessionID,
        r08: reserveObj.body.p02[0].r01,
        r09: loggedIn === null || loggedIn === void 0 ? void 0 : loggedIn.data.CsrfToken, //login rez "CsrfToken": "6528f372-2df1-4dd9-8be5-0b8779322adb",
    };
    return { addRequest, allCookies };
};
exports.createAddObj = createAddObj;
//# sourceMappingURL=add.js.map