# Simple Inventory Manager

This repository contains a backend server for a simple inventory manager built with Fastify, PostgreSQL, and containerized with Docker.

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- Docker
- Docker Compose

## Getting Started

Follow these steps to set up the project locally:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/adrian-qorbani/simple_inventory_manager.git

2. **Run the containers using docker compose:**

   ```bash
   sudo docker compose up

3. **Server should up and running:**

   ```bash
   http://0.0.0.0:8080

4. **It should return an array of categories with their counter:**

   ```bash
   http://0.0.0.0:8080

5. **If it returns Internal Server Error, then schema is changed and a migration must be done :**

   ```bash
   sudo docker ps
   sudo docker exec -it [name_of_api_server] sh
   npx prisma migrate dev

5. **(Testing) For testing make sure containers are up and running and run the following command :**

   ```bash
   npm run test

Follow these steps to add or change inventory categories. You can Postman:

1. **Adding a new category (POST http://0.0.0.0:8080):**

   ```bash
   {"name":"your_category"}

1. **Changing quantity of a certain category by its name (POST http://0.0.0.0:8080/update-category):**

   ```bash
   {"name":"your_category","action":"increase/decrease","amount":100}

NOTE: `action` should either be `increase` or `decrease`. `amount` should be a positive integer.