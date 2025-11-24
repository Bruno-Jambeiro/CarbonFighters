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
exports.groupService = void 0;
const db_service_1 = require("./db.service");
const nanoid_1 = require("nanoid");
const badgeService = __importStar(require("./badge.service"));
class GroupService {
    // Handles business logic for Groups.
    // Abstracts database interactions.
    /**
     * Validates group creation input
     * Throws descriptive errors if validation fails
     * @param name - Group name to validate
     * @param ownerId - User ID to validate
     * @throws Error if validation fails
     */
    validateGroupCreation(name, ownerId) {
        if (!name || name.trim().length === 0) {
            throw new Error('Group name is required.');
        }
        if (!ownerId) {
            throw new Error('User not authenticated.');
        }
    }
    /**
     * Validates group join input
     * Throws descriptive errors if validation fails
     * @param inviteCode - Invite code to validate
     * @param userId - User ID to validate
     * @throws Error if validation fails
     */
    validateGroupJoin(inviteCode, userId) {
        if (!inviteCode || inviteCode.trim().length === 0) {
            throw new Error('Invite code is required.');
        }
        if (!userId) {
            throw new Error('User not authenticated.');
        }
    }
    createGroup(name, ownerId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Creates a new group and automatically adds the creator as the first member.
            // This is executed as a transaction to ensure data integrity.
            // Validate inputs (business logic moved from controller)
            this.validateGroupCreation(name, ownerId);
            const inviteCode = (0, nanoid_1.nanoid)(8); // Generate an 8-character random invite code
            try {
                // Begin transaction
                yield (0, db_service_1.dbRun)('BEGIN TRANSACTION');
                // Create the group
                const groupStmt = yield (0, db_service_1.dbRun)('INSERT INTO groups (name, owner_id, invite_code) VALUES (?, ?, ?)', [name, ownerId, inviteCode]);
                const groupId = groupStmt.lastID;
                if (!groupId) {
                    throw new Error('Failed to create group, ID not returned.');
                }
                // Add the owner as the first member
                yield (0, db_service_1.dbRun)('INSERT INTO group_members (user_id, group_id) VALUES (?, ?)', [ownerId, groupId]);
                // Commit the transaction
                yield (0, db_service_1.dbRun)('COMMIT');
                // Return the newly created group to the controller
                const newGroup = yield this.findGroupById(groupId);
                if (!newGroup) {
                    throw new Error('Group was created but could not be found.');
                }
                return newGroup;
            }
            catch (error) {
                // If anything fails, undo all operations
                yield (0, db_service_1.dbRun)('ROLLBACK');
                console.error('Error creating group (transaction rolled back):', error);
                throw new Error('Could not create group.');
            }
        });
    }
    joinGroup(inviteCode, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Adds a user to a group using an invite code.
            // Validate inputs (business logic moved from controller)
            this.validateGroupJoin(inviteCode, userId);
            // Find the group by the invite code
            const group = yield this.findGroupByInviteCode(inviteCode);
            if (!group) {
                throw new Error('Invalid invite code or group not found.');
            }
            // Check if the user is already in the group
            const existingMember = yield (0, db_service_1.dbGet)('SELECT * FROM group_members WHERE user_id = ? AND group_id = ?', [userId, group.id]);
            if (existingMember) {
                throw new Error('You are already a member of this group.');
            }
            // Add the user to the group
            yield (0, db_service_1.dbRun)('INSERT INTO group_members (user_id, group_id) VALUES (?, ?)', [userId, group.id]);
            // Return the membership details
            const newMember = yield (0, db_service_1.dbGet)('SELECT * FROM group_members WHERE user_id = ? AND group_id = ?', [userId, group.id]);
            if (!newMember) {
                throw new Error('Failed to join group.');
            }
            // CA2: Verificar y otorgar badges automáticamente
            yield badgeService.checkAndAwardBadges(userId);
            return newMember;
        });
    }
    // Finds a group by its ID.
    findGroupById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield (0, db_service_1.dbGet)('SELECT * FROM groups WHERE id = ?', [id]);
            return group || null;
        });
    }
    //Finds a group by its invite code.
    findGroupByInviteCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield (0, db_service_1.dbGet)('SELECT * FROM groups WHERE invite_code = ?', [code]);
            return group || null;
        });
    }
    // Finds all groups a specific user is a member of.
    findGroupsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const groups = yield (0, db_service_1.dbAll)(`SELECT g.* FROM groups g
             JOIN group_members gm ON g.id = gm.group_id
             WHERE gm.user_id = ?`, [userId]);
            return groups;
        });
    }
}
// Export a single instance (Singleton pattern) of the service
exports.groupService = new GroupService();
