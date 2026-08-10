# Flash

Dating webapp mobile (Tinder × Omegle) : appel vidéo permanent, swipe gauche/droite, matches rappelables.

## Stack

- Next.js (App Router) sur **Vercel**
- **LiveKit Cloud** pour le WebRTC
- **Upstash Redis** pour la file d’attente / sessions / matches
- Auth **invité** (pseudo + cookie signé)

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

## Deploy Vercel

1. Pousse le repo et importe-le dans Vercel (framework Next.js).
2. Ajoute les mêmes variables d’environnement dans **Project → Settings → Environment Variables**.
3. Deploy. L’URL HTTPS est requise pour caméra/micro.

```bash
npx vercel
```

### Webhook LiveKit (présence / déconnexion rapide)

Dans [LiveKit Cloud](https://cloud.livekit.io) → **Settings → Webhooks**, ajoute :

- **URL** : `https://<ton-domaine-vercel>/api/livekit/webhook`
- La signature utilise `LIVEKIT_API_KEY` + `LIVEKIT_API_SECRET` (pas de variable supplémentaire).

Événements utiles : `participant_left`, `room_finished`.

## Parcours de test

1. Deux utilisateurs entrent un pseudo → `/browse`.
2. Ils se retrouvent en appel vidéo.
3. **✕** (left) → chacun retourne en file / prochain pair.
4. **♥** des deux côtés → badge match + entrée dans `/matches`.
5. **Rappeler** recrée une room LiveKit entre les deux.

### Checklist fiabilité présence (2 téléphones + preview Vercel)

| # | Scénario | Résultat attendu |
|---|----------|------------------|
| 1 | Pair → vidéo + audio → un peer ferme l'app | Survivant retourne en file en &lt;5 s |
| 2 | Swipe left | Les deux retournent en file, pas de re-match immédiat |
| 3 | Match mutual ♥ → peer quitte | Survivant pas bloqué, retour file |
| 4 | Recall depuis `/matches` | Les deux rejoignent la même room |
| 5 | Onglet background ~2 min | Pas de faux leave ; vrai leave si app tuée |
| 6 | PC sans webcam | Audio seul, pas d'écran noir infini pour le peer |

Mécanismes : heartbeat `/api/presence` (9 s), `sendBeacon` sur fermeture, stale peer (~45 s), LiveKit `onDisconnected` + webhook.

## Hors scope V1

Comptes email, premium, filtres, chat texte, modération.
