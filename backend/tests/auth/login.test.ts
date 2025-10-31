import request from 'supertest';
import app from '../../src/app';
import { verifyToken } from '../../src/services/token.service';

describe('Login Endpoint', () => {
    let exampleUser = {
        firstName: "Test",
        lastName: "User",
        email: "user@email.com",
        password: "Strongpwd@1",
    }

    beforeAll(async () => {
        // Register a user to ensure the user exists
        let createdUser = await request(app)
            .post('/auth/register')
            .send(exampleUser);
    })

    // Test case for successful login
    it('should log in an existing user and return a token', async () => {
        // Attempt to log in with the same credentials
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: exampleUser.email,
                password: exampleUser.password,
            });

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');

        let token = response.body.token;
        expect(verifyToken(token)).toHaveProperty('email', exampleUser.email);
    });

    // Test case for invalid login
    it('should fail to log in with incorrect credentials', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: exampleUser.email,
                password: "WrongPassword@1",
            });
        expect(response.status).toBe(401); // 401 means "Unauthorized"
        expect(response.body).toHaveProperty('error', 'Invalid email or password');
    });

    // Test case for non-existent user
    it('should fail to log in with incorrect credentials', async () => {
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: "wronguser@email.com",
                password: exampleUser.password,
            });
        expect(response.status).toBe(401); // 401 means "Unauthorized"
        expect(response.body).toHaveProperty('error', 'Invalid email or password');
    });
});