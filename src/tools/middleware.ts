// Authentication Middleware
import { FastifyRequest, FastifyReply } from "fastify";
import { verify } from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "default_key";

// Middleware to authenticate token
export const authenticateToken = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  // If the token is missing return proper msg
  if (!token) {
    reply.code(401).send({ message: "Authorization token is missing." });
    return;
  }

  try {
    // Verify the token
    verify(token, JWT_SECRET);
    return;
  } catch (error) {
    reply.code(401).send({ message: "Token is either invalid or expired." });
    return;
  }
};
