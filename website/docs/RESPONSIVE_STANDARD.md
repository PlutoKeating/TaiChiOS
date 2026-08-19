# Responsive and accessibility standard

This document is binding for every TaiChiOS website page and component. Responsive behavior is an acceptance criterion, not a later polish phase.

## Supported presentation ranges

Every change must remain readable and operable in all of these conditions:

| Reference viewport | Required behavior |
| --- | --- |
| 375 × 812 | Small mobile portrait; single-column content, 16 px minimum body text, no horizontal page scroll |
| 812 × 375 | Mobile landscape; navigation and hero must not consume the entire viewport |
| 768 × 1024 | Tablet portrait; layouts may use two columns only when content remains readable |
| 1024 × 768 | Tablet/small desktop landscape; desktop navigation may appear |
| 1440 × 900 | Desktop; content remains bounded and long-form lines stay below 75 characters |
| 1920 × 1080 and wider | Large desktop; gutters expand instead of stretching text or cards indefinitely |

Test intermediate widths, not only these reference sizes. Layouts must respond continuously to available space and browser zoom.

## Mandatory implementation rules

- Start mobile-first and enhance with shared Tailwind breakpoints. Do not build a separate mobile DOM tree.
- Use fluid sizing (`clamp()`, percentages, grid, flexbox, and bounded containers) instead of fixed page widths.
- Never disable browser zoom. The viewport meta tag must remain `width=device-width, initial-scale=1`.
- The page itself must never scroll horizontally at 320 px or wider. Wide code and tables may use a clearly bounded local scroller.
- Interactive targets must be at least 44 × 44 CSS pixels with at least 8 px separation.
- Fixed or sticky elements must respect safe-area insets and must not cover focused or anchored content.
- Navigation must expose the same destinations on mobile and desktop. The mobile menu must announce its expanded state and support keyboard dismissal.
- Every user-facing string must ship in both Simplified Chinese and English. The global one-click language switch must preserve the current route, persist the choice, update document language metadata, and must not create overflow when labels grow.
- Typography must tolerate 200% zoom without clipped controls, hidden content, or loss of function.
- Images and decorative graphics must declare stable dimensions or aspect ratios to avoid layout shift.
- Orientation changes must not require a reload and must preserve navigation state.

## Accessibility and motion

- Meet WCAG 2.2 AA contrast: 4.5:1 for normal text and 3:1 for large text and essential graphics.
- Keep semantic landmarks and a sequential heading hierarchy. Every page has exactly one primary `h1`.
- Preserve visible focus rings and logical DOM/tab order. All core tasks must work from a keyboard.
- Include a skip link and move focus to the main region after client-side route changes.
- Never communicate status by color alone. Icons are supplemental and need accessible names when they convey meaning.
- Respect `prefers-reduced-motion: reduce`; transitions must be removable without hiding information.
- Respect `prefers-contrast: more` and forced-colors mode where practical.

## Required review gate

Before merging a website change:

1. Run `npm run check` from `website/`.
2. Inspect the affected pages at 375, 768, 1024, and 1440 px widths.
3. Inspect one mobile landscape viewport.
4. Navigate the affected flow by keyboard only.
5. Test reduced motion and 200% browser zoom.
6. Confirm there is no page-level horizontal overflow.
7. Switch the entire affected flow between Chinese and English at every tested width.

Reviewers should reject a page change when evidence covers only a single desktop screenshot.
