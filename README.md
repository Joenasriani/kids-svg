# Kids Memory Match — SVG Implementation

Kids Memory Match is a four-level React card-matching game using SVG artwork.

## How it plays

The player flips two cards at a time and attempts to find identical images.

**flip first card → flip second card → match or mismatch → update lives → complete all pairs → advance level**

Progression:

- Level 1: 2 pairs / 4 cards
- Level 2: 3 pairs / 6 cards
- Level 3: 4 pairs / 8 cards
- Level 4: 5 pairs / 10 cards

Each level begins with three lives. A mismatch removes one life. Completing a level restores the lives for the next level. Victory is reached after the available SVG image set has been used.

## Implementation

- React frontend in `frontend/`
- SVG card artwork in `frontend/public/cards/`
- Framer Motion for interface/card animation
- `react-confetti` for completion feedback
- fullscreen support
- FastAPI/MongoDB status-check scaffold in `backend/`; the visible memory-game loop does not depend on it

## Event activation

This game was developed as one module in a multi-game interactive children’s edutainment activation in the UAE.

Event production: [Peach Society](https://peach-society.com/) — Dubai-based event and experiential production company.

## Related implementation

`kids-svg`, `kids-match`, and `kids-svg-game` are closely related development states of the same Memory Match game family.
