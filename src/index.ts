import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const server = fastify();

server.get("/", async function (request, reply) {
  try {
    // Fetch all categories
    const categories = await prisma.category.findMany({
      select: {
        name: true,
        counter: true,
      },
    });

    // JSON response
    reply.send(categories);
  } catch (error) {
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

server.post("/", async function (request, reply) {
  try {
    const { name } = request.body as { name: string };

    // Create a new category NOTE: default value is 0 for their counter
    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });
    reply.status(201).send(newCategory);
  } catch (error) {
    // Handle errors
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

server.post("/update-category", async function (request, reply) {
  try {
    const { categoryName, action, amount } = request.body as {
      categoryName: string;
      action: "increase" | "decrease";
      amount: number;
    };

    // Find the category in the database, retrieve its ID
    const category = await prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!category) {
      return reply.status(404).send({ error: "Category not found" });
    }

    // Update the category counter according action and amount
    let newCounterValue;
    if (action === "increase") {
      newCounterValue = (category.counter ?? 0) + amount;
    } else if (action === "decrease") {
      newCounterValue = Math.max(0, (category.counter ?? 0) - amount);
    } else {
      return reply.status(400).send({ error: "Invalid action" });
    }

    // Update the category with the new counter value
    await prisma.category.update({
      where: { id: category.id },
      data: { counter: newCounterValue },
    });

    reply.send({ message: "Counter updated successfully", newCounterValue });
  } catch (error) {
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

server.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
