# Flash Dating Complet — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Dating-complete Flash on `feature/dating-complete` — marketing pages, preferences, reciprocal matching.

**Architecture:** Extend `Guest` + guest API; add `lib/compatibility.ts`; filter peers in `tryPair`; rebuild landing + static pages; light browse/matches copy.

**Tech:** Next.js App Router, Redis guests, Unsplash via `next/image`.

## Tasks

1. Types + compatibility helpers + guest create/API
2. Matching queue filter in `tryPair`
3. GuestForm with sex / lookingFor
4. Marketing shell (nav/footer/images) + landing
5. `/about` `/safety` `/privacy`
6. Browse/matches copy + metadata + README
7. `npm run build` verify + commit
