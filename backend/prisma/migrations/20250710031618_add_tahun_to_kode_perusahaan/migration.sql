/*
  Warnings:

  - A unique constraint covering the columns `[kode,batch,tahun,no_urut]` on the table `KodePerusahaan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tahun` to the `KodePerusahaan` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `KodePerusahaan_kode_batch_no_urut_key` ON `kodeperusahaan`;

-- AlterTable
ALTER TABLE `kodeperusahaan` ADD COLUMN `tahun` INTEGER;

-- Update existing data: set tahun based on tgl_submit from peserta table
UPDATE `kodeperusahaan` kp 
JOIN `peserta` p ON kp.id_sertif = p.id_sertif 
SET kp.tahun = YEAR(p.tgl_submit);

-- Make tahun NOT NULL after updating existing data
ALTER TABLE `kodeperusahaan` MODIFY COLUMN `tahun` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `KodePerusahaan_kode_batch_tahun_no_urut_key` ON `KodePerusahaan`(`kode`, `batch`, `tahun`, `no_urut`);
