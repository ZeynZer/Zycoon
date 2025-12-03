# Zycoon — PWA Miner Tycoon

Un jeu tycoon ultra-dynamique en React avec PWA support. Engagez des mineurs, automatisez vos mines, et devenez le plus grand empire minier !

## Installation et lancement

PowerShell:
```powershell
cd "C:\Users\zeynz\Desktop\Zycoon"
npm install
npm run dev
```

Le serveur Vite démarre sur http://localhost:5173 (ou celui indiqué en console).

## Commandes

- `npm run dev` — Démarrage serveur de développement
- `npm run build` — Build production (dossier `dist/`)
- `npm run preview` — Aperçu build production

## Fonctionnalités

- ⛏️ **Mineurs** : Engagez des mineurs, améliorez-les pour augmenter la production
- ⛰️ **Mines** : Débloquez 3 mines avec des productions croissantes
- 👔 **Managers** : Engagez des collecteurs (auto-vente) et des cadres (auto-upgrade)
- 📈 **Marché** : Prix dynamique qui fluctue en temps réel
- 💾 **Sauvegarde** : Auto-save en localStorage
- 📱 **PWA** : Installable sur mobile, offline-ready

## Architecture

- `src/game/useGame.ts` — Hook de logique de jeu (state, tick, actions)
- `src/components/*` — UI React (Game, HUD, Shop, Managers)
- `public/sw.js` — Service Worker pour cache/offline
- `public/manifest.json` — PWA metadata

## Prochaines étapes

- Ajouter particules et animations (canvas)
- Améliorer équilibrage coûts/progression
- Ajouter sons/musique
- Interface de paramètres (vitesse de jeu, thème)
