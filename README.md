# Kids Land — Boutique e-commerce

Plateforme e-commerce de vêtements et accessoires pour enfants, développée pour le marché ivoirien. Paiement mobile money Wave, emails automatisés via Brevo, stack Next.js 15 moderne.

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Base de données | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | Supabase Auth |
| Paiement | Wave Mobile Money |
| Emails | Brevo (transactionnels + marketing) |
| State management | Zustand (panier + favoris) |
| Hosting | Vercel |
| Analytics | Vercel Analytics + Speed Insights |

---

## Fonctionnalités

### Boutique
- Catalogue produits avec filtres (genre, catégorie, marque, tranche d'âge)
- Page détail produit avec sélection de variante (taille, couleur)
- Panier persistant (localStorage + sync base de données si connecté)
- Liste de favoris (localStorage + sync base de données si connecté)
- Codes promo (pourcentage, montant fixe, livraison offerte)
- Livraison gratuite dès 25 000 FCFA
- Guide des tailles

### Tunnel d'achat
- Checkout avec adresse de livraison (Abidjan / intérieur du pays)
- Paiement Wave Mobile Money avec redirection sécurisée
- Webhook Wave avec vérification de signature HMAC-SHA256
- Email de confirmation de commande automatique (Brevo)
- Page de succès post-paiement

### Compte client
- Inscription avec consentement CGV + opt-in marketing
- Connexion / déconnexion (Supabase Auth)
- Suivi de commandes
- Page favoris

### Emails automatisés (Brevo)

| Email | Déclencheur |
|---|---|
| Confirmation de commande | Paiement Wave validé (webhook) |
| Mise à jour statut | Admin change le statut de la commande |
| Panier abandonné | Panier non commandé après 1h (cron toutes les heures) |
| Favoris oubliés | Wishlist inactive depuis 7 jours (cron quotidien à 9h) |
| Rupture imminente | Produit favori ≤ 5 unités en stock (cron toutes les 6h) |

> Les emails marketing (panier abandonné, favoris) ne sont envoyés qu'aux utilisateurs ayant coché l'opt-in à l'inscription.

### Admin
- Dashboard avec statistiques (commandes, chiffre d'affaires, produits)
- Gestion produits : création, modification, activation, mise en vedette
- Gestion variantes (taille, couleur, SKU, stock, prix spécifique)
- Gestion images produits (upload via Supabase Storage)
- Gestion catégories (hiérarchie parent/enfant)
- Gestion marques
- Gestion commandes avec changement de statut (déclenche l'email client)
- Gestion codes promo
- Accès protégé par vérification du rôle ADMIN en base

### Pages légales
- `/legal/cgv` — Conditions Générales de Vente
- `/legal/mentions-legales` — Mentions légales
- `/legal/confidentialite` — Politique de confidentialité
- Liens dans le footer, au checkout et à l'inscription

---

## Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# Remplir les valeurs (voir section ci-dessous)

# 3. Générer le client Prisma et synchroniser le schéma
npx prisma generate
npx prisma db push

# 4. (Optionnel) Seeder la base avec des données de test
npx prisma db seed

# 5. Lancer le serveur de développement
npm run dev
```

Site disponible sur http://localhost:3000
Admin sur http://localhost:3000/admin (compte avec rôle ADMIN requis)

---

## Variables d'environnement

```env
# Supabase — https://supabase.com/dashboard → projet → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Base de données — Supabase → Settings → Database → Connection string
DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-x-xx-x.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# Wave — https://wave.com/business → Paramètres → API
WAVE_API_KEY=
WAVE_SECRET_KEY=
WAVE_WEBHOOK_SECRET=   # Clé HMAC pour vérifier les webhooks Wave

# Brevo — https://app.brevo.com → Paramètres → SMTP & API → API
BREVO_API_KEY=xkeysib-...

# Cron — secret arbitraire à générer : openssl rand -hex 32
CRON_SECRET=

# App
NEXT_PUBLIC_APP_URL=https://www.kidsland.africa
```

---

## Structure du projet

```
kidsland/
├── app/
│   ├── (shop)/                      # Routes publiques de la boutique
│   │   ├── page.tsx                 # Homepage
│   │   ├── products/                # Catalogue + détail produit
│   │   ├── brands/                  # Liste marques + détail marque
│   │   ├── checkout/                # Tunnel d'achat + page succès
│   │   ├── orders/track/            # Suivi de commandes
│   │   ├── account/                 # Mon compte
│   │   ├── wishlist/                # Favoris
│   │   ├── contact/                 # Contact
│   │   ├── about/                   # À propos + engagements
│   │   ├── careers/                 # Recrutement
│   │   ├── press/                   # Espace presse
│   │   ├── help/                    # FAQ, livraison, retours
│   │   └── legal/                   # CGV, mentions légales, confidentialité
│   ├── (auth)/                      # Pages d'authentification
│   │   ├── login/
│   │   └── register/
│   ├── (admin)/                     # Dashboard admin (rôle ADMIN requis)
│   │   └── admin/
│   │       ├── page.tsx             # Dashboard statistiques
│   │       ├── products/            # Gestion produits
│   │       ├── categories/          # Gestion catégories
│   │       ├── brands/              # Gestion marques
│   │       ├── orders/              # Gestion commandes
│   │       └── coupons/             # Gestion codes promo
│   ├── actions/                     # Server Actions Next.js
│   │   ├── auth.ts                  # Création compte utilisateur
│   │   ├── checkout.ts              # Création commande + session Wave
│   │   ├── admin.ts                 # CRUD admin (produits, commandes…)
│   │   ├── cart-sync.ts             # Sync panier → base de données
│   │   ├── wishlist-sync.ts         # Sync favoris → base de données
│   │   ├── coupon.ts                # Validation codes promo
│   │   ├── search.ts                # Recherche produits
│   │   └── track-order.ts           # Récupération commandes client
│   └── api/
│       ├── wave/webhook/            # Webhook paiement Wave (signature HMAC)
│       ├── admin/upload/            # Upload images produits
│       └── cron/
│           ├── abandoned-cart/      # Email panier abandonné
│           ├── wishlist-low-stock/  # Email rupture stock sur favoris
│           └── wishlist-reminder/   # Email favoris oubliés
├── components/
│   ├── layout/                      # Header, Footer, AnnouncementBar
│   ├── shop/                        # ProductCard, CartDrawer, SearchModal…
│   │   ├── CartSyncProvider.tsx     # Sync panier Zustand → DB
│   │   └── WishlistSyncProvider.tsx # Sync favoris Zustand → DB
│   └── admin/                       # Formulaires et tables admin
├── lib/
│   ├── supabase/                    # Clients Supabase (server + client)
│   ├── prisma.ts                    # Client Prisma singleton
│   ├── brevo.ts                     # Envoi emails + templates HTML
│   ├── wave.ts                      # Création session de paiement Wave
│   ├── cart-store.ts                # Store Zustand panier
│   ├── wishlist-store.ts            # Store Zustand favoris
│   └── utils.ts                     # formatPrice, generateOrderNumber, cn…
├── prisma/
│   ├── schema.prisma                # Schéma complet
│   └── seed.ts                      # Données de test
├── middleware.ts                    # Protection routes + vérification rôle admin
└── vercel.json                      # Planification crons Vercel
```

---

## Schéma base de données

| Modèle | Description |
|---|---|
| `User` | Compte client avec rôle, consentement marketing |
| `Address` | Adresses de livraison sauvegardées |
| `Product` | Catalogue avec variantes, images, catégorie, marque |
| `ProductVariant` | Taille, couleur, SKU, stock, prix spécifique |
| `Category` | Hiérarchie parent/enfant |
| `Brand` | Marques avec logo |
| `Order` | Commandes avec snapshot adresse et montants |
| `OrderItem` | Lignes de commande (snapshot produit au moment de l'achat) |
| `ShippingZone` | Zones et tarifs de livraison |
| `Cart` | Panier persisté par utilisateur (JSON) |
| `Wishlist` | Favoris persistés par utilisateur (JSON) |
| `Coupon` | Codes promo (%, montant fixe, livraison offerte) |

---

## Crons Vercel

Configurés dans `vercel.json` et sécurisés par `Authorization: Bearer <CRON_SECRET>` :

| Route | Fréquence | Action |
|---|---|---|
| `/api/cron/abandoned-cart` | Toutes les heures | Email panier abandonné depuis 1h–48h |
| `/api/cron/wishlist-low-stock` | Toutes les 6h | Email si favori ≤ 5 unités en stock |
| `/api/cron/wishlist-reminder` | Chaque jour à 9h | Email favoris inactifs depuis 7 jours |

---

## Configuration Brevo comme SMTP Supabase

Pour que les emails de confirmation d'inscription passent par Brevo :

1. Aller dans **Supabase → Project Settings → Authentication → SMTP Settings**
2. Activer **Enable Custom SMTP**
3. Renseigner :
   - Host : `smtp-relay.brevo.com`
   - Port : `587`
   - Username : ton email Brevo
   - Password : ton mot de passe SMTP Brevo (Brevo → Paramètres → SMTP & API → SMTP)
   - Sender email : `info@kidsland.africa`
   - Sender name : `Kids Land`

---

## Passer un compte en ADMIN

Exécuter directement en base via Supabase → SQL Editor :

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'ton@email.com';
```

---

## Avant la mise en production

- [ ] Compléter les placeholders dans `/legal/mentions-legales` (immatriculation, RCCM, adresse)
- [ ] Configurer `WAVE_API_KEY`, `WAVE_SECRET_KEY` dans `.env`
- [ ] Générer `WAVE_WEBHOOK_SECRET` depuis le dashboard Wave → Webhooks et l'ajouter dans `.env`
- [ ] Générer `CRON_SECRET` (`openssl rand -hex 32`) et l'ajouter dans Vercel → Environment Variables
- [ ] Configurer le SMTP Brevo dans Supabase (voir section ci-dessus)
- [ ] Ajouter l'URL du webhook dans le dashboard Wave : `https://www.kidsland.africa/api/wave/webhook`
- [x] `robots.ts` et `sitemap.ts` générés dynamiquement (App Router)
- [x] Vercel Analytics + Speed Insights intégrés (`app/layout.tsx`)
- [x] Pages d'erreur personnalisées (`not-found.tsx`, `error.tsx`, `global-error.tsx`)
