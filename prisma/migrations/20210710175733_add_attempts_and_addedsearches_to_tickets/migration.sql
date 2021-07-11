/*
  Warnings:

  - You are about to drop the `responses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "responses" DROP CONSTRAINT "responses_ticketId_fkey";

-- AlterTable
ALTER TABLE "tickets" ADD COLUMN     "attempt" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "responses";

-- CreateTable
CREATE TABLE "searches" (
    "id" SERIAL NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "searchRequest" JSONB NOT NULL,
    "searchResponse" JSONB NOT NULL,
    "reservationRequest" JSONB NOT NULL,
    "reservationResponse" JSONB NOT NULL,
    "loginRequest" JSONB NOT NULL,
    "loginResponse" JSONB NOT NULL,
    "addRequest" JSONB NOT NULL,
    "addResponse" JSONB NOT NULL,
    "getAllItemsRequest" JSONB NOT NULL,
    "getAllItemsResponse" JSONB NOT NULL,
    "holdReservationRequest" JSONB NOT NULL,
    "holdReservationResponse" JSONB NOT NULL,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "searches" ADD FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
