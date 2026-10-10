ALTER TABLE "Company"
ADD COLUMN "stripeCustomerId" TEXT,
ADD COLUMN "stripeSubscriptionId" TEXT;

CREATE UNIQUE INDEX "Company_stripeCustomerId_key"
ON "Company"("stripeCustomerId");

CREATE UNIQUE INDEX "Company_stripeSubscriptionId_key"
ON "Company"("stripeSubscriptionId");