import { FastifyInstance } from "fastify";
import { generateToken } from "../controllers/authController";

export default function authRoutes(server: FastifyInstance) {
  server.post("/auth", generateToken);
}
