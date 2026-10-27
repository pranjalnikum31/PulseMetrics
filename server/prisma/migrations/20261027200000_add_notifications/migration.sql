
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "Notification_companyId_fkey"
        FOREIGN KEY ("companyId")
        REFERENCES "Company"("id")
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE INDEX "Notification_companyId_isRead_createdAt_idx"
ON "Notification"("companyId", "isRead", "createdAt");
