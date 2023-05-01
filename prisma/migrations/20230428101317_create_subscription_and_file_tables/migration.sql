-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "url" TEXT NOT NULL,
    "subscriptionId" INTEGER NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "pay_plan" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "icon_id" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "pay_date" TIMESTAMP(3) NOT NULL,
    "fileId" INTEGER NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_icon_id_key" ON "Subscription"("icon_id");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_icon_id_fkey" FOREIGN KEY ("icon_id") REFERENCES "File"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
