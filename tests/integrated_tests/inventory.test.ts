// NOTE: tests updated to use jwt authentication
// NOTE: make sure containers are up and running when running the tests
// importing mocha and chai for testing
import { expect } from "chai";
import { describe, it, beforeEach, after } from "mocha";
// supertest for testing HTTP server
import supertest from "supertest";
import fastify from "fastify";
// testing routes
import inventoryRoutes from "../../src/routes/inventoryRoutes";
import authRoutes from "../../src/routes/authRoutes";
import { PrismaClient } from "@prisma/client";

const app = fastify();

inventoryRoutes(app);
authRoutes(app);

const agent = supertest.agent(app.server);

const prisma = new PrismaClient();

// Helper: JWT token
async function getToken() {
  const response = await agent.post("/auth").send({});
  return response.body.token;
}

describe("POST /", () => {
  beforeEach(async () => {
    await prisma.category.deleteMany(); // Database cleanup before each test.
  });

  it("Should create a new category with counter set to zero (database default)", async () => {
    // get JWT token
    const token = await getToken();

    // POST request to create a new category with token in Authorization header
    const createResponse = await agent
      .post("/")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "categoryTest" });

    // Verify request is successful
    expect(createResponse.status).to.equal(200);

    // GET request to retrieve all categories
    const getResponse = await agent.get("/");

    // Verify response contains an array with the newly created category inside
    expect(getResponse.status).to.equal(200);
    expect(getResponse.body).to.be.an("array").that.is.not.empty;
    const createdCategory = getResponse.body.find(
      (category: any) => category.name === "categoryTest"
    );
    expect(createdCategory).to.exist;
    // default counter = 0 is given upon entry to database
    expect(createdCategory.counter).to.equal(0);
  });

  it("Should update the counter of an existing category", async () => {
    // Obtain JWT token
    const token = await getToken();

    // Send a POST request to create a new category with token in Authorization header
    const createResponse = await agent
      .post("/update-category")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "categoryTest" });

    // Verify that the request is successful
    expect(createResponse.status).to.equal(200);

    // Send a POST request to update the counter with token in Authorization header
    const updateResponse = await agent
      .post("/categoryTest")
      .set("Authorization", `Bearer ${token}`)
      .send({ categoryName: "categoryTest", action: "increase", amount: 100 });

    // Verify that the request is successful
    expect(updateResponse.status).to.equal(200);

    // Send a GET request to retrieve the updated category
    const getResponse = await agent.get("/");

    // Verify that the response contains the updated category with the correct counter value
    expect(getResponse.status).to.equal(200);
    expect(getResponse.body).to.be.an("array").that.is.not.empty;
    const updatedCategory = getResponse.body.find(
      (category: any) => category.name === "categoryTest"
    );
    expect(updatedCategory).to.exist;
    expect(updatedCategory.counter).to.equal(100);
  });
});

after(async () => {
  await prisma.$disconnect();
  await app.close();
});
