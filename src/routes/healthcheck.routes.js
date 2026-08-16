import {Router} from "express";
import { healthCheck } from "../controllers/healthcheck.controllers.js";
import { Upload } from "lucide-react-native";

const router = Router();
router.route("/").get( healthCheck);

export default router;