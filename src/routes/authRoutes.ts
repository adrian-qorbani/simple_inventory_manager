import { FastifyInstance } from "fastify";
import { generateToken } from "../controllers/authController";

export default function routes(server: FastifyInstance) {
  server.post("/auth", generateToken);
}
