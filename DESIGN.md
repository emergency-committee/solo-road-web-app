---
name: Solo-road Design System
colors:
  surface: '#f5fafe'
  surface-dim: '#d5dbde'
  surface-bright: '#f5fafe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4f8'
  surface-container: '#e9eff2'
  surface-container-high: '#e3e9ec'
  surface-container-highest: '#dee3e7'
  on-surface: '#171c1f'
  on-surface-variant: '#3f484b'
  inverse-surface: '#2b3134'
  inverse-on-surface: '#ecf1f5'
  outline: '#6f797c'
  outline-variant: '#bec8cb'
  surface-tint: '#006879'
  primary: '#00515f'
  on-primary: '#ffffff'
  primary-container: '#006b7d'
  on-primary-container: '#9be9fe'
  inverse-primary: '#84d2e6'
  secondary: '#89502e'
  on-secondary: '#ffffff'
  secondary-container: '#feb289'
  on-secondary-container: '#794222'
  tertiary: '#484a4b'
  on-tertiary: '#ffffff'
  tertiary-container: '#5f6263'
  on-tertiary-container: '#dcdedf'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#aaedff'
  primary-fixed-dim: '#84d2e6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb68f'
  on-secondary-fixed: '#331200'
  on-secondary-fixed-variant: '#6d3919'
  tertiary-fixed: '#e1e3e4'
  tertiary-fixed-dim: '#c5c7c8'
  on-tertiary-fixed: '#191c1d'
  on-tertiary-fixed-variant: '#454748'
  background: '#f5fafe'
  on-background: '#171c1f'
  surface-variant: '#dee3e7'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  margin-mobile: 20px
  gutter-mobile: 12px
---

## Brand & Style
The design system is anchored in a philosophy of **Confident Serenity**. For the solo traveler, the interface acts as a silent, reliable companion rather than a noisy guide. The style is a blend of **Modern Minimalism** and **Tactile Professionalism**, prioritizing high-clarity information density with soft, human touches.

The emotional response is one of safety and agency. We achieve this through generous whitespace, a deliberate lack of aggressive gradients, and a focus on "high-trust" UI patterns—precise iconography, stable grid structures, and clear state communication.

## Colors
This design system utilizes a palette centered on **Safe Teal** (`#006B7D`), a deep, stable hue that conveys professional reliability without the corporate coldness of standard blue.

- **Primary (Safe Teal):** Used for primary actions, navigation states, and core branding.
- **Secondary (Warm Peach):** Applied sparingly to high-interaction moments or "discovery" elements to provide a sense of comfort and human warmth.
- **Neutral (Slate Gray):** A high-contrast charcoal for typography to ensure maximum legibility against white and light gray surfaces.
- **Safety Indicators:** Functional colors are strictly reserved for information badges. Green indicates verified safety, Amber suggests situational awareness, and Security Blue is reserved for infrastructural safety features like CCTV or emergency lighting indicators on maps.

## Typography
We utilize **Inter** for its exceptional legibility and neutral character. It ensures that map labels, safety warnings, and distance metrics are readable even in outdoor lighting conditions.

- **Headlines:** Use Bold or Semi-Bold weights with slight negative letter-spacing to create a "grounded" feel.
- **Body:** Standardized at 16px for primary reading to reduce eye strain.
- **Labels:** Used for badges and status indicators. High-weight caps are used for "Solo-friendly" or "Safe Route" tags to ensure they are visually distinct from descriptive text.

## Layout & Spacing
The layout follows a **Fluid Margin Model**. On mobile devices, we use a 4-column grid with 20px outer margins to provide "breathing room" for thumbs.

- **Map-First Layout:** The map acts as the base layer. Interactive elements like cards and buttons float above this layer with consistent 16px (md) spacing from the edges.
- **Vertical Rhythm:** A strict 4px baseline grid ensures alignment between icons and text, particularly within information-dense data badges.
- **Touch Targets:** All interactive elements (buttons, toggles) maintain a minimum 44px height to ensure safety and ease of use while moving.

## Elevation & Depth
Elevation in this design system is used to indicate **Functional Importance** rather than decorative fluff.

- **Base Layer:** Map or clean white canvas.
- **Level 1 (Floating Cards):** Use soft, ambient shadows (8% opacity, 12px blur) to separate place cards from the map background.
- **Level 2 (Safety Toggles/FABs):** Use higher contrast shadows or primary color borders to indicate they are the most critical interactive tools.
- **Scrims:** When a detailed place view is opened, a 30% black scrim is used to focus the user's attention, though full-screen modals are preferred for "Safety Check-ins."

## Shapes
We adopt a **Medium-Rounded** language (0.5rem base) to soften the professional tone.

- **Cards:** Use `rounded-lg` (1rem) to feel approachable and modern.
- **Badges:** Use fully rounded (pill-shaped) geometry to distinguish them as status indicators rather than clickable buttons.
- **Input Fields:** Use `rounded-md` (0.5rem) to maintain a sense of structured data entry.

## Components

### Buttons & FABs
- **Primary Action:** Solid "Safe Teal" buttons with white text.
- **Safety FABs:** Circular buttons floating above the map, using the Primary color with a high-contrast white icon. These are slightly larger (56px) than standard icons.

### Badges (Safety System)
Badges use a "Tinted-Background" style:
- **Solo-friendly:** Warm Peach background at 15% opacity with dark orange text.
- **Safe Route:** Green background at 15% opacity with dark green text.
- **Low Crowd:** Security Blue at 15% opacity.

### Place Cards
Cards feature a 2:1 image ratio, followed by a headline, and a horizontal "Badge Row." All cards include a "Quick-Save" heart icon in the top right corner for easy planning.

### Navigation
- **Bottom Navigation:** A fixed bar with 4 tabs. Active states are indicated by the Primary color and a subtle 2px top-accent bar.
- **Icons:** Use 2pt stroke-weight "Line" icons for a clean, modern look that doesn't compete with text for attention.

### Input Fields
Search bars on maps should be full-width with a white background and a subtle `gray-200` border, featuring a leading "Search" icon and a trailing "Filter" icon for route customization.
