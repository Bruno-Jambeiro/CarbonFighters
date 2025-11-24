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
exports.getAllBadges = getAllBadges;
exports.getMyBadges = getMyBadges;
exports.getMyNotifications = getMyNotifications;
exports.markNotificationRead = markNotificationRead;
exports.markAllNotificationsRead = markAllNotificationsRead;
const badgeService = __importStar(require("../services/badge.service"));
//Get all available badges
function getAllBadges(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const badges = yield badgeService.getAllBadges();
            return res.status(200).json({ badges });
        }
        catch (err) {
            console.error('Error fetching badges:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    });
}
//Get badges earned by the authenticated user
function getMyBadges(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            const badges = yield badgeService.getUserBadges(userId);
            return res.status(200).json({ badges, count: badges.length });
        }
        catch (err) {
            console.error('Error fetching user badges:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    });
}
// Get the user's notifications
function getMyNotifications(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            const unreadOnly = req.query.unread === 'true';
            const notifications = yield badgeService.getUserNotifications(userId, unreadOnly);
            const unreadCount = yield badgeService.getUnreadNotificationsCount(userId);
            return res.status(200).json({
                notifications,
                unreadCount
            });
        }
        catch (err) {
            console.error('Error fetching notifications:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    });
}
// Mark a notification as read
function markNotificationRead(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            const { id } = req.params;
            yield badgeService.markNotificationAsRead(parseInt(id), userId);
            return res.status(200).json({ message: 'Notification marked as read' });
        }
        catch (err) {
            console.error('Error marking notification as read:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    });
}
// Mark all notifications as read
function markAllNotificationsRead(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                return res.status(401).json({ error: 'User not authenticated' });
            }
            yield badgeService.markAllNotificationsAsRead(userId);
            return res.status(200).json({ message: 'All notifications marked as read' });
        }
        catch (err) {
            console.error('Error marking all notifications as read:', err);
            return res.status(500).json({ error: 'Server error' });
        }
    });
}
