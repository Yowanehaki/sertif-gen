/*
  Warnings:

  - You are about to drop the `aktivitas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `aktivitas`;

-- CreateTable
CREATE TABLE `KodePerusahaan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_aktivitas` VARCHAR(191) NOT NULL,
    `kode_aktivitas` VARCHAR(191) NOT NULL,
    `batch` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
