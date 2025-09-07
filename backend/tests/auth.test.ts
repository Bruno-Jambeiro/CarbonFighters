// src/tests/auth.test.ts
import request from 'supertest';
import app from '../src/app'; // Import the configured app

describe('Auth Endpoints', () => {

  // Test case for successful user registration
  it('should register a new user successfully', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        full_name: "Test User",
        email: "user@email.com",
        phone: "+5500987654321",
        password: "Strongpwd@1",
        date_of_birth: "01/01/2000",
      });

    // Assertions: Check if the test passed
    expect(response.status).toBe(201); // 201 means "Created"
    expect(response.body).toHaveProperty('message', 'User registered successfully');
  });

  // Test case for successful login
  it('should log in an existing user and return a token', async () => {
    const userEmail = 'user@email.com';
    const userPassword = 'Strongpwd@1';

    // Step 1: Register a user to ensure the user exists
    await request(app)
      .post('/auth/register')
      .send({
        name: 'Login Test User',
        email: userEmail,
        password: userPassword,
      });

    // Step 2: Attempt to log in with the same credentials
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: userEmail,
        password: userPassword,
      });

    // Assertions
    expect(response.status).toBe(200); // 200 means "OK"
    expect(response.body).toHaveProperty('token'); // Check if a token is returned
  });

});