-- AlterTable
ALTER TABLE "searches" ALTER COLUMN "searchRequest" DROP NOT NULL,
ALTER COLUMN "searchResponse" DROP NOT NULL,
ALTER COLUMN "reservationRequest" DROP NOT NULL,
ALTER COLUMN "reservationResponse" DROP NOT NULL,
ALTER COLUMN "loginRequest" DROP NOT NULL,
ALTER COLUMN "loginResponse" DROP NOT NULL,
ALTER COLUMN "addRequest" DROP NOT NULL,
ALTER COLUMN "addResponse" DROP NOT NULL,
ALTER COLUMN "getAllItemsRequest" DROP NOT NULL,
ALTER COLUMN "getAllItemsResponse" DROP NOT NULL,
ALTER COLUMN "holdReservationRequest" DROP NOT NULL,
ALTER COLUMN "holdReservationResponse" DROP NOT NULL;
