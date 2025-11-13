import request from 'supertest';
import app from '../../src/app'; // Assumes app is exported from src/app.ts
import { dbRun, dbGet } from '../../src/services/db.service';

// Helper function to register and login a user, returning their token and ID
const setupUser = async (user: any) => {
    // Register the user
    await request(app)
        .post('/auth/register')
        .send(user);

    // Login the user to get a token
    const loginResponse = await request(app)
        .post('/auth/login')
        .send({
            email: user.email,
            password: user.password,
        });
    
    return {
        token: loginResponse.body.token,
        id: loginResponse.body.user.id
    };
};

describe('Groups Endpoints', () => {

    let userAlice: any = {
        firstName: "Alice",
        lastName: "Owner",
        cpf: "11111111111",
        email: "alice@email.com",
        password: "Strongpwd@1",
    };
    
    let userBob: any = {
        firstName: "Bob",
        lastName: "Joiner",
        cpf: "22222222222",
        email: "bob@email.com",
        password: "Strongpwd@2",
    };

    let aliceAuth: { token: string, id: number };
    let bobAuth: { token: string, id: number };

    // Before all tests, create and log in our test users
    beforeAll(async () => {
        aliceAuth = await setupUser(userAlice);
        bobAuth = await setupUser(userBob);
    });

    // Clean up database after tests
    afterAll(async () => {
        await dbRun('DELETE FROM group_members WHERE user_id = ? OR user_id = ?', [aliceAuth.id, bobAuth.id]);
        await dbRun('DELETE FROM groups WHERE owner_id = ?', [aliceAuth.id]);
        await dbRun('DELETE FROM users WHERE id = ? OR id = ?', [aliceAuth.id, bobAuth.id]);
    });

    let createdGroup: any = null;
    let inviteCode: string | null = null;

    // --- 1. Test POST /groups (Create Group) ---
    describe('POST /groups', () => {
        it('should fail to create a group without an auth token', async () => {
            const response = await request(app)
                .post('/groups')
                .send({ name: 'No Token Group' });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message', 'No token provided.');
        });

        it('should fail to create a group if name is missing', async () => {
            const response = await request(app)
                .post('/groups')
                .set('Authorization', `Bearer ${aliceAuth.token}`)
                .send({ name: '' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Group name is required.');
        });

        it('should create a new group successfully for an authenticated user', async () => {
            const groupName = "Alice's Eco-Warriors";
            const response = await request(app)
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
            const member = await dbGet('SELECT * FROM group_members WHERE user_id = ? AND group_id = ?', [
                aliceAuth.id,
                createdGroup.id
            ]) as { user_id: number; group_id: number };
            expect(member).toBeDefined();
            expect(member.user_id).toBe(aliceAuth.id);
        });
    });

    // --- 2. Test POST /groups/join (Join Group) ---
    describe('POST /groups/join', () => {
        it('should fail to join a group without an auth token', async () => {
            const response = await request(app)
                .post('/groups/join')
                .send({ inviteCode: inviteCode });
            
            expect(response.status).toBe(401);
        });

        it('should fail to join a group with an invalid invite code', async () => {
            const response = await request(app)
                .post('/groups/join')
                .set('Authorization', `Bearer ${bobAuth.token}`)
                .send({ inviteCode: 'invalidcode' });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Invalid invite code or group not found.');
        });

        it('should fail if the user is already a member (e.g., the owner)', async () => {
            // Alice (owner) tries to join her own group
            const response = await request(app)
                .post('/groups/join')
                .set('Authorization', `Bearer ${aliceAuth.token}`)
                .send({ inviteCode: inviteCode });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'You are already a member of this group.');
        });

        it('should allow a new user (Bob) to join the group successfully', async () => {
            // Bob (new user) joins Alice's group
            const response = await request(app)
                .post('/groups/join')
                .set('Authorization', `Bearer ${bobAuth.token}`)
                .send({ inviteCode: inviteCode });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message', 'Successfully joined group!');
            expect(response.body).toHaveProperty('membership');
            expect(response.body.membership.user_id).toBe(bobAuth.id);
            expect(response.body.membership.group_id).toBe(createdGroup.id);
        });
    });

    // --- 3. Test GET /groups/my-groups (List Groups) ---
    describe('GET /groups/my-groups', () => {
        it('should fail to get groups without an auth token', async () => {
            const response = await request(app).get('/groups/my-groups');
            expect(response.status).toBe(401);
        });

        it("should show Alice's group for Alice", async () => {
            const response = await request(app)
                .get('/groups/my-groups')
                .set('Authorization', `Bearer ${aliceAuth.token}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(1);
            expect(response.body[0].name).toBe(createdGroup.name);
        });

        it("should show Alice's group for Bob (who joined)", async () => {
            const response = await request(app)
                .get('/groups/my-groups')
                .set('Authorization', `Bearer ${bobAuth.token}`);

            expect(response.status).toBe(200);
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(1);
            expect(response.body[0].name).toBe(createdGroup.name);
        });
    });

});