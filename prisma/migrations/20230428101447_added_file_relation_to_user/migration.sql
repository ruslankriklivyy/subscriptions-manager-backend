/*
  Warnings:

  - You are about to drop the column `subscriptionId` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[avatar_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `avatar_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" DROP COLUMN "subscriptionId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_avatar_id_key" ON "User"("avatar_id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
