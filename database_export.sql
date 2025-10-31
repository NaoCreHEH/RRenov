-- Rommelaere Rénov Database Export
-- Database structure and initial data

-- Services
INSERT INTO services (title, description, `order`) VALUES 
('Gyproc et Cloisons', 'Installation de cloisons en gyproc pour l''aménagement de vos combles. Travail propre et professionnel.', 1),
('Enduit et Finitions', 'Enduit de qualité pour une finition impeccable. Nous garantissons un rendu lisse et uniforme.', 2),
('Plafonnage', 'Plafonnage complet de vos combles avec des matériaux de qualité supérieure.', 3),
('Isolation', 'Isolation laine de bois et laine minérale pour une meilleure efficacité énergétique.', 4),
('Retouche sur Plafonnage', 'Retouches et réparations sur plafonnage existant avec un rendu parfait.', 5);

-- Projects
INSERT INTO projects (title, description, `order`) VALUES 
('Restauration Complète d''une Chambre', 'Rénovation intégrale d''une chambre avec gyproc, enduit et finitions impeccables. Transformation d''un espace en pièce de vie moderne et confortable.', 1),
('Crépi sur Façade', 'Application de crépi de qualité supérieure sur façade. Finition professionnelle garantissant durabilité et esthétique.', 2),
('Caisson Îlot Central', 'Création d''un caisson de rangement intégré suivant l''îlot central. Travail de précision avec finitions soignées.', 3),
('Aménagement Suite Parentale', 'Transformation complète d''un comble en suite parentale luxueuse. Isolation, gyproc, enduit et finitions de haut standing.', 4);

-- Contact Info
INSERT INTO contactInfo (phone, email, address) VALUES 
('0472 65 58 73', 'rommelaere.renov@gmail.com', 'Belgique');
