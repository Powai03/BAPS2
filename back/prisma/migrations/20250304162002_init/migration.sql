/*
  Warnings:

  - You are about to drop the `Entreprise` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Entreprise`;

-- CreateTable
CREATE TABLE `Utilisateur` (
    `id` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `numero` VARCHAR(191) NULL,
    `telephone` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NOT NULL,
    `siteWeb` VARCHAR(191) NULL,
    `role` ENUM('MICRO_ENTREPRISE', 'ENTREPRISE') NOT NULL,

    UNIQUE INDEX `Utilisateur_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
