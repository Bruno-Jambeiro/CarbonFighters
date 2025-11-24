"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const group_routes_1 = __importDefault(require("./routes/group.routes"));
const action_routes_1 = __importDefault(require("./routes/action.routes"));
const badge_routes_1 = __importDefault(require("./routes/badge.routes"));
const actions_routes_1 = __importDefault(require("./routes/actions.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables only if not in GitHub Actions test mode
if (process.env.NODE_ENV !== 'github-actions') {
    const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
    dotenv_1.default.config({ path: envFile, quiet: true });
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173'
}));
app.use(express_1.default.json());
// Routes
app.use('/auth', auth_routes_1.default);
app.use('/groups', group_routes_1.default);
app.use('/actions', action_routes_1.default);
app.use('/badges', badge_routes_1.default);
app.use('/actions', actions_routes_1.default);
app.use('/user', user_routes_1.default);
exports.default = app;
