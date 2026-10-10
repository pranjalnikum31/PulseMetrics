ALTER TABLE "Company"
ADD COLUMN "razorpayCustomerId" TEXT,
ADD COLUMN "razorpaySubscriptionId" TEXT;

CREATE UNIQUE INDEX "Company_razorpayCustomerId_key"
ON "Company"("razorpayCustomerId");

CREATE UNIQUE INDEX "Company_razorpaySubscriptionId_key"
ON "Company"("razorpaySubscriptionId");