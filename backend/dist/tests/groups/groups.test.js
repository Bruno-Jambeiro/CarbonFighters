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
const app_1 = __importDefault(require("../../src/app")); // Assumes app is exported from src/app.ts
const db_service_1 = require("../../src/services/db.service");
// Helper function to register and login a user, returning their token and ID
const setupUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    // Register the user
    yield (0, supertest_1.default)(app_1.default)
        .post('/auth/register')
        .send(user);
    // Login the user to get a token
    const loginResponse = yield (0, supertest_1.default)(app_1.default)
        .post('/auth/login')
        .send({
        email: user.email,
        password: user.password,
    });
    return {
        token: loginResponse.body.token,
        id: loginResponse.body.user.id
    };
});
describe('Groups Endpoints', () => {
    let userAlice = {
        firstName: "Alice",
        lastName: "Owner",
        cpf: "11111111111",
        email: "alice@email.com",
        password: "Strongpwd@1",
    };
    let userBob = {
        firstName: "Bob",
        lastName: "Joiner",
        cpf: "22222222222",
        email: "bob@email.com",
        password: "Strongpwd@2",
    };
    let aliceAuth;
    let bobAuth;
    // Before all tests, create and log in our test users
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        aliceAuth = yield setupUser(userAlice);
        bobAuth = yield setupUser(userBob);
    }));
    // Clean up database after tests
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, db_service_1.dbRun)('DELETE FROM group_members WHERE user_id = ? OR user_id = ?', [aliceAuth.id, bobAuth.id]);
        yield (0, db_service_1.dbRun)('DELETE FROM groups WHERE owner_id = ?', [aliceAuth.id]);
        yield (0, db_service_1.dbRun)('DELETE FROM users WHERE id = ? OR id = ?', [aliceAuth.id, bobAuth.id]);
    }));
    let createdGroup = null;
    let inviteCode = null;
    // --- 1. Test POST /groups (Create Group) ---
    describe('POST /groups', () => {
        it('should fail to create a group without an auth token', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/groups')
                .send({ name: 'No Token Group' });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'No token provided.');
        }));
        it('should fail to create a group if name is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/groups')
                .set('Authorization', `Bearer ${aliceAuth.token}`)
                .send({ name: '' });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Group name is required.');
        }));
        it('should create a new group successfully for an authenticated user', () => __awaiter(void 0, void 0, void 0, function* () {
            const groupName = "Alice's Eco-Warriors";
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/groups')
                .set('Authorization', `Bearer ${aliceAuth.token}`)
                .send({ name: groupName });
            // Check response
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('name', groupName);
            expect(response.body).toHaveProperty('owner_id', aliceAuth.id);
            expect(response.body).toHaveProperty('invite_code');
            // Save for later tests
            createdGroup = response.body;
            inviteCode = response.body.invite_code;
            // Check the database to confirm the owner is also a member
            const member = yield (0, db_service_1.dbGet)('SELECT * FROM group_members WHERE user_id = ? AND group_id = ?', [
                aliceAuth.id,
                createdGroup.id
            ]);
            expect(member).toBeDefined();
            expect(member.user_id).toBe(aliceAuth.id);
        }));
    });
    // --- 2. Test POST /groups/join (Join Group) ---
    describe('POST /groups/join', () => {
        it('should fail to join a group without an auth token', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/groups/join')
                .send({ inviteCode: inviteCode });
            expect(response.status).toBe(401);
        }));
        it('should fail to join a group with an invalid invite code', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/groups/join')
                .set('Authorization', `Bearer ${bobAuth.token}`)
                .send({ inviteCode: 'invalidcode' });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Invalid invite code or group not found.');
        }));
        it('should fail if the user is already a member (e.g., the owner)', () => __awaiter(void 0, void 0, void 0, function* () {
            // Alice (owner) tries to join her own group
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/groups/join')
                .set('Authorization', `Bearer ${aliceAuth.token}`)
                .send({ inviteCode: inviteCode });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'You are already a member of this group.');
        }));
        it('should allow a new user (Bob) to join the group successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            // Bob (new user) joins Alice's group
            const response = yield (0, supertest_1.default)(app_1.default)
                .post('/groups/join')
                .set('Authorization', `Bearer ${bobAuth.token}`)
                .send({ inviteCode: inviteCode });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Successfully joined group!');
            expect(response.body).toHaveProperty('membership');
            expect(response.body.membership.user_id).toBe(bobAuth.id);
            expect(response.body.membership.group_id).toBe(createdGroup.id);
        }));
    });
    // --- 3. Test GET /groups/my-groups (List Groups) ---
    describe('GET /groups/my-groups', () => {
        it('should fail to get groups without an auth token', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default).get('/groups/my-groups');
            expect(response.status).toBe(401);
        }));
        it("should show Alice's group for Alice", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/groups/my-groups')
                .set('Authorization', `Bearer ${aliceAuth.token}`);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(1);
            expect(response.body[0].name).toBe(createdGroup.name);
        }));
        it("should show Alice's group for Bob (who joined)", () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.default)
                .get('/groups/my-groups')
                .set('Authorization', `Bearer ${bobAuth.token}`);
            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(1);
            expect(response.body[0].name).toBe(createdGroup.name);
        }));
    });
});
