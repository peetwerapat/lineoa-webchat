-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "line_user_id" TEXT NOT NULL,
    "display_name" TEXT,
    "picture_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "line_message_id" TEXT,
    "direction" TEXT NOT NULL,
    "message_type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "payload" JSONB,
    "sent_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_line_user_id_key" ON "customers"("line_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "messages_line_message_id_key" ON "messages"("line_message_id");

-- CreateIndex
CREATE INDEX "messages_customer_id_created_at_idx" ON "messages"("customer_id", "created_at");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
