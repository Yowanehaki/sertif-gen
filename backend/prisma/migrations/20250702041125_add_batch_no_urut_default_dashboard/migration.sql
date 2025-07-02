/*
  Warnings:

  - You are about to drop the column `batch` on the `aktivitas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `aktivitas` DROP COLUMN `batch`;

-- AlterTable
ALTER TABLE `dashboard` ADD COLUMN `batch` VARCHAR(191) NOT NULL DEFAULT '-',
    ADD COLUMN `no_urut` INTEGER NOT NULL DEFAULT 0;
