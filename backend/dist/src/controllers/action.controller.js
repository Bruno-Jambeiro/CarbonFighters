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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAction = logAction;
exports.getMyActions = getMyActions;
exports.getMyStats = getMyStats;
const actionService = __importStar(require("../services/action.service"));
// Creates a new sustainable action
function logAction(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            const { action_type, description, carbon_saved, points } = req.body;
            // Basic validations
            if (!action_type || !description) {
                return res.status(400).json({
                    error: 'action_type and description are required'
                });
            }
            // Validate action type
            const validTypes = ['transport', 'recycling', 'water', 'energy', 'food', 'other'];
            if (!validTypes.includes(action_type)) {
                return res.status(400).json({
                    error: `Invalid action_type. Must be one of: ${validTypes.join(', ')}`
                });
            }
            // Create the action
            const action = yield actionService.createAction(userId, action_type, description, carbon_saved || 0, points || 10);
            if (!action) {
                return res.status(500).json({ error: 'Failed to create action' });
            }
            // Get updated statistics
            const stats = yield actionService.getUserActionStats(userId);
            return res.status(201).json({
                message: 'Action logged successfully',
                action,
                stats
            });
        }
        catch (err) {
            console.error('Error logging action:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    });
}
// Gets all actions of the authenticated user
function getMyActions(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            const actions = yield actionService.getUserActions(userId);
            return res.status(200).json({
                actions,
                count: actions.length
            });
        }
        catch (err) {
            console.error('Error fetching actions:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    });
}
// Gets the authenticated user's statistics
// AC2: The user's main dashboard must visually display the current streak count
function getMyStats(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            const stats = yield actionService.getUserActionStats(userId);
            return res.status(200).json(stats);
        }
        catch (err) {
            console.error('Error fetching stats:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    });
}
