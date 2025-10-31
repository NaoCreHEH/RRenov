-- Migration: Add project images, about content, and team members tables
-- Created: 2025-10-31

-- Create projectImages table
CREATE TABLE IF NOT EXISTS `projectImages` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `projectId` int NOT NULL,
  `imageUrl` text NOT NULL,
  `order` int DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create aboutContent table
CREATE TABLE IF NOT EXISTS `aboutContent` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `section` varchar(100) NOT NULL UNIQUE,
  `title` varchar(255),
  `content` text,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create teamMembers table
CREATE TABLE IF NOT EXISTS `teamMembers` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `role` varchar(255),
  `bio` text,
  `imageUrl` text,
  `order` int DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert initial about content
INSERT INTO `aboutContent` (`section`, `title`, `content`) VALUES 
('header', 'À Propos de Nous', 'Votre partenaire de confiance pour l''aménagement de combles'),
('who_we_are', 'Qui Sommes-Nous ?', 'Rommelaere Rénov est une entreprise spécialisée dans l''aménagement de combles depuis plus de 10 ans. Nous mettons notre expertise et notre passion au service de vos projets de rénovation.'),
('expertise', 'Notre Expertise', 'Nous maîtrisons tous les aspects de l''aménagement de combles :\n- Gyproc et cloisons\n- Enduit et finitions\n- Retouche sur plafonnage\n- Cimentage et travaux de base\n- Crépi sur isolant\n- Plafonnage\n- Isolation laine de bois et laine minérale'),
('values', 'Nos Valeurs', 'Qualité, professionnalisme et satisfaction client sont au cœur de nos valeurs. Nous nous engageons à livrer des travaux impeccables dans les délais convenus.');

-- Insert initial team member (Matthias)
INSERT INTO `teamMembers` (`name`, `role`, `bio`, `imageUrl`, `order`) VALUES 
('Matthias Rommelaere', 'Fondateur et gérant', 'Fondateur et gérant de Rommelaere Rénov, Matthias apporte plus de 10 ans d''expérience dans le domaine de la rénovation et de l''aménagement de combles.\n\nPassionné par son métier, il s''engage à fournir des solutions de qualité supérieure à chacun de ses clients. Son attention aux détails et son professionnalisme font la différence dans chaque projet.\n\nMatthias croit que chaque projet est unique et mérite une approche personnalisée pour garantir la satisfaction totale du client.', '/matthias.png', 1);

-- Migrate existing project images to projectImages table
-- Note: This assumes images are stored in /projects/{slug}/ directories
-- You'll need to manually insert the actual image URLs based on your file structure

-- Example for Restauration Complète d'une Chambre (project id 1)
-- INSERT INTO `projectImages` (`projectId`, `imageUrl`, `order`) VALUES 
-- (1, '/projects/chambre/1.jpg', 1),
-- (1, '/projects/chambre/2.jpg', 2),
-- (1, '/projects/chambre/3.jpg', 3),
-- (1, '/projects/chambre/4.jpg', 4),
-- (1, '/projects/chambre/5.jpg', 5),
-- (1, '/projects/chambre/6.jpg', 6),
-- (1, '/projects/chambre/7.jpg', 7);

-- Example for Crépi sur Façade (project id 2)
-- INSERT INTO `projectImages` (`projectId`, `imageUrl`, `order`) VALUES 
-- (2, '/projects/crepis/1.jpg', 1),
-- (2, '/projects/crepis/2.jpg', 2),
-- (2, '/projects/crepis/3.jpg', 3),
-- (2, '/projects/crepis/4.jpg', 4);

-- Example for Caisson Îlot Central (project id 3)
-- INSERT INTO `projectImages` (`projectId`, `imageUrl`, `order`) VALUES 
-- (3, '/projects/caisson/1.jpg', 1),
-- (3, '/projects/caisson/2.jpg', 2),
-- (3, '/projects/caisson/3.jpg', 3),
-- (3, '/projects/caisson/4.jpg', 4),
-- (3, '/projects/caisson/5.jpg', 5),
-- (3, '/projects/caisson/6.jpg', 6);

-- Example for Aménagement Suite Parentale (project id 4)
-- INSERT INTO `projectImages` (`projectId`, `imageUrl`, `order`) VALUES 
-- (4, '/projects/suite-parentale/1.jpg', 1),
-- (4, '/projects/suite-parentale/2.jpg', 2),
-- (4, '/projects/suite-parentale/3.jpg', 3);
