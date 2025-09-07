import request from 'supertest';
import app from '../../src/app';

describe('Register Endpoint', () => {
    let exampleUser = {
        full_name: "Test User",
        email: "user@email.com",
        phone: "+5500987654321",
        password: "Strongpwd@1",
        date_of_birth: "01/01/2000",
    }

    let weakPasswords = [
        ["St@1", "Password must be at least 8 characters long"],
        ["strongpwd@1", "Password must contain at least one uppercase letter"],
        ["STRONGPWD@1", "Password must contain at least one lowercase letter"],
        ["Strongpwd@", "Password must contain at least one digit"],
        ["Strongpwd1", "Password must contain at least one special character"],
    ]

    // Test case for successful user registration
    it('Should register a new user successfully', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send(exampleUser);

        // Assertions: Check if the test passed
        expect(response.status).toBe(201); // 201 means "Created"
        expect(response.body).toHaveProperty('message', 'User registered successfully');
    });

    it('Should not register a repeated email', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send(exampleUser);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Email already registered');
    });

    // Test cases for weak passwords
    for (const [index, [password, errorMessage]] of weakPasswords.entries()) {
        it(`Should fail for weak password: ${password}`, async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    ...exampleUser,
                    email: `user${index}@email.com`, // Ensure unique email for each test
                    password
                });

            // Assertions
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', errorMessage);
        });
    }

    // Test case for invalid email format
    const invalidEmails = [
        ["plainaddress", "Invalid email format"],
        ["@missingusername.com", "Invalid email format"],
        ["username@.com", "Invalid email format"],
        ["username@com", "Invalid email format"],
        ["username@domain..com", "Invalid email format"],
        ["username@domain,com", "Invalid email format"],
        ["username@domain@domain.com", "Invalid email format"],
        ["username@.domain.com", "Invalid email format"],
        ["username@domain..com", "Invalid email format"],
    ];

    for (const [index, [email, errorMessage]] of invalidEmails.entries()) {
        it(`Should fail for invalid email format: ${email}`, async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    ...exampleUser,
                    email,
                    password: `Strongpwd@${index}` // Ensure unique password for each test
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', errorMessage);
        });
    }

});
