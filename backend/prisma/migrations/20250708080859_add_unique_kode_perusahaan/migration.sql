/*
  Warnings:

  - A unique constraint covering the columns `[kode,batch,no_urut]` on the table `KodePerusahaan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `KodePerusahaan_kode_batch_no_urut_key` ON `KodePerusahaan`(`kode`, `batch`, `no_urut`);
