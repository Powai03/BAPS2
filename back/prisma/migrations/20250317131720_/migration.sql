/*
  Warnings:

  - The values [MICRO_ENTREPRISE] on the enum `Utilisateur_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Utilisateur` MODIFY `role` ENUM('AUTO_ENTREPRENEUR', 'ENTREPRISE', 'ADMIN') NOT NULL;
