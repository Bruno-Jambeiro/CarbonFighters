import request from 'supertest';
import app from '../../src/app';

describe('Login Endpoint', () => {
    let exampleUser = {
        full_name: "Test User",
        email: "user@email.com",
        phone: "+5500987654321",
        password: "Strongpwd@1",
        date_of_birth: "01/01/2000",
    }

    // Test case for successful login
    it('should log in an existing user and return a token', async () => {

        // Step 1: Register a user to ensure the user exists
        await request(app)
            .post('/auth/register')
            .send(exampleUser);

        // Step 2: Attempt to log in with the same credentials
        const response = await request(app)
            .post('/auth/login')
            .send({
                email: exampleUser.email,
                password: exampleUser.password,
            });

        // Assertions
        expect(response.status).toBe(200); // 200 means "OK"
        expect(response.body).toHaveProperty('token'); // Check if a token is returned
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