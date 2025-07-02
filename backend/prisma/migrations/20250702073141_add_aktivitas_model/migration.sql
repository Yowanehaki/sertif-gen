/*
  Warnings:

  - You are about to drop the `dashboard` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `dashboard`;

-- CreateTable
CREATE TABLE `Peserta` (
    `id_sertif` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `aktivitas` VARCHAR(191) NOT NULL,
    `tgl_submit` DATETIME(3) NOT NULL,
    `nama_penguji` VARCHAR(191) NULL,
    `jabatan_penguji` VARCHAR(191) NULL,
    `tgl_terbit_sertif` DATETIME(3) NULL,
    `tandatangan` VARCHAR(191) NULL,
    `konfirmasi_hadir` BOOLEAN NOT NULL,

    PRIMARY KEY (`id_sertif`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KodePerusahaan` (
    `id_sertif` VARCHAR(191) NOT NULL,
    `kode` VARCHAR(191) NOT NULL,
    `batch` VARCHAR(191) NOT NULL,
    `no_urut` INTEGER NOT NULL,

    PRIMARY KEY (`id_sertif`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `KodePerusahaan` ADD CONSTRAINT `KodePerusahaan_id_sertif_fkey` FOREIGN KEY (`id_sertif`) REFERENCES `Peserta`(`id_sertif`) ON DELETE RESTRICT ON UPDATE CASCADE;
