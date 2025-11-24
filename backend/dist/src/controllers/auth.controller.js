"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const bcrypt_1 = __importDefault(require("bcrypt"));
const userService = __importStar(require("../services/user.service"));
const validations_utils_1 = require("../utils/validations.utils");
const token_service_1 = require("../services/token.service");
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { firstName, lastName, cpf, email, phone, birthday, password } = req.body;
            // Basic validation
            if (!firstName || !lastName || !cpf || !password)
                return res.status(400).json({ error: "firstName, lastName, cpf and password are required", received: req.body });
            // Email validation (only if provided)
            if (email) {
                const emailError = (0, validations_utils_1.validateEmailFormat)(email);
                if (emailError) {
                    return res.status(400).json({ error: emailError });
                }
                // Check if email already exists
                const existingUserByEmail = yield userService.getUser(email);
                if (existingUserByEmail)
                    return res.status(400).json({ error: "Email already registered" });
            }
            // Check if CPF already exists
            const existingUserByCpf = yield userService.getUserByCpf(cpf);
            if (existingUserByCpf)
                return res.status(400).json({ error: "CPF already registered" });
            // Password strength validation
            const passwordErrors = (0, validations_utils_1.validatePasswordStrength)(password);
            if (passwordErrors.length > 0) {
                return res.status(400).json({ error: passwordErrors.join(', ') });
            }
            // Hash password with bcrypt
            const saltRounds = 7;
            const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
            // Create new user
            const newUser = yield userService.createUser({
                firstName,
                lastName,
                cpf,
                email,
                phone,
                birthday,
                password: hashedPassword,
            });
            // Respond with success
            return res.status(201).json({
                message: "User registered successfully",
                user: Object.assign(Object.assign({}, newUser), { password: undefined // Do not send the password hash back
                 }),
                token: (0, token_service_1.generateToken)({ id: newUser.id, email: newUser.email || newUser.cpf }),
            });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Server error" });
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { cpf, email, password } = req.body;
            // Basic validation - require either cpf or email
            if ((!cpf && !email) || !password)
                return res.status(400).json({ error: "CPF or Email and password are required" });
            // Find user by CPF or email
            let user;
            if (cpf) {
                user = yield userService.getUserByCpf(cpf);
            }
            else if (email) {
                user = yield userService.getUser(email);
            }
            if (!user)
                return res.status(401).json({ error: "Invalid credentials" });
            // Compare password
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch)
                return res.status(401).json({ error: "Invalid credentials" });
            // Respond with success
            return res.status(200).json({
                message: "Login successful",
                user: Object.assign(Object.assign({}, user), { password: undefined }),
                token: (0, token_service_1.generateToken)({ id: user.id, email: user.email || user.cpf }),
            });
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Server error" });
        }
    });
}
