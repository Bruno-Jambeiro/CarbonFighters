import request from 'supertest';
import app from '../../src/app';
import { dbRun } from '../../src/services/db.service';

/**
 * FEATURE: User Registration - Password Security
 * CRITERION: Boundary Value Analysis (BVA)
 * * Rationale: 
 * Passwords must be at least 8 characters long.
 * We test the boundary values (7 and 8) to ensure the validation
 * logic is precise at the limit.
 */

describe('Auth: Password Validation (BVA)', () => {
    // Base user data for testing
    const baseUser = {
        firstName: "BVA",
        lastName: "Tester",
        phone: "11900000000",
        birthday: "2000-01-01"
    };

    // Cleanup before running to avoid conflicts
    beforeAll(async () => {
        await dbRun("DELETE FROM users WHERE email LIKE 'bva_%'");
    });

    afterAll(async () => {
        await dbRun("DELETE FROM users WHERE email LIKE 'bva_%'");
    });

    it('should REJECT a password with 7 characters (Boundary - 1)', async () => {
        const res = await request(app).post('/auth/register').send({
            ...baseUser,
            cpf: "99999999901",
            email: "bva_invalid@test.com",
            password: "Pwd@123" // 7 chars
        });
        
        // Expecting 400 Bad Request due to validation failure
        expect(res.status).toBe(400);
        // Ideally, check for specific error message if API returns it
        // expect(res.body.error).toMatch(/at least 8 characters/);
    });

    it('should ACCEPT a password with 8 characters (Boundary)', async () => {
        const res = await request(app).post('/auth/register').send({
            ...baseUser,
            cpf: "99999999902",
            email: "bva_valid@test.com",
            password: "Pwd@1234" // 8 chars
        });

        // Expecting 201 Created
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
    });
});