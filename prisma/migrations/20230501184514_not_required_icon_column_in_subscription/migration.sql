-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_icon_id_fkey";

-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "icon_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;
