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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.actionsController = void 0;
const actions_services_1 = require("../services/actions.services");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class ActionsController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId)
                    return res.status(401).json({ error: 'Unauthorized' });
                // Check if file was uploaded
                if (!req.file) {
                    return res.status(400).json({ error: 'Image file is required' });
                }
                const { activity_type, activity_title, activity_description, activity_date } = req.body;
                // Validate required fields
                if (!activity_type || typeof activity_type !== 'string') {
                    return res.status(400).json({ error: 'activity_type is required and must be a string' });
                }
                if (!activity_title || typeof activity_title !== 'string') {
                    return res.status(400).json({ error: 'activity_title is required and must be a string' });
                }
                if (!activity_description || typeof activity_description !== 'string') {
                    return res.status(400).json({ error: 'activity_description is required and must be a string' });
                }
                if (!activity_date) {
                    return res.status(400).json({ error: 'activity_date is required' });
                }
                // Store relative path to the image
                const imagePath = req.file.filename;
                const created = yield actions_services_1.actionsService.create(userId, {
                    activity_type,
                    activity_title,
                    activity_description,
                    activity_date,
                    imagem_path: imagePath
                });
                return res.status(201).json(created);
            }
            catch (err) {
                console.error('Error creating action', err);
                // Clean up uploaded file if there was an error
                if (req.file) {
                    fs_1.default.unlink(req.file.path, (unlinkErr) => {
                        if (unlinkErr)
                            console.error('Error deleting file:', unlinkErr);
                    });
                }
                return res.status(500).json({ error: 'Server error' });
            }
        });
    }
    myActions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId)
                    return res.status(401).json({ error: 'Unauthorized' });
                const actions = yield actions_services_1.actionsService.listByUser(userId);
                // Convert image paths to base64 for frontend compatibility
                const actionsWithBase64 = actions.map(action => {
                    try {
                        const imagePath = path_1.default.join(__dirname, '..', '..', 'data', 'images', action.imagem_path);
                        if (fs_1.default.existsSync(imagePath)) {
                            const imageBuffer = fs_1.default.readFileSync(imagePath);
                            const base64Image = imageBuffer.toString('base64');
                            return Object.assign(Object.assign({}, action), { image: base64Image, validated: action.validated_by !== null && action.validated_by !== undefined });
                        }
                        return Object.assign(Object.assign({}, action), { image: '', validated: action.validated_by !== null && action.validated_by !== undefined });
                    }
                    catch (err) {
                        console.error('Error reading image:', err);
                        return Object.assign(Object.assign({}, action), { image: '', validated: action.validated_by !== null && action.validated_by !== undefined });
                    }
                });
                return res.status(200).json(actionsWithBase64);
            }
            catch (err) {
                console.error('Error listing actions', err);
                return res.status(500).json({ error: 'Server error' });
            }
        });
    }
}
exports.actionsController = new ActionsController();
