-- CreateTable
CREATE TABLE `Dashboard` (
    `id_sertif` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `aktivitas` VARCHAR(191) NOT NULL,
    `tgl_submit` DATETIME(3) NOT NULL,
    `nama_penguji` VARCHAR(191) NULL,
    `jabatan_penguji` VARCHAR(191) NULL,
    `kode_perusahaan` VARCHAR(191) NOT NULL,
    `tgl_terbit_sertif` DATETIME(3) NULL,
    `tandatangan` VARCHAR(191) NULL,
    `konfirmasi_hadir` BOOLEAN NOT NULL,

    PRIMARY KEY (`id_sertif`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Admin_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
