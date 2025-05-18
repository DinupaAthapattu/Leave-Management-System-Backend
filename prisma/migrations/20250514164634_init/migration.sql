/*
  Warnings:

  - You are about to drop the column `condition` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateRange` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeId` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EMPLOYEE');

-- DropForeignKey
ALTER TABLE "LeaveRequest" DROP CONSTRAINT "LeaveRequest_userId_fkey";

-- AlterTable
ALTER TABLE "LeaveRequest" DROP COLUMN "condition",
DROP COLUMN "endDate",
DROP COLUMN "startDate",
DROP COLUMN "type",
DROP COLUMN "userId",
ADD COLUMN     "dateRange" TEXT NOT NULL,
ADD COLUMN     "employeeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'EMPLOYEE';

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
