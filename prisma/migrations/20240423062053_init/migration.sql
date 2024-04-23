-- CreateTable
CREATE TABLE "category" (
    "latitude" INTEGER,
    "longitude" INTEGER,
    "name" TEXT,
    "counter" INTEGER,
    "id" SERIAL NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);
