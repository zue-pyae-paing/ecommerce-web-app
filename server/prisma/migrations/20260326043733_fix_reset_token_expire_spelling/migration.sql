/*
  Warnings:

  - You are about to drop the column `refreshTokenExpire` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "refreshTokenExpire",
ADD COLUMN     "resetTokenExpire" TIMESTAMP(3);
