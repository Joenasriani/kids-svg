# Kids Memory Match — Frontend

React frontend for the SVG card-matching game used in the Kids Memory Match project family.

## Gameplay

The player flips two cards at a time and attempts to find identical SVG images.

- Level 1: 2 pairs / 4 cards
- Level 2: 3 pairs / 6 cards
- Level 3: 4 pairs / 8 cards
- Level 4: 5 pairs / 10 cards
- each level starts with three lives;
- a mismatch removes one life;
- matched pairs remain revealed;
- completing a level restores lives and increases the pair count;
- the game reaches its victory state after the available artwork set has been used.

## Frontend stack

- React
- Framer Motion
- react-confetti
- Lucide React
- CRACO / Create React App toolchain
- Tailwind CSS

Card artwork is stored under `public/cards/`.

## Development

```bash
npm install
npm start
```

Production build:

```bash
npm run build
```

Tests:

```bash
npm test
```

## Event activation

This game was developed as one module in a multi-game interactive children’s edutainment activation in the UAE.

Event production: [Peach Society](https://peach-society.com/) — Dubai-based event and experiential production company.
