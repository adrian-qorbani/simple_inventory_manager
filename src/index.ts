import fastify from "fastify";
import inventoryRoutes from "./routes/inventoryRoutes";

const server = fastify();

// Register routes
inventoryRoutes(server);

// Start server
server.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
