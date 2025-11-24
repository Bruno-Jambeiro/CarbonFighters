"use strict";
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
exports.groupController = void 0;
const group_service_1 = require("../services/group.service");
class GroupController {
    createGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Handle POST /groups
            // Creates a new group.
            var _a;
            try {
                const { name } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                // Call Service (validation is now handled in service layer)
                const newGroup = yield group_service_1.groupService.createGroup(name, userId);
                // Send Response
                res.status(201).json(newGroup);
            }
            catch (error) {
                console.error(error);
                const message = (error instanceof Error) ? error.message : 'An unknown error occurred.';
                // Handle validation errors (from service) with appropriate status codes
                if (message.includes('required') || message.includes('authenticated')) {
                    res.status(400).json({ message });
                }
                else {
                    res.status(500).json({ message: 'Error creating group.', error: message });
                }
            }
        });
    }
    joinGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Handle POST /groups/join
            // Joins a group using an invite code.
            var _a;
            try {
                const { inviteCode } = req.body;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                // Call Service (validation is now handled in service layer)
                const newMember = yield group_service_1.groupService.joinGroup(inviteCode, userId);
                // Send Response
                res.status(200).json({ message: 'Successfully joined group!', membership: newMember });
            }
            catch (error) {
                console.error(error);
                const message = (error instanceof Error) ? error.message : 'An unknown error occurred.';
                // Handle specific errors from the service with appropriate status codes
                if (message.includes('required') || message.includes('authenticated') ||
                    message.includes('Invalid invite code') || message.includes('already a member')) {
                    res.status(400).json({ message });
                }
                else {
                    res.status(500).json({ message: 'Error joining group.', error: message });
                }
            }
        });
    }
    getMyGroups(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Handle GET /groups/my-groups
            // Gets all groups for the currently logged-in user.
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(401).json({ message: 'User not authenticated.' });
                    return;
                }
                const groups = yield group_service_1.groupService.findGroupsByUserId(userId);
                res.status(200).json(groups);
            }
            catch (error) {
                console.error(error);
                const message = (error instanceof Error) ? error.message : 'An unknown error occurred.';
                res.status(500).json({ message: 'Error fetching groups.', error: message });
            }
        });
    }
}
exports.groupController = new GroupController();
