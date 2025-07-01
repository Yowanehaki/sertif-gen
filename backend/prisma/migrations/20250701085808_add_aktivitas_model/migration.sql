/*
  Warnings:

  - The primary key for the `dashboard` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `dashboard` DROP PRIMARY KEY,
    MODIFY `id_sertif` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id_sertif`);

-- CreateTable
CREATE TABLE `Aktivitas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `kode_perusahaan` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Aktivitas_nama_key`(`nama`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
