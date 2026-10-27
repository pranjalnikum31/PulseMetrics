-- Event uses a composite primary key for TimescaleDB hypertable compatibility.
-- The live database already has this key and index.
-- This migration documents the changes for fresh database setups.
ALTER TABLE "Event" DROP CONSTRAINT "Event_pkey";
ALTER TABLE "Event" ADD CONSTRAINT "Event_pkey" PRIMARY KEY ("id", "timestamp");
CREATE INDEX "Event_timestamp_idx" ON "Event"("timestamp" DESC);