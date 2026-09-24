# Design system

## 1. Design intent

VeriLabel is designed as a calm, inspection-oriented workspace: clear hierarchy, compact evidence cards, explicit status colours, and short actions. The interface should feel trustworthy without implying that a prototype result is an official decision.

The existing light theme is the reference visual language. Dark mode is an independent theme with its own surface, border, text, control, status, and hover values. Layout, content, and interaction behaviour remain shared between themes.

## 2. Visual foundations

### Light theme

The light palette uses a very pale lilac application surface, white cards, navy headings, muted slate body text, blue primary actions, and soft lavender secondary surfaces. The primary values are:

| Token | Value | Use |
| --- | --- | --- |
| `--surface` | `#faf8ff` | Page background |
| `--card` | `#ffffff` | Raised cards and dialogs |
| `--surface-raised` | `#f2f3ff` | Inner sections |
| `--surface-soft` | `#e2e7ff` | Secondary controls and icon wells |
| `--text` | `#131b2e` | Headings and primary text |
| `--muted` | `#434655` | Supporting copy |
| `--border` | `#c3c6d7` | Card and control borders |
| `--primary` | `#004ac6` | Primary action and link colour |

### Dark theme

Dark mode uses deep navy surfaces rather than an inverted white palette. Cards remain visually distinct from the page, muted text is lifted for readability, and status backgrounds use dark tinted surfaces with lighter text and borders:

| Token | Value | Use |
| --- | --- | --- |
| `--surface` | `#0d1526` | Page background |
| `--card` | `#142038` | Raised cards and dialogs |
| `--surface-raised` | `#17243b` | Inner sections |
| `--surface-soft` | `#203c72` | Secondary controls and icon wells |
| `--text` | `#eef2ff` | Headings and primary text |
| `--muted` | `#b8c4dc` | Supporting copy |
| `--border` | `#334563` | Card and control borders |
| `--primary` | `#8cb2ff` | Primary link and focus colour |

Success, danger, and warning tokens also have separate light and dark values. New components should use semantic variables rather than embedding a colour that only works in one theme.

## 3. Typography

- Body text uses the Inter system stack defined by `--font-sans`.
- Display headings use Plus Jakarta Sans through `--font-display`.
- IDs, references, and technical values may use the JetBrains Mono stack.
- Headings should be short and strongly weighted; supporting text should be smaller, relaxed, and muted without becoming low contrast.
- Hindi and Marathi use the bundled Devanagari font support. Preserve the `VeriLabel` brand spelling and the Hindi transliteration `एवरी लेबल, वेरिफाइड।`.

## 4. Layout and responsive behaviour

The application uses a centered content column with responsive horizontal padding. Cards use rounded corners, restrained shadows, and clear section spacing. The header remains the shared navigation surface; there is no bottom navigation bar.

Responsive rules:

- Dashboard actions stack on narrow screens and sit side-by-side when space allows.
- Scanner controls remain full-width and touch-friendly.
- Team cards use one column on narrow screens, two columns on medium screens, and three on wide screens.
- Officer tables use horizontal overflow rather than shrinking critical columns into unreadable text.
- Dialogs and the assistant remain usable at mobile widths and preserve safe-area spacing around the floating action.
- Long translated strings should wrap rather than force horizontal overflow.

## 5. Component patterns

### Header and controls

The header contains the brand, back/navigation affordance, language selector, theme toggle, and role-appropriate profile/logout behaviour. Controls need visible labels or accessible names, keyboard focus, and a hover/focus state in both themes.

### Dashboard actions

`DashboardActions` is the shared source for the two primary entry points: **Scan the Product** and **Meet the Team**. The primary action uses the blue action treatment; the team action uses a soft secondary surface and a people icon. Keep their order, spacing, and behaviour identical across customer and officer entry points.

### Scanner

The scanner uses a dark viewfinder, corner alignment marks, a selected-product label, an animated processing cue, and bounding boxes. The dark viewfinder is intentional and independent from the application theme. Result cards below it use theme-aware surfaces and readable status colours.

### Results

Results are divided into violations and compliant elements. Red/pink-tinted surfaces communicate findings, green surfaces communicate fixture-passed elements, and amber is reserved for warnings or lower-severity attention. Every status must also have text; colour alone is not sufficient.

### Team cards

Team cards preserve the requested member order and local photos. Social links are paired controls at the bottom of each card. Missing profiles use a visible icon and an agreed placeholder rather than borrowing another member’s link.

### Assistant

The assistant is a bottom-right circular FAB with a modal dialog. The dialog uses a raised theme-aware card, an input with explicit placeholder contrast, a disabled state for empty questions, an answer region with `aria-live`, and a source link when a match is found.

## 6. Contrast and interaction states

For every text-bearing element, verify the background at rest, hover, active, disabled, and focus states. Pay special attention to:

- headings inside lavender explanation cards;
- step titles such as “1. User Captures Image”;
- muted descriptions and table metadata;
- placeholder text and select options;
- status badges and small labels;
- white text on primary buttons; and
- icon-only buttons such as close, theme, and assistant controls.

The four “What VeriLabel Does” step titles and their descriptions must be readable in both themes. A fixed white title on a light card is a regression; a fixed dark title on a dark card is also a regression.

## 7. Accessibility expectations

- Use real buttons for actions and links for navigation.
- Keep visible focus rings and meaningful `aria-label` values on icon-only controls.
- Use form labels or accessible labels for inputs and selects.
- Keep dialog semantics (`role="dialog"`, `aria-modal`, labelled heading) intact.
- Announce asynchronous result/status changes through visible status text or live regions.
- Preserve text equivalents for status colours and icons.
- Keep touch targets comfortable and avoid relying on hover-only information.

## 8. Motion and feedback

Motion is restrained: button press scale, hover elevation, scanner progress, and a small success confetti cue. Do not make animation required to understand a result. Keep processing copy visible and ensure a completed state is reachable even if the user cannot perceive motion.


