-- Migration: Ajout du champ password pour l'authentification simple
-- Date: 2025-10-31

ALTER TABLE `users` ADD COLUMN `password` VARCHAR(255);
