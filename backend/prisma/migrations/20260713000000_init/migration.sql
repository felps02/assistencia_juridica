CREATE TABLE `users` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(191) NOT NULL,
  `role` ENUM('ADMIN', 'ATTENDANT') NOT NULL DEFAULT 'ATTENDANT',
  `active` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `users_email_key`(`email`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `legal_requests` (
  `id` VARCHAR(191) NOT NULL,
  `protocol` VARCHAR(191) NOT NULL,
  `fullName` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(191) NOT NULL,
  `document` VARCHAR(191) NULL,
  `city` VARCHAR(191) NOT NULL,
  `state` VARCHAR(191) NOT NULL,
  `customerType` ENUM('PERSON', 'COMPANY') NOT NULL,
  `legalArea` ENUM('LABOR', 'CIVIL', 'FAMILY', 'SOCIAL_SECURITY', 'CONSUMER', 'BUSINESS', 'REAL_ESTATE', 'OTHER') NOT NULL,
  `contactPreference` ENUM('WHATSAPP', 'PHONE', 'EMAIL', 'VIDEO_CALL') NOT NULL,
  `preferredContactTime` VARCHAR(191) NULL,
  `caseDescription` TEXT NOT NULL,
  `status` ENUM('NEW', 'UNDER_REVIEW', 'WAITING_CLIENT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'NEW',
  `consentAccepted` BOOLEAN NOT NULL DEFAULT false,
  `consentAcceptedAt` DATETIME(3) NULL,
  `ipAddress` VARCHAR(191) NULL,
  `userAgent` VARCHAR(191) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `legal_requests_protocol_key`(`protocol`),
  INDEX `legal_requests_status_idx`(`status`),
  INDEX `legal_requests_legalArea_idx`(`legalArea`),
  INDEX `legal_requests_state_idx`(`state`),
  INDEX `legal_requests_createdAt_idx`(`createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `attachments` (
  `id` VARCHAR(191) NOT NULL,
  `legalRequestId` VARCHAR(191) NOT NULL,
  `originalName` VARCHAR(191) NOT NULL,
  `storedName` VARCHAR(191) NOT NULL,
  `fileUrl` VARCHAR(191) NOT NULL,
  `mimeType` VARCHAR(191) NOT NULL,
  `fileSize` INTEGER NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `attachments_legalRequestId_idx`(`legalRequestId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `request_notes` (
  `id` VARCHAR(191) NOT NULL,
  `legalRequestId` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `content` TEXT NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `request_notes_legalRequestId_idx`(`legalRequestId`),
  INDEX `request_notes_userId_idx`(`userId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `request_status_history` (
  `id` VARCHAR(191) NOT NULL,
  `legalRequestId` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NULL,
  `previousStatus` ENUM('NEW', 'UNDER_REVIEW', 'WAITING_CLIENT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NULL,
  `newStatus` ENUM('NEW', 'UNDER_REVIEW', 'WAITING_CLIENT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `request_status_history_legalRequestId_idx`(`legalRequestId`),
  INDEX `request_status_history_userId_idx`(`userId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `attachments` ADD CONSTRAINT `attachments_legalRequestId_fkey` FOREIGN KEY (`legalRequestId`) REFERENCES `legal_requests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `request_notes` ADD CONSTRAINT `request_notes_legalRequestId_fkey` FOREIGN KEY (`legalRequestId`) REFERENCES `legal_requests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `request_notes` ADD CONSTRAINT `request_notes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `request_status_history` ADD CONSTRAINT `request_status_history_legalRequestId_fkey` FOREIGN KEY (`legalRequestId`) REFERENCES `legal_requests`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `request_status_history` ADD CONSTRAINT `request_status_history_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
