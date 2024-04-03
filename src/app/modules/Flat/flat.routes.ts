import express from "express";
import auth from "../../middlewares/auth";
import { flatControllers } from "./flat.controller";
import validateRequest from "../../middlewares/validateRequest";
import { flatValidationSchemas } from "./flat.validation";

const router = express.Router();

router.post(
  "/flats",
  auth(),
  validateRequest(flatValidationSchemas.createFlatSchema),
  flatControllers.createFlat
);

export const flatRoutes = router;
