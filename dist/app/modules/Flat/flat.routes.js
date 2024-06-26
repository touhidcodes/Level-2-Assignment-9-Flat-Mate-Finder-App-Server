"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const flat_controller_1 = require("./flat.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const flat_validation_1 = require("./flat.validation");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/flats", flat_controller_1.flatControllers.getFlats);
router.get("/flats/:flatId", flat_controller_1.flatControllers.getSingleFlat);
router.get("/my-flats", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), flat_controller_1.flatControllers.getMyFlats);
router.post("/flats", (0, auth_1.default)(client_1.UserRole.USER, client_1.UserRole.ADMIN), (0, validateRequest_1.default)(flat_validation_1.flatValidationSchemas.createFlatSchema), flat_controller_1.flatControllers.createFlat);
router.put("/flats/:flatId", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), (0, validateRequest_1.default)(flat_validation_1.flatValidationSchemas.updateFlatSchema), flat_controller_1.flatControllers.updateFlat);
router.delete("/flats/:flatId", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.USER), flat_controller_1.flatControllers.deleteFlat);
exports.flatRoutes = router;
