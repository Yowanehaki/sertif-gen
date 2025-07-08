/*
  Warnings:

  - A unique constraint covering the columns `[kode]` on the table `Aktivitas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Aktivitas_kode_key` ON `Aktivitas`(`kode`);
