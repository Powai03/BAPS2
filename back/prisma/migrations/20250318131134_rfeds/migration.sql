/*
  Warnings:

  - You are about to drop the column `description` on the `Modification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Modification` DROP COLUMN `description`;

-- AlterTable
ALTER TABLE `Utilisateur` MODIFY `description` TEXT NULL;
