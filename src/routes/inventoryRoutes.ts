import { FastifyInstance } from "fastify";
import { authenticateToken } from "../tools/middleware";
import {
  getAllCategories,
  createCategory,
  updateCategoryCounter,
} from "../controllers/inventoryController";

export default function categoryRoutes(server: FastifyInstance) {
  // Get all categories
  server.get("/", getAllCategories);

  // Create a new category with token authentication
  server.post("/", { preHandler: authenticateToken }, createCategory);

  // Update category counter with token authentication
  server.post("/update-category", { preHandler: authenticateToken }, updateCategoryCounter);
}