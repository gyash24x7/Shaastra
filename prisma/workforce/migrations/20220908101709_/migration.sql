-- CreateEnum
CREATE TYPE "Department" AS ENUM ('WEBOPS', 'CONCEPT_AND_DESIGN', 'SPONSORSHIP_AND_PR', 'SHOWS_AND_EXHIBITIONS', 'EVOLVE', 'ENVISAGE', 'EVENTS_AND_WORKSHOPS', 'FINANCE', 'QMS', 'OPERATIONS_AND_INFRASTRUCTURE_PLANNING', 'PUBLICITY');

-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('COORD', 'HEAD', 'CORE', 'COCAS');

-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "rollNumber" TEXT NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'COORD',
    "departments" "Department"[],
    "profilePic" TEXT NOT NULL DEFAULT '',
    "coverPic" TEXT NOT NULL DEFAULT '',
    "mobile" TEXT NOT NULL,
    "upi" TEXT NOT NULL DEFAULT '',
    "enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" "Department" NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MemberToTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_key" ON "Member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_rollNumber_key" ON "Member"("rollNumber");

-- CreateIndex
CREATE UNIQUE INDEX "_MemberToTeam_AB_unique" ON "_MemberToTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_MemberToTeam_B_index" ON "_MemberToTeam"("B");

-- AddForeignKey
ALTER TABLE "_MemberToTeam" ADD CONSTRAINT "_MemberToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MemberToTeam" ADD CONSTRAINT "_MemberToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
