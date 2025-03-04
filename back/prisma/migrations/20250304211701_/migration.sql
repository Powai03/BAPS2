-- AlterTable
ALTER TABLE `Utilisateur` ADD COLUMN `etatCreation` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `etatModification` BOOLEAN NOT NULL DEFAULT false;
