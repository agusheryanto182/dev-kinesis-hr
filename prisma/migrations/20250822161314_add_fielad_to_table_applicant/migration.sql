-- AlterTable
ALTER TABLE "public"."applicants" ADD COLUMN     "profileLinks" TEXT[],
ADD COLUMN     "yearOfExperience" INTEGER;

-- AlterTable
ALTER TABLE "public"."documents" ADD COLUMN     "localPath" TEXT;
