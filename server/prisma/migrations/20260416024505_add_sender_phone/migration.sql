/*
  Warnings:

  - Added the required column `senderPhone` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "senderPhone" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");
