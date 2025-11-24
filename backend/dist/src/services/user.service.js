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
exports.getAllUsers = getAllUsers;
exports.getUser = getUser;
exports.getUserByCpf = getUserByCpf;
exports.createUser = createUser;
const db_service_1 = require("./db.service");
function getAllUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        // Use dbAll and specify the return type
        const users = yield (0, db_service_1.dbAll)('SELECT * FROM users;');
        return users;
    });
}
function getUser(email) {
    return __awaiter(this, void 0, void 0, function* () {
        // Use dbGet and specify the return type
        const user = yield (0, db_service_1.dbGet)('SELECT * FROM users WHERE email = ?;', [email]);
        return user || null;
    });
}
function getUserByCpf(cpf) {
    return __awaiter(this, void 0, void 0, function* () {
        // Use dbGet
        const user = yield (0, db_service_1.dbGet)('SELECT * FROM users WHERE cpf = ?;', [cpf]);
        return user || null;
    });
}
function createUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Run the INSERT query
        const result = yield (0, db_service_1.dbRun)(`INSERT INTO users (firstName, lastName, cpf, email, phone, birthday, password) 
         VALUES (?, ?, ?, ?, ?, ?, ?);`, [user.firstName, user.lastName, user.cpf, user.email, user.phone, user.birthday, user.password]);
        // 2. Get the lastID from the result
        const newUserId = result.lastID;
        if (!newUserId) {
            return null;
        }
        // 3. Explicitly fetch the user we just created
        const newUser = yield (0, db_service_1.dbGet)('SELECT * FROM users WHERE id = ?;', [newUserId]);
        return newUser || null;
    });
}
