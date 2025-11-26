import request from 'supertest';
import app from '../../src/app';
import { dbRun } from '../../src/services/db.service';

/**
 * FEATURE: Group Creation - Input Validation
 * CRITERION: Equivalence Partitioning (EP)
 * * Rationale: 
 * The "Group Name" input domain is partitioned into:
 * - Invalid Class: Empty/Missing values.
 * - Valid Class: Non-empty strings.
 * We select one representative from each class to verify behavior.
 */

// Helper to get a valid token
const getAuthToken = async () => {
    const user = { firstName: "EP", lastName: "User", cpf: "88888888888", email: "ep_user@test.com", password: "StrongPwd@1", phone: "11999999999", birthday: "2000-01-01" };
    await request(app).post('/auth/register').send(user);
    const login = await request(app).post('/auth/login').send({ email: user.email, password: user.password });
    return login.body.token;
};

describe('Groups: Input Validation (EP)', () => {
    let token: string;

    beforeAll(async () => {
        await dbRun("DELETE FROM users WHERE email = 'ep_user@test.com'");
        token = await getAuthToken();
    });

    afterAll(async () => {
        // Cleanup created data
        const userRes = await request(app).get('/auth/me').set('Authorization', `Bearer ${token}`);
        if (userRes.body.id) {
            await dbRun('DELETE FROM groups WHERE owner_id = ?', [userRes.body.id]);
            await dbRun('DELETE FROM users WHERE id = ?', [userRes.body.id]);
        }
    });

    it('should REJECT creation when name is empty (Invalid Partition)', async () => {
        const res = await request(app)
            .post('/groups')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: "" }); // Representative of Invalid Class

        expect(res.status).toBe(400);
    });

    it('should ACCEPT creation when name is valid (Valid Partition)', async () => {
        const res = await request(app)
            .post('/groups')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: "Valid EP Group" }); // Representative of Valid Class

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('invite_code');
    });
});