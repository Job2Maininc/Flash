# Flash — Dating Complet (design)

## Goal

Make Flash read as a complete dating product: clear marketing, sex + looking-for preferences with real queue filtering, and branded copy across the app.

## Matching (simple)

- Guest fields: `nickname`, `sex` (`homme` | `femme` | `non_binaire`), `lookingFor` (`hommes` | `femmes` | `tous`)
- Pair only when reciprocal: each person's sex is accepted by the other's `lookingFor`
- `tous` accepts any sex; `hommes`/`femmes` only accept that binary sex (non-binary guests need a partner with `tous`)

## Marketing

- Landing: hero stock image, brand Flash, dating pitch, how-it-works, social proof, CTA + signup form
- Pages: `/about`, `/safety`, `/privacy`
- Stock imagery via Unsplash remote URLs

## App surfaces

- Browse waiting / match copy in dating language
- Matches empty state rebranded
- Shared nav/footer for marketing pages

## Out of scope

Email auth, chat, paid tiers, detailed orientation taxonomy, moderation tooling beyond existing bans
