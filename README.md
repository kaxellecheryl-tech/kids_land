# Kids Land — E-commerce

Boutique en ligne de vêtements pour enfants. Stack moderne, paiement mobile money (PayDunya).

## 🛠️ Stack

- **Framework** : Next.js 15 (App Router) + TypeScript
- **Styling** : Tailwind CSS v4 (avec design tokens Kids Land)
- **Database** : PostgreSQL via Supabase
- **ORM** : Prisma
- **Auth** : Supabase Auth
- **Storage images** : Supabase Storage
- **Paiement** : PayDunya (Wave, Orange Money, MTN, Moov, CB)
- **Email** : Resend
- **State (panier)** : Zustand
- **Hosting** : Vercel

## 🚀 Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier d'env
cp .env.example .env.local
# Puis remplir les valeurs (voir section Variables d'env ci-dessous)

# 3. Générer le client Prisma + push le schéma vers Supabase
npx prisma generate
npx prisma db push

# 4. Seeder la base avec quelques produits de test
npx prisma db seed

# 5. Lancer le dev server
npm run dev
```

Le site est dispo sur http://localhost:3000

## 🔑 Variables d'environnement

Crée un fichier `.env.local` à la racine avec :

```env
# Supabase (https://supabase.com/dashboard → ton projet → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Database (Supabase → Settings → Database → Connection string → URI)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.xxxxx.supabase.co:5432/postgres

# PayDunya (https://app.paydunya.com → Intégration → API Keys)
PAYDUNYA_MASTER_KEY=
PAYDUNYA_PRIVATE_KEY=
PAYDUNYA_PUBLIC_KEY=
PAYDUNYA_TOKEN=
PAYDUNYA_MODE=test  # 'test' ou 'live'

# Resend (https://resend.com/api-keys)
RESEND_API_KEY=re_xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 Structure

```
kidsland/
├── app/
│   ├── (shop)/              # Routes publiques de la boutique
│   │   ├── page.tsx         # Homepage
│   │   ├── products/        # Catalogue + détail produit
│   │   ├── cart/            # Panier
│   │   ├── checkout/        # Tunnel d'achat
│   │   └── account/         # Compte client
│   ├── api/                 # Routes API (REST)
│   │   ├── checkout/        # Création de paiement
│   │   ├── webhooks/        # Callbacks PayDunya
│   │   └── products/        # CRUD produits
│   └── admin/               # Dashboard admin (protégé)
├── components/
│   ├── ui/                  # Composants génériques (Button, Input...)
│   ├── shop/                # Composants métier (ProductCard, CartDrawer...)
│   └── layout/              # Header, Footer, Nav
├── lib/
│   ├── supabase/            # Clients Supabase (server/client/admin)
│   ├── prisma.ts            # Client Prisma singleton
│   ├── paydunya.ts          # Helpers PayDunya
│   ├── cart-store.ts        # Store Zustand panier
│   └── utils.ts             # Helpers (cn, formatPrice...)
├── prisma/
│   ├── schema.prisma        # Schéma DB
│   └── seed.ts              # Données de test
└── types/                   # Types TS partagés
```

## 🗺️ Roadmap

- [x] **Phase 1** : Setup Next.js + design migration
- [ ] **Phase 2** : Catalogue produits (DB + listing + détail)
- [ ] **Phase 3** : Panier + checkout
- [ ] **Phase 4** : Auth & comptes clients
- [ ] **Phase 5** : Intégration PayDunya
- [ ] **Phase 6** : Dashboard admin
- [ ] **Phase 7** : Production (Vercel + domaine)
