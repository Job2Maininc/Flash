# Flash

Site de **rencontres en vidéo live** (Tinder × Omegle) : appel permanent, préférences sexe / je cherche, swipe, matches rappelables.

## Stack

- Next.js (App Router) sur **Vercel**
- **LiveKit Cloud** pour le WebRTC
- **Upstash Redis** pour la file d’attente / sessions / matches
- Auth **invité** (pseudo + sexe + looking-for + cookie signé)

## Setup local

1. Crée un projet [LiveKit Cloud](https://cloud.livekit.io) et copie URL / API Key / Secret.
2. Crée une base [Upstash Redis](https://console.upstash.com) (REST URL + token).
3. Copie l’env :

```bash
cp .env.example .env.local
```

Renseigne :

- `LIVEKIT_URL`
- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `GUEST_COOKIE_SECRET` (chaîne longue aléatoire)

4. Installe et lance :

```bash
npm install
npm run dev
```

Ouvre `http://localhost:3000` sur **deux navigateurs** (ou téléphone + PC en HTTPS via tunnel) pour tester le pairage.

## Parcours produit

1. Landing marketing → pseudo + sexe + « je cherche ».
2. File filtrée (compatibilité réciproque) → `/browse`.
3. Appel vidéo · ✕ suivant · ♥ match mutuel → `/matches`.
4. **Rappeler** recrée une room LiveKit.

Pages : `/about`, `/safety`, `/privacy`.

Design system notes: see [`DESIGN.md`](./DESIGN.md) (Camera Light tokens, primitives, a11y checklist).

## Deploy Vercel

1. Pousse le repo et importe-le dans Vercel (framework Next.js).
2. Ajoute les mêmes variables d’environnement dans **Project → Settings → Environment Variables**.
3. Deploy. L’URL HTTPS est requise pour caméra/micro.

### Webhook LiveKit

Dans LiveKit Cloud → **Settings → Webhooks** :

- **URL** : `https://<ton-domaine-vercel>/api/livekit/webhook`

## Hors scope V1

Comptes email, premium, orientation détaillée, chat texte, modération avancée.
