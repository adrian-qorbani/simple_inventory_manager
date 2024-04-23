import { FastifyInstance } from "fastify";
import {
  getAllCategories,
  createCategory,
  updateCategoryCounter,
} from "../controllers/inventoryController";

export default function categoryRoutes(server: FastifyInstance) {
  // Get all categories
  server.get("/", getAllCategories);

  // Create a new category
  server.post("/", createCategory);

  // Update category counter
  server.post("/update-category", updateCategoryCounter);
}
