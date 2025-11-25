import request from 'supertest';
import app from '../../src/app';
import { dbRun } from '../../src/services/db.service';

/**
 * FEATURE: Join Group - Business Logic
 * CRITERION: Decision Table (Cause-Effect)
 * * Rationale: 
 * Joining a group depends on multiple conditions (Token, Invite Code, Membership).
 * We map the combinations (Causes) to expected API responses (Effects).
 * * | Case | Token? | Invite? | Member? | Effect (Status) |
 * |------|--------|---------|---------|-----------------|
 * | 1    | No     | -       | -       | 401 Unauthorized|
 * | 2    | Yes    | No      | -       | 400 Bad Request |
 * | 3    | Yes    | Yes     | Yes     | 400 Bad Request |
 * | 4    | Yes    | Yes     | No      | 200 OK          |
 */

const setupUser = async (prefix: string) => {
    const user = { firstName: prefix, lastName: "User", cpf: `777${prefix}777`, email: `${prefix}@test.com`, password: "StrongPwd@1", phone: "11999999999", birthday: "2000-01-01" };
    await request(app).post('/auth/register').send(user);
    const login = await request(app).post('/auth/login').send({ email: user.email, password: user.password });
    return { token: login.body.token, id: login.body.user.id };
};

describe('Groups: Join Logic (Decision Table)', () => {
    let ownerAuth: { token: string, id: number };
    let newMemberAuth: { token: string, id: number };
    let validInviteCode: string;

    beforeAll(async () => {
        // Cleanup potential stale data
        await dbRun("DELETE FROM users WHERE email IN ('owner@test.com', 'new@test.com')");
        
        ownerAuth = await setupUser("owner");
        newMemberAuth = await setupUser("new");

        // Create a group to have a valid invite code
        const groupRes = await request(app)
            .post('/groups')
            .set('Authorization', `Bearer ${ownerAuth.token}`)
            .send({ name: "Decision Table Group" });
        validInviteCode = groupRes.body.invite_code;
    });

    afterAll(async () => {
        await dbRun('DELETE FROM group_members WHERE user_id IN (?, ?)', [ownerAuth.id, newMemberAuth.id]);
        await dbRun('DELETE FROM groups WHERE owner_id = ?', [ownerAuth.id]);
        await dbRun('DELETE FROM users WHERE id IN (?, ?)', [ownerAuth.id, newMemberAuth.id]);
    });

    // Case 1
    it('Case 1: Invalid Token -> 401 Unauthorized', async () => {
        const res = await request(app)
            .post('/groups/join')
            .send({ inviteCode: validInviteCode });
        expect(res.status).toBe(401);
    });

    // Case 2
    it('Case 2: Valid Token + Invalid Invite -> 400 Bad Request', async () => {
        const res = await request(app)
            .post('/groups/join')
            .set('Authorization', `Bearer ${newMemberAuth.token}`)
            .send({ inviteCode: "INVALID_CODE" });
        expect(res.status).toBe(400);
    });

    // Case 3 (Owner is already a member)
    it('Case 3: Valid Token + Valid Invite + Already Member -> 400 Bad Request', async () => {
        const res = await request(app)
            .post('/groups/join')
            .set('Authorization', `Bearer ${ownerAuth.token}`)
            .send({ inviteCode: validInviteCode });
        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/already a member/i);
    });

    // Case 4
    it('Case 4: Valid Token + Valid Invite + Not Member -> 200 OK', async () => {
        const res = await request(app)
            .post('/groups/join')
            .set('Authorization', `Bearer ${newMemberAuth.token}`)
            .send({ inviteCode: validInviteCode });
        expect(res.status).toBe(200);
    });
});