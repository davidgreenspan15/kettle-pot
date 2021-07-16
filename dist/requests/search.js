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
exports.createSearchOBJ = exports.search = void 0;
const axios_1 = __importDefault(require("axios"));
const moment_1 = __importDefault(require("moment"));
const tickets_1 = require("../models/tickets");
const search = (body, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promise = yield axios_1.default({
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'post',
            url: 'https://bergencountyrba.ezlinksgolf.com/api/search/search',
            data: body,
        });
        return promise;
    }
    catch (err) {
        console.log(err, 'failed here');
        tickets_1.updateTicketSearchFailed(id, err, 'search Request');
    }
});
exports.search = search;
const convertTime = (time) => {
    let startT = time.split(':');
    let startS = '';
    if (parseInt(startT[0]) > 12) {
        startT[0] = (parseInt(startT[0]) - 12).toString();
        startS = startT.join(':') + ' PM';
    }
    else if (parseInt(startT[0]) === 12) {
        startS = startT.join(':') + ' PM';
    }
    else {
        if (startT[0][0] === '0') {
            startT[0] = startT[0].substring(1);
        }
        startS = startT.join(':') + ' AM';
    }
    return startS;
};
const createSearchOBJ = (body) => {
    let start = convertTime(body.startTime);
    let end = convertTime(body.endTime);
    let obj = {
        p01: body.courses,
        p02: moment_1.default(body.date).format('MM/DD/YYYY'),
        p03: start,
        p04: end,
        p05: 0,
        p06: body.max,
        p07: false, //false
    };
    return obj;
};
exports.createSearchOBJ = createSearchOBJ;
//# sourceMappingURL=search.js.map