-- Create Story table manually
CREATE TABLE IF NOT EXISTS `Story` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `excerpt` TEXT NOT NULL,
  `content` LONGTEXT NOT NULL,
  `coverImage` VARCHAR(191) NULL,
  `author` VARCHAR(191) NULL,
  `isPublished` BOOLEAN NOT NULL DEFAULT false,
  `publishedAt` DATETIME(3) NULL,
  `tags` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Story_slug_key`(`slug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
