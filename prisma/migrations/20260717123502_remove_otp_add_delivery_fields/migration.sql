/*
  Warnings:

  - You are about to drop the column `otpAttempts` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `otpVerified` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Otp` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OtpBlockedNumber` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `commune` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "otpAttempts",
DROP COLUMN "otpVerified",
ADD COLUMN     "commune" TEXT NOT NULL,
ADD COLUMN     "yalidineLabelUrl" TEXT,
ADD COLUMN     "yalidineTracking" TEXT;

-- DropTable
DROP TABLE "Otp";

-- DropTable
DROP TABLE "OtpBlockedNumber";
