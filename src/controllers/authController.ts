import { FastifyRequest, FastifyReply } from "fastify";
import { sign } from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default_key';

export const generateToken = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    // JWT generates token (also expiration is 1h)
    const token = sign({}, JWT_SECRET, { expiresIn: '1h' });
    reply.send({ token });
  } catch (error) {
    reply.code(500).send({ message: 'Token Generation Failed.' });
  }
};