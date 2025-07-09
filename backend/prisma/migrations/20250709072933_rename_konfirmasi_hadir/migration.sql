/*
  Warnings:

  - You are about to drop the column `konfirmasi_hadir` on the `peserta` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `peserta` DROP COLUMN `konfirmasi_hadir`,
    ADD COLUMN `verifikasi` BOOLEAN NULL;
