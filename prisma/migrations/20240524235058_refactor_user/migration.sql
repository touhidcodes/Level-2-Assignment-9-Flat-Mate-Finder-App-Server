-- AlterTable
ALTER TABLE "user_profiles" ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "profession" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;