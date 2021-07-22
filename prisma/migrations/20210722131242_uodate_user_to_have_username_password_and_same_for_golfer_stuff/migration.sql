/*
  Warnings:

  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[golferUsername]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `golferPassword` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `golferUsername` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users.email_unique";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email",
DROP COLUMN "name",
ADD COLUMN     "golferPassword" VARCHAR(35) NOT NULL,
ADD COLUMN     "golferUsername" VARCHAR(65) NOT NULL,
ADD COLUMN     "password" VARCHAR(35) NOT NULL,
ADD COLUMN     "username" VARCHAR(65) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users.username_unique" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users.golferUsername_unique" ON "users"("golferUsername");
