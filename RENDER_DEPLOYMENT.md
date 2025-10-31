# Déploiement sur Render

## Prérequis

1. Un compte Render (https://render.com)
2. Une base de données MySQL (TiDB, Planetscale, ou autre)
3. Les variables d'environnement nécessaires

## Étapes de déploiement

### 1. Préparer la base de données

Importez le fichier `database_export.sql` dans votre base de données MySQL :

```sql
-- Exécutez les commandes du fichier database_export.sql
```

### 2. Configurer les variables d'environnement sur Render

Allez dans les paramètres de votre service Render et ajoutez :

- `DATABASE_URL` : Votre URL de connexion MySQL
- `JWT_SECRET` : Une clé secrète aléatoire
- `VITE_APP_ID` : Votre ID d'application Manus
- `OAUTH_SERVER_URL` : https://api.manus.im
- `VITE_OAUTH_PORTAL_URL` : https://portal.manus.im
- `OWNER_NAME` : Matthias Rommelaere
- `OWNER_OPEN_ID` : Votre ID Manus
- `VITE_APP_TITLE` : Rommelaere Rénov
- `VITE_APP_LOGO` : /logo-rr.svg
- `BUILT_IN_FORGE_API_URL` : https://api.manus.im
- `BUILT_IN_FORGE_API_KEY` : Votre clé API

### 3. Déployer

1. Connectez votre repository GitHub à Render
2. Sélectionnez la branche à déployer
3. Render construira et déploiera automatiquement

### 4. Images des projets

Les images des projets sont stockées dans `/client/public/projects/` :
- `/projects/chambre/` - 7 photos
- `/projects/crepis/` - 4 photos
- `/projects/caisson/` - 6 photos
- `/projects/suite-parentale/` - 3 photos

Ces images sont servies statiquement par Render.

## Structure du projet

```
rommelaere-renov/
├── client/                 # Frontend React
│   └── public/
│       └── projects/       # Images des projets
├── server/                 # Backend Express + tRPC
├── drizzle/                # Schéma et migrations
├── database_export.sql     # Données initiales
└── RENDER_DEPLOYMENT.md    # Ce fichier
```

## Support

Pour toute question, contactez Manus AI.
