import { FastifyRequest, FastifyReply } from "fastify";
import { PrismaClient } from "@prisma/client";
// importing types for controller
import { Category } from "../ts-types/category" 
// ajv schema validation
import { validateSchema } from '../tools/validator';
import { createCategorySchema, updateCategoryCounterSchema } from '../routes/__routesSchema';


// creating a new client
const prisma = new PrismaClient();


// Get all categories
export async function getAllCategories(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const categories: Category[] = await prisma.category.findMany({
      select: {
        name: true,
        counter: true,
      },
    });
    reply.send(categories);
  } catch (error) {
    reply.status(500).send({ error: "Internal Server Error" });
  }
}

// Create a new category
export async function createCategory(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const isValid = validateSchema(createCategorySchema, request.body);
    if (!isValid) {
      return reply.status(400).send({ error: 'Invalid request body' });
    }

    const { name } = request.body as { name: string };
    const newCategory: Category = await prisma.category.create({
      data: { name },
    });
    reply.status(201).send(newCategory);
  } catch (error) {
    reply.status(500).send({ error: 'Internal Server Error' });
  }
}

// Update category counter
export async function updateCategoryCounter(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const isValid = validateSchema(updateCategoryCounterSchema, request.body);
    if (!isValid) {
      return reply.status(400).send({ error: 'Invalid request body' });
    }

    const { categoryName, action, amount } = request.body as {
      categoryName: string;
      action: 'increase' | 'decrease';
      amount: number;
    };

    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!category) {
      return reply.status(404).send({ error: 'Category not found' });
    }

    let newCounterValue;
    if (action === 'increase') {
      newCounterValue = (category.counter ?? 0) + amount;
    } else if (action === 'decrease') {
      newCounterValue = Math.max(0, (category.counter ?? 0) - amount);
    } else {
      return reply.status(400).send({ error: 'Invalid action' });
    }

    await prisma.category.update({
      where: { id: category.id },
      data: { counter: newCounterValue },
    });

    reply.send({ message: 'Counter updated successfully', newCounterValue });
  } catch (error) {
    reply.status(500).send({ error: 'Internal Server Error' });
  }
}