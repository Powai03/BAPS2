-- CreateTable
CREATE TABLE `Modification` (
    `id` VARCHAR(191) NOT NULL,
    `utilisateurId` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NULL,
    `prenom` VARCHAR(191) NULL,
    `nomEntreprise` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `telephone` VARCHAR(191) NULL,
    `adresse` VARCHAR(191) NULL,
    `complementAdresse` VARCHAR(191) NULL,
    `codePostal` VARCHAR(191) NULL,
    `etatValidation` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Modification_utilisateurId_key`(`utilisateurId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Modification` ADD CONSTRAINT `Modification_id_fkey` FOREIGN KEY (`id`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
