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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const token_service_1 = require("../../src/services/token.service");
describe('Login Endpoint', () => {
    let exampleUser = {
        firstName: "Test",
        lastName: "User",
        cpf: "11122233344",
        email: "loginuser@email.com",
        phone: "11988887777",
        birthday: "1995-05-20",
        password: "Strongpwd@1",
    };
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Register a user to ensure the user exists for login tests
        let createdUser = yield (0, supertest_1.default)(app_1.default)
            .post('/auth/register')
            .send(exampleUser);
    }));
    // Test case for successful login
    it('should log in an existing user and return a token', () => __awaiter(void 0, void 0, void 0, function* () {
        // Attempt to log in with the same credentials
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({
            email: exampleUser.email,
            password: exampleUser.password,
        });
        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        let token = response.body.token;
        expect((0, token_service_1.verifyToken)(token)).toHaveProperty('email', exampleUser.email);
    }));
    // Test case for invalid login
    it('should fail to log in with incorrect credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({
            email: exampleUser.email,
            password: "WrongPassword@1",
        });
        expect(response.status).toBe(401); // 401 means "Unauthorized"
        expect(response.body).toHaveProperty('error', 'Invalid credentials');
    }));
    // Test case for non-existent user
    it('should fail to log in with incorrect credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({
            email: "wronguser@email.com",
            password: exampleUser.password,
        });
        expect(response.status).toBe(401); // 401 means "Unauthorized"
        expect(response.body).toHaveProperty('error', 'Invalid credentials');
    }));
});
