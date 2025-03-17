-- AlterTable
ALTER TABLE `Utilisateur` ADD COLUMN `codePostal` VARCHAR(191) NOT NULL DEFAULT '00000',
    ADD COLUMN `complementAdresse` VARCHAR(191) NULL,
    ADD COLUMN `domaineActivite` VARCHAR(191) NOT NULL DEFAULT 'Inconnu',
    ADD COLUMN `justificatif` VARCHAR(191) NULL,
    ADD COLUMN `pieceIdentite` VARCHAR(191) NULL,
    ADD COLUMN `profession` VARCHAR(191) NOT NULL DEFAULT 'Inconnu',
    ADD COLUMN `typeCompte` VARCHAR(191) NOT NULL DEFAULT 'auto-entrepreneur',
    ADD COLUMN `typeInscription` VARCHAR(191) NOT NULL DEFAULT 'CESU',
    MODIFY `adresse` VARCHAR(191) NOT NULL DEFAULT 'Inconnu';
