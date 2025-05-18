-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('ANNUAL', 'CASUAL_SICK', 'LIEU');

-- CreateEnum
CREATE TYPE "LeaveDayPart" AS ENUM ('FULL_DAY', 'FIRST_HALF', 'SECOND_HALF');

-- AlterTable
ALTER TABLE "LeaveRequest" ADD COLUMN     "dayPart" "LeaveDayPart" NOT NULL DEFAULT 'FULL_DAY',
ADD COLUMN     "leaveType" "LeaveType" NOT NULL DEFAULT 'ANNUAL';
