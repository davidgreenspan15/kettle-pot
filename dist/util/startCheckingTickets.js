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
exports.handleSearch = void 0;
const add_1 = require("../requests/add");
const search_1 = require("../requests/search");
const reservation_1 = require("../requests/reservation");
const login_1 = require("../requests/login");
const getAllItems_1 = require("../requests/getAllItems");
const holdReservation_1 = require("../requests/holdReservation");
const tickets_1 = require("../models/tickets");
const tickets_2 = require("../models/tickets");
const searches_1 = require("../models/searches");
const teeTimeConflict_1 = require("../requests/teeTimeConflict");
const responses_1 = require("../models/responses");
const finish_1 = require("../requests/finish");
const startSearch = (t) => __awaiter(void 0, void 0, void 0, function* () {
    const id = t.id;
    let searchTicket = null;
    const searchObj = search_1.createSearchOBJ(t);
    let searchResponseData;
    let searchResponseHeaders;
    let reserveObj;
    let reserveResponseData;
    let reserveResponseHeaders;
    let loginResponseData;
    let loginResponseHeaders;
    let allItemsResponseData;
    let holdRezObj;
    let addObj;
    let holdResponseData;
    let holdResponseHeaders;
    let teeTimeCoflictObj;
    let ttConflictResponseData;
    let ttConflictResponseHeaders;
    let finishObj;
    let finishResponseData;
    try {
        yield tickets_2.updateTicketAttempts(id, t.attempt);
    }
    catch (err) {
        console.log(err);
    }
    try {
        searchTicket = yield searches_1.createSearch(id);
    }
    catch (err) {
        console.log(err);
    }
    if (searchTicket) {
        try {
            console.log(searchObj, 'starting search with this object');
            let searchResp = yield search_1.search(searchObj, id);
            searchResponseData = searchResp === null || searchResp === void 0 ? void 0 : searchResp.data;
            searchResponseHeaders = searchResp === null || searchResp === void 0 ? void 0 : searchResp.headers;
        }
        catch (err) {
            console.log(err);
            yield searches_1.updateSearchesStatus(searchTicket.id, err, 'Failed Search');
            yield tickets_2.updateTicketSearchFailed(id, err, 'Fail Search Request On Index ');
        }
        if (searchResponseData.r06.length > 0) {
            try {
                yield searches_1.updateSearchesStatus(searchTicket.id, '', 'Start Reservation Process');
                reserveObj = reservation_1.createReserveOBJ({
                    data: searchResponseData,
                    headers: searchResponseHeaders,
                });
                console.log(reserveObj, 'starting reserve Reserve Object');
                let reserved = yield reservation_1.reservation(reserveObj.body, reserveObj.cookies, id);
                reserveResponseData = reserved === null || reserved === void 0 ? void 0 : reserved.data;
                reserveResponseHeaders = reserved === null || reserved === void 0 ? void 0 : reserved.headers;
            }
            catch (err) {
                console.log(err);
                yield searches_1.updateSearchesStatus(searchTicket.id, err, 'Failed Reservation Process');
                yield tickets_2.updateTicketSearchFailed(id, err, 'Fail Reservation Request On Index');
            }
            try {
                yield searches_1.updateSearchesStatus(searchTicket.id, '', 'Start Login Process');
                console.log({
                    data: reserveResponseData.r02[0].r06,
                    cookies: reserveObj.cookies,
                }, 'starting login  with these');
                let loggedIn = yield login_1.login(reserveResponseData.r02[0].r06, reserveObj.cookies, id);
                loginResponseData = loggedIn === null || loggedIn === void 0 ? void 0 : loggedIn.data;
                loginResponseHeaders = loggedIn === null || loggedIn === void 0 ? void 0 : loggedIn.headers;
            }
            catch (err) {
                console.log(err);
                yield searches_1.updateSearchesStatus(searchTicket.id, err, 'Failed Login Process');
                yield tickets_2.updateTicketSearchFailed(id, err, 'Fail Login Request On Index');
            }
            try {
                yield searches_1.updateSearchesStatus(searchTicket.id, '', 'Start Add Process');
                addObj = add_1.createAddObj(reserveObj, { data: loginResponseData, headers: loginResponseHeaders }, { data: reserveResponseData, headers: reserveResponseHeaders }, searchObj);
                console.log(addObj, 'logging in with add obj');
                const { addRequest, allCookies } = addObj;
                let added = yield add_1.add(addRequest, allCookies, id);
            }
            catch (err) {
                console.log(err);
                yield searches_1.updateSearchesStatus(searchTicket.id, err, 'Failed Add Process');
                yield tickets_2.updateTicketSearchFailed(id, err, 'Fail Add Item On Index');
            }
            try {
                yield searches_1.updateSearchesStatus(searchTicket.id, '', 'Start Get All Items Process');
                console.log(addObj, 'getAllItems with add obj');
                let allItems = yield getAllItems_1.getAllItems(addObj.allCookies, id);
                allItemsResponseData = allItems === null || allItems === void 0 ? void 0 : allItems.data;
            }
            catch (err) {
                console.log(err);
                yield searches_1.updateSearchesStatus(searchTicket.id, err, 'Failed Get All Items Process');
                yield tickets_2.updateTicketSearchFailed(id, err, 'Fail Get All Items Request on Index');
            }
            try {
                yield searches_1.updateSearchesStatus(searchTicket.id, '', 'Start Hold Reservation Process');
                holdRezObj = holdReservation_1.createHoldReZObj(allItemsResponseData.CartItems[0].SponsorID, loginResponseData, reserveResponseData.r02[0].r06);
                console.log(holdRezObj, 'holding reservation with holdrezobj');
                const holdResponse = yield holdReservation_1.holdReservation(holdRezObj, addObj.allCookies, id);
                holdResponseData = holdResponse === null || holdResponse === void 0 ? void 0 : holdResponse.data;
                holdResponseHeaders = holdResponse === null || holdResponse === void 0 ? void 0 : holdResponse.headers;
            }
            catch (err) {
                yield searches_1.updateSearchesStatus(searchTicket.id, err, 'Failed Hold Reservation Process');
                console.log(err);
                yield tickets_2.updateTicketSearchFailed(id, err, 'Start HoldReservation Request On Index');
            }
            try {
                yield searches_1.updateSearchesStatus(searchTicket.id, '', 'Start Check Time Conlfict Process');
                teeTimeCoflictObj = teeTimeConflict_1.createTeeTimeConflictObj(allItemsResponseData.CartItems[0], loginResponseData);
                const ttConflict = yield teeTimeConflict_1.teeTimeConflict(teeTimeCoflictObj, addObj.allCookies, id);
                ttConflictResponseData = ttConflict === null || ttConflict === void 0 ? void 0 : ttConflict.data;
                ttConflictResponseHeaders = ttConflict === null || ttConflict === void 0 ? void 0 : ttConflict.headers;
            }
            catch (err) {
                yield searches_1.updateSearchesStatus(searchTicket.id, err, 'Failed Check Time Conlfict Process');
                console.log(err);
                yield tickets_2.updateTicketSearchFailed(id, err, 'Start Check Tee Time Conflict Request On Index');
            }
            try {
                yield searches_1.updateSearchesStatus(searchTicket.id, '', 'Start Finish Process');
                finishObj = yield finish_1.createFinishObj(allItemsResponseData.CartItems[0], loginResponseData, reserveResponseData.r02[0].r06);
                const finishedRez = yield finish_1.finish(finishObj, addObj.allCookies, id);
                finishResponseData = finishedRez === null || finishedRez === void 0 ? void 0 : finishedRez.data;
                yield tickets_1.updateTicketComplete(id);
                yield searches_1.updateSearchesStatus(searchTicket.id, '', 'Completed!');
                console.log(finishedRez === null || finishedRez === void 0 ? void 0 : finishedRez.data, 'responnse data');
                yield responses_1.createResponse(searchTicket.id, finishResponseData);
            }
            catch (err) {
                console.log(err);
                yield searches_1.updateSearchesStatus(searchTicket.id, err, 'Failed Finish Process');
                yield tickets_2.updateTicketSearchFailed(id, err, 'Start Finish Booking Request On Index');
            }
        }
    }
    return finishResponseData;
});
const handleSearch = () => __awaiter(void 0, void 0, void 0, function* () {
    let tickets = [];
    const searchResponses = [];
    try {
        tickets = yield tickets_1.getAllTickets();
    }
    catch (err) {
        console.log(err);
    }
    tickets.forEach((ticket) => __awaiter(void 0, void 0, void 0, function* () {
        if (ticket.status === 'searching') {
            let search = yield Promise.resolve(startSearch(ticket));
            searchResponses.push(search);
        }
    }));
    return { searchResponses, tickets };
});
exports.handleSearch = handleSearch;
//# sourceMappingURL=startCheckingTickets.js.map