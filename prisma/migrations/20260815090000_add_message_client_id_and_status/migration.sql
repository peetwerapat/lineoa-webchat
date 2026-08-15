-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "client_id" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'SENT';

-- CreateIndex
CREATE UNIQUE INDEX "messages_client_id_key" ON "messages"("client_id");