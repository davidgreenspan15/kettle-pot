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
exports.password = exports.username = void 0;
const express_1 = __importDefault(require("express"));
const tickets_1 = require("./models/tickets");
const user_1 = require("./models/user");
const startCheckingTickets_1 = require("./util/startCheckingTickets");
const app = express_1.default();
const PORT = process.env.PORT || 8000;
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', '*'); // update to match the domain you will make the request from
    res.header('Access-Control-Allow-Headers', '*');
    next();
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
exports.username = process.env.USERNAME;
exports.password = process.env.PASSWORD;
// SEARCH REQUEST
// let task = cron.schedule('*/2 * * * *', async () => {
//   try {
//     await handleSearch();
//   } catch (err) {
//     console.log(err);
//   }
// });
// task.start();
app.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield Promise.resolve(startCheckingTickets_1.handleSearch());
        res.json({
            response,
        });
    }
    catch (err) {
        res.status(500).json({ message: 'Error Running search' });
    }
}));
app.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_1.getUserByEmail(req.body.email);
    if (user) {
        res.status(502).json({ message: 'Email Already Exists' });
    }
    else if (!user) {
        user = yield user_1.createUser(req.body.name, req.body.email);
        res.status(200).json(user);
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_1.getUserByEmail(req.body.email);
    if (!user || (user && req.body.name !== user.name)) {
        res.status(502).json({ message: 'Invalid Credentials' });
    }
    else {
        res.status(200).json(user);
    }
}));
app.post('/autoLogin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_1.getUserById(req.body.id);
    if (!user) {
        res.status(502).json({ message: 'No Users Found' });
    }
    else {
        res.status(200).json(user);
    }
}));
app.post('/tickets', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let ticket = yield tickets_1.createTicket(req.body);
        res.status(200).json(ticket);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}));
app.post('/tickets/:uuid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.params.uuid;
    try {
        let tickets = yield tickets_1.getTickets(req.params.uuid);
        res.status(200).json(tickets);
    }
    catch (err) {
        res.status(500).json({ message: err });
    }
}));
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map