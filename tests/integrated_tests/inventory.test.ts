// NOTE: make sure containers are up and running when running the tests
// importing mocha and chai for testing
import { expect } from "chai";
import { describe, it, beforeEach, after } from "mocha";
// supertest for testing HTTP server
import supertest from "supertest";
import fastify from "fastify";
// testing routes
import inventoryRoutes from "../../src/routes/inventoryRoutes";
import { PrismaClient } from "@prisma/client";

const app = fastify();

inventoryRoutes(app);

const agent = supertest.agent(app.server);

const prisma = new PrismaClient();

describe("POST /", () => {
  //   this will override and delete all existing data on database,
  //   since its a testing project and have no real life application, i didn't implant a separate database for testing.
  beforeEach(async () => {
    await prisma.category.deleteMany(); // Clean up database before each test
  });

  it("Should create a new category with counter set to zero (database default)", async () => {
    // POST request to create a new category
    const createResponse = await agent
      .post("/")
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
    // Send a POST request to create a new category
    const createResponse = await agent
      .post("/update-category")
      .send({ name: "categoryTest" });

    // Verify that the request is successful
    expect(createResponse.status).to.equal(200);

    // Send a POST request to update the counter
    const updateResponse = await agent
      .post("/categoryTest")
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
