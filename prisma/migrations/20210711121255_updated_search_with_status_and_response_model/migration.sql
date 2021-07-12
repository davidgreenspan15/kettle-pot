/*
  Warnings:

  - You are about to drop the column `addRequest` on the `searches` table. All the data in the column will be lost.
  - You are about to drop the column `addResponse` on the `searches` table. All the data in the column will be lost.
  - You are about to drop the column `getAllItemsRequest` on the `searches` table. All the data in the column will be lost.
  - You are about to drop the column `getAllItemsResponse` on the `searches` table. All the data in the column will be lost.
  - You are about to drop the column `holdReservationRequest` on the `searches` table. All the data in the column will be lost.
  - You are about to drop the column `holdReservationResponse` on the `searches` table. All the data in the column will be lost.
  - You are about to drop the column `loginRequest` on the `searches` table. All the data in the column will be lost.
  - You are about to drop the column `loginResponse` on the `searches` table. All the data in the column will be lost.
  - You are about to drop the column `reservationRequest` on the `searches` table. All the data in the column will be lost.
  - You are about to drop the column `reservationResponse` on the `searches` table. All the data in the column will be lost.
  - You are about to drop the column `searchRequest` on the `searches` table. All the data in the column will be lost.
  - You are about to drop the column `searchResponse` on the `searches` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "searches" DROP COLUMN "addRequest",
DROP COLUMN "addResponse",
DROP COLUMN "getAllItemsRequest",
DROP COLUMN "getAllItemsResponse",
DROP COLUMN "holdReservationRequest",
DROP COLUMN "holdReservationResponse",
DROP COLUMN "loginRequest",
DROP COLUMN "loginResponse",
DROP COLUMN "reservationRequest",
DROP COLUMN "reservationResponse",
DROP COLUMN "searchRequest",
DROP COLUMN "searchResponse",
ADD COLUMN     "comments" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT;

-- CreateTable
CREATE TABLE "responses" (
    "id" SERIAL NOT NULL,
    "ReservationName" TEXT NOT NULL,
    "Location" TEXT NOT NULL,
    "ScheduledTime" TEXT NOT NULL,
    "NumberOfPlayers" INTEGER NOT NULL,
    "ReservationFee" TEXT NOT NULL,
    "TotalPrice" TEXT NOT NULL,
    "CancellationDeadline" TEXT NOT NULL,
    "ConfirmationNumber" TEXT NOT NULL,
    "IsSuccessful" BOOLEAN NOT NULL,
    "StatusText" TEXT NOT NULL,
    "SponsorName" TEXT NOT NULL,
    "CourseName" TEXT NOT NULL,
    "City" TEXT NOT NULL,
    "State" TEXT NOT NULL,
    "Country" TEXT NOT NULL,
    "OrderID" TEXT NOT NULL,
    "Tax" TEXT NOT NULL,
    "SKU" TEXT NOT NULL,
    "ProductName" TEXT NOT NULL,
    "UnitPrice" TEXT NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "CaptainTeeTimeConflicts" BOOLEAN,
    "CaptainTeeTimeConflictsFound" BOOLEAN NOT NULL,
    "CaptainTeeTimeConflictMode" INTEGER NOT NULL,
    "PartnerTeeTimeConflicts" BOOLEAN,
    "PartnerTeeTimeConflictsFound" BOOLEAN NOT NULL,
    "PartnerTeeTimeConflictMode" INTEGER NOT NULL,
    "searchId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "responses_searchId_unique" ON "responses"("searchId");

-- AddForeignKey
ALTER TABLE "responses" ADD FOREIGN KEY ("searchId") REFERENCES "searches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
