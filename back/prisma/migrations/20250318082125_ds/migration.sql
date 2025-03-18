-- DropForeignKey
ALTER TABLE `Modification` DROP FOREIGN KEY `Modification_utilisateurId_fkey`;

-- DropIndex
DROP INDEX `Modification_utilisateurId_key` ON `Modification`;

-- AddForeignKey
ALTER TABLE `Modification` ADD CONSTRAINT `Modification_utilisateurId_fkey` FOREIGN KEY (`utilisateurId`) REFERENCES `Utilisateur`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
