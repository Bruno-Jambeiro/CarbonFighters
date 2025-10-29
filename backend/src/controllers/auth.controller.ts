import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import * as userService from '../services/user.service';
import { User } from '../models/user.model';
import { validatePasswordStrength, validateEmailFormat } from '../utils/validations.utils';
import { generateToken } from '../services/token.service';

type RegisterBody = Omit<User, 'id' | 'created_at'>;

export async function register(req: Request<{}, {}, RegisterBody>, res: Response) {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Basic validation
        if (!firstName || !lastName || !email || !password)
            return res.status(400).json({ error: "All fields are required", received: req.body });


        // Email validation
        const emailError = validateEmailFormat(email);
        if (emailError) {
            return res.status(400).json({ error: emailError });
        }

        // Check if email already exists
        const existingUser = await userService.getUser(email);
        if (existingUser)
            return res.status(400).json({ error: "Email already registered" });


        // Password strength validation
        const passwordErrors = validatePasswordStrength(password);
        if (passwordErrors.length > 0) {
            return res.status(400).json({ error: passwordErrors.join(', ') });
        }
        // Hash password with bcrypt
        const saltRounds = 7;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = await userService.createUser({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        // Respond with success
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                ...newUser,
                password: undefined // Do not send the password hash back
            },
            token: generateToken({ id: newUser!.id, email: newUser!.email }),
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password)
            return res.status(400).json({ error: "Email and password are required" });

        // Find user by email
        const user = await userService.getUser(email);
        if (!user)
            return res.status(401).json({ error: "Invalid email or password" });

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ error: "Invalid email or password" });

        // TODO Create JWT token

        // Respond with success
        return res.status(200).json({
            message: "Login successful",
            user,
            token: generateToken({ id: user.id, email: user.email }),
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error" });
    }
}
