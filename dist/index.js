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
const express_1 = __importDefault(require("express"));
const tickets_1 = require("./models/tickets");
const user_1 = require("./models/user");
const startCheckingTickets_1 = require("./util/startCheckingTickets");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
const algorithm = 'aes-192-cbc';
const password = process.env.SECRET_KEY;
const app = express_1.default();
const handleEncrptGolfPassword = () => {
    crypto_1.default.scrypt(password, 'salt', 24, (err, key) => {
        if (err)
            throw err;
        // Then, we'll generate a random initialization vector
        crypto_1.default.randomFill(new Uint8Array(16), (err, iv) => {
            if (err)
                throw err;
            const cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
            let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return encrypted;
        });
    });
};
const PORT = process.env.PORT || 8000;
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    // res.setHeader('Access-Control-Allow-Credentials', 'false');
    next();
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
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
    let user = yield user_1.getUserByUsername(req.body.username);
    if (user) {
        res.status(502).json({ message: 'Email Already Exists' });
    }
    else if (!user) {
        bcrypt_1.default.hash(req.body.password, saltRounds, function (err, hash) {
            if (err) {
                res.status(500).json({ message: 'Error hashing password' });
            }
            else {
                crypto_1.default.scrypt(password, 'salt', 24, (err, key) => {
                    if (err)
                        throw err;
                    // Then, we'll generate a random initialization vector
                    crypto_1.default.randomFill(new Uint8Array(16), (err, iv) => __awaiter(this, void 0, void 0, function* () {
                        if (err)
                            throw err;
                        const cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
                        let encrypted = cipher.update(req.body.golferPassword, 'utf8', 'hex');
                        encrypted += cipher.final('hex');
                        user = yield user_1.createUser(req.body.username, hash, req.body.golferUsername, encrypted);
                        res.status(200).json(user);
                    }));
                });
            }
        });
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_1.getUserByUsername(req.body.username);
    if (user) {
        const match = yield bcrypt_1.default.compare(req.body.password, user.password);
        if (match) {
            res.status(200).json(user);
        }
        else {
            res.status(502).json({ message: 'Invalid Credentials' });
        }
    }
    else {
        res.status(502).json({ message: 'Invalid Credentials' });
    }
}));
app.post('/autoLogin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield user_1.getUserById(req.body.id);
    if (!user) {
        res.status(502).json({ message: 'No Users Found' });
    }
    else {
        const key = crypto_1.default.scryptSync(password, 'salt', 24);
        // The IV is usually passed along with the ciphertext.
        const iv = Buffer.alloc(16, 0); // Initialization vector.
        console.log(iv);
        const decipher = crypto_1.default.createDecipheriv(algorithm, key, iv);
        // Encrypted using same algorithm, key and iv.
        let decrypted = decipher.update(user.golferPassword, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        res.status(200).json({ user, decrypted });
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
app.post('/tickets/:id/cancel', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let ticket = yield tickets_1.cancelTicket(parseInt(req.params.id));
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