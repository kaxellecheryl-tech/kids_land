# 🚀 Guide de démarrage Kids Land

Ce guide te prend par la main pour faire tourner le projet localement, étape par étape.

---

## ✅ Pré-requis

Vérifie que tu as :

```bash
node --version   # >= 20.0.0
npm --version    # >= 10.0.0
git --version    # peu importe la version
```

Si Node.js n'est pas à jour, télécharge la dernière LTS sur **nodejs.org**.

---

## 📦 Étape 1 — Installation des dépendances

Dans le terminal, à la racine du projet :

```bash
npm install
```

Ça va prendre 2-3 minutes la première fois. Tu auras peut-être quelques warnings de peer dependencies — c'est normal.

---

## 🏗️ Étape 2 — Configuration Supabase (15 min)

### 2.1 Créer un projet Supabase

1. Va sur **supabase.com** → "Start your project" → connecte-toi avec GitHub
2. Clique "New project"
3. Remplis :
   - Name : `kidsland`
   - Database password : **génère un mot de passe fort et garde-le** (tu en auras besoin)
   - Region : choisis `West EU (Ireland)` ou `Central US` (latence acceptable depuis CI)
4. Clique "Create new project" → attends 2 min que ça provisionne

### 2.2 Récupérer les clés

Dans ton dashboard Supabase :

- **Settings → API** → tu vas voir :
  - `Project URL` → c'est `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` → c'est `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role` (clique "Reveal") → c'est `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **secret**

- **Settings → Database → Connection string → URI** → c'est ton `DATABASE_URL`
  - Remplace `[YOUR-PASSWORD]` par le mot de passe créé à l'étape 2.1
  - Pour `DIRECT_URL`, mets la même chose

### 2.3 Créer le fichier `.env.local`

À la racine du projet :

```bash
cp .env.example .env.local
```

Puis ouvre `.env.local` dans VS Code et remplis les valeurs Supabase.

---

## 💳 Étape 3 — Configuration PayDunya (sandbox d'abord)

1. Va sur **paydunya.com** → crée un compte
2. Active le mode **Test (Sandbox)** dans ton dashboard
3. Va dans **Intégration → API Keys**
4. Copie les 4 clés dans `.env.local` :
   - `PAYDUNYA_MASTER_KEY`
   - `PAYDUNYA_PRIVATE_KEY`
   - `PAYDUNYA_PUBLIC_KEY`
   - `PAYDUNYA_TOKEN`
5. Garde `PAYDUNYA_MODE=test` pour l'instant

> 💡 Tu pourras passer en mode `live` plus tard, après avoir vérifié ton compte avec un RCCM et ouvert un compte marchand.

---

## 🗄️ Étape 4 — Initialiser la base de données

```bash
# Génère le client Prisma TypeScript à partir du schéma
npx prisma generate

# Pousse le schéma vers Supabase (crée les tables)
npx prisma db push

# Charge les données de démo (8 produits, 4 marques, 2 zones, 1 coupon)
npx prisma db seed
```

Si tu vas dans Supabase → **Table editor**, tu devrais voir tes nouvelles tables : `products`, `categories`, `brands`, `orders`, etc.

---

## 🧪 Étape 5 — Lancer le projet

```bash
npm run dev
```

Ouvre **http://localhost:3000** → tu devrais voir le site Kids Land 🎉

---

## 🛠️ Commandes utiles

| Commande | Effet |
|----------|-------|
| `npm run dev` | Lance le serveur de dev (hot reload) |
| `npm run build` | Build de production |
| `npm run start` | Lance le build en local |
| `npm run lint` | Vérifie le code |
| `npx prisma studio` | Interface graphique pour explorer la DB |
| `npx prisma db push` | Synchronise le schéma vers la DB |
| `npx prisma db seed` | Recharge les données de démo |
| `npx prisma migrate reset` | ⚠️ Reset complet (efface tout) |

---

## ❓ Problèmes fréquents

**`Error: Environment variable not found: DATABASE_URL`**
→ Vérifie que `.env.local` est bien rempli et que tu as redémarré le serveur de dev.

**`Can't reach database server`**
→ Vérifie le mot de passe dans `DATABASE_URL`. Va sur Supabase → Settings → Database et compare.

**Le site s'affiche mais sans produits**
→ La DB n'est pas encore seedée. Lance `npx prisma db seed`.

**`Module not found: Can't resolve '@/...'`**
→ Vérifie que `tsconfig.json` a bien le `paths: { "@/*": ["./*"] }` et redémarre VS Code.

---

## 🚀 Prochaines étapes (Phase 2)

Une fois le projet qui tourne, on attaque :

- [ ] Page liste des produits `/products` avec filtres et pagination
- [ ] Page détail produit `/products/[slug]` avec sélection de taille
- [ ] Tunnel de checkout `/checkout` (formulaire adresse + récap)
- [ ] Intégration PayDunya (création invoice + redirection)
- [ ] Webhook de confirmation paiement
- [ ] Page de succès / échec paiement
- [ ] Auth Supabase (login/signup)
- [ ] Page compte client + historique commandes
- [ ] Dashboard admin pour gérer produits et commandes
- [ ] Upload images vers Supabase Storage
- [ ] Emails transactionnels via Resend
- [ ] Déploiement Vercel + domaine custom

Reviens me voir quand le `npm run dev` te montre le site et on enchaîne 🚀
