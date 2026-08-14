-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "last_read_at" TIMESTAMP(3),
ADD COLUMN     "unread_count" INTEGER NOT NULL DEFAULT 0;
