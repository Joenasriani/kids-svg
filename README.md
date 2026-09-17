# Kids Memory Match — SVG Implementation

This repository contains a React implementation of **Kids Memory Match**, developed within the same multi-game interactive children’s edutainment activation in the UAE as the other `kids-*` game repositories.

## Implemented game

The player flips cards to find matching pairs of SVG images.

**flip first card → flip second card → match or mismatch → update matched cards/lives → complete all pairs → advance level**

The current frontend implements four progressive levels:

- Level 1: 2 pairs / 4 cards
- Level 2: 3 pairs / 6 cards
- Level 3: 4 pairs / 8 cards
- Level 4: 5 pairs / 10 cards

A run starts each level with three lives. A mismatched pair removes one life. Completing a level restores three lives for the next level. The game reaches victory after the available SVG image set has been used through the progression.

## Repository structure

- `frontend/` — React memory-matching game and SVG card assets
- `backend/` — FastAPI/MongoDB status-check scaffold
- `tests/` and `test_reports/` — historical test material
- `test_result.md` — historical test summary

The game logic visible in `frontend/src/App.js` does not depend on the backend status-check routes.

## Related repository lineage

Repository history identifies this codebase as an alternate Kids Memory Match development lineage related to `Joenasriani/kids-match`.

Both repositories are preserved independently. This relationship does not imply that either repository should be merged, deleted, renamed, archived, or replaced by the other.

## Deployment status

No live deployment is verified for this repository in the current audit. The repository has no configured Homepage URL and no GitHub Pages deployment.

## Preservation boundary

The game source, SVG assets, level progression, lives logic, matching behavior, timer behavior, animations, tests and historical development files are preserved. This documentation pass does not alter gameplay or runtime behavior.
