import request from 'supertest';
import app from '../../src/app';
import { verifyToken } from '../../src/services/token.service';

describe('Register Endpoint', () => {
    let exampleUser = {
        firstName: "Test",
        lastName: "User",
        cpf: "12345678901",
        email: "user@email.com",
        phone: "11999999999",
        birthday: "2000-01-15",
        password: "Strongpwd@1",
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
        expect(response.body).toHaveProperty('token');

        let token = response.body.token;
        expect(verifyToken(token)).toHaveProperty('email', exampleUser.email);
    });

    it('Should not register a repeated CPF', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                ...exampleUser,
                email: "different@email.com"
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'CPF already registered');
    });

    it('Should not register a repeated email', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                ...exampleUser,
                cpf: "98765432109"
            });

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
                    cpf: `1111111111${index}`, // Unique CPF for each test (11 digits)
                    email: `weakpwd${index}@email.com`, // Ensure unique email for each test
                    password
                });

            // Assertions
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', errorMessage);
        });
    }

    // Test case for invalid email format
    const invalidEmails = [
        "plainaddress",
        "@missingusername.com",
        "username@.com",
        "username@com",
        "username@domain..com",
        "username@domain,com",
        "username@domain@domain.com",
        "username@.domain.com",
        "username@domain..com",
    ];

    for (const [index, email] of invalidEmails.entries()) {
        it(`Should fail for invalid email format: ${email}`, async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    ...exampleUser,
                    cpf: `2222222222${index}`, // Unique CPF for each test (11 digits)
                    email,
                    password: `Strongpwd@${index}` // Ensure unique password for each test
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('error', "Invalid email format");
        });
    }

    // Test case for valid email format
    const validEmails = [
        "simple@example.com",
        "user.name@example.com",
        "user-name@example.com",
        "user+mailbox/department=shipping@example.com",
        "!#$%&'*+-/=?^_`{}|~@example.org",
        "much.more.unusual@dept.example.com",
        "user%example.com@example.org",
        "user.name+tag+sorting@example.com",
        "x@example.com",
        "example-indeed@strange-example.com",
    ];

    for (const [index, email] of validEmails.entries()) {
        it(`Should succeed for valid (even weird) email format: ${email}`, async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    ...exampleUser,
                    cpf: `3333333333${index}`, // Unique CPF for each test (11 digits)
                    email,
                    password: `Strongpwd@${index + 10}` // Ensure unique password for each test
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('message', 'User registered successfully');
            expect(response.body).toHaveProperty('token');
            let token = response.body.token;
            expect(verifyToken(token)).toHaveProperty('email', email);
        });
    }

});
