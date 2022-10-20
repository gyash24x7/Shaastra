/*
  Warnings:

  - The primary key for the `Role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[role]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_RoleToUser"
    DROP CONSTRAINT "_RoleToUser_A_fkey";

-- AlterTable
ALTER TABLE "Role"
    DROP CONSTRAINT "Role_pkey",
    ADD COLUMN "id" TEXT NOT NULL,
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Role_role_key" ON "Role" ("role");

-- AddForeignKey
ALTER TABLE "_RoleToUser"
    ADD CONSTRAINT "_RoleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Role" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
