"use strict";
/**
 * Badge Model
 * Defines the structure and types for the gamification badge system
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirementType = exports.BadgeType = void 0;
var BadgeType;
(function (BadgeType) {
    BadgeType["STREAK"] = "streak";
    BadgeType["MILESTONE"] = "milestone";
    BadgeType["SPECIAL"] = "special";
    BadgeType["CATEGORY"] = "category";
})(BadgeType || (exports.BadgeType = BadgeType = {}));
var RequirementType;
(function (RequirementType) {
    RequirementType["ACTIONS_COUNT"] = "actions_count";
    RequirementType["STREAK_DAYS"] = "streak_days";
    RequirementType["GROUP_JOIN"] = "group_join";
    RequirementType["CATEGORY_COUNT"] = "category_count";
    RequirementType["SPECIAL_EVENT"] = "special_event";
})(RequirementType || (exports.RequirementType = RequirementType = {}));
