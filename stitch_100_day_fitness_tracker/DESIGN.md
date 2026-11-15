---
name: Kinetic Obsidian
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2eb'
  on-surface-variant: '#e2bfb0'
  inverse-surface: '#e1e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#a98a7c'
  outline-variant: '#594136'
  surface-tint: '#ffb692'
  primary: '#ffb692'
  on-primary: '#562000'
  primary-container: '#ff6d00'
  on-primary-container: '#582100'
  inverse-primary: '#9f4200'
  secondary: '#bdf4ff'
  on-secondary: '#00363d'
  secondary-container: '#00e3fd'
  on-secondary-container: '#00616d'
  tertiary: '#00e475'
  on-tertiary: '#003918'
  tertiary-container: '#00b159'
  on-tertiary-container: '#003b19'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcb'
  primary-fixed-dim: '#ffb692'
  on-primary-fixed: '#341100'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#9cf0ff'
  secondary-fixed-dim: '#00daf3'
  on-secondary-fixed: '#001f24'
  on-secondary-fixed-variant: '#004f58'
  tertiary-fixed: '#62ff96'
  tertiary-fixed-dim: '#00e475'
  on-tertiary-fixed: '#00210b'
  on-tertiary-fixed-variant: '#005226'
  background: '#10131a'
  on-background: '#e1e2eb'
  surface-variant: '#32353c'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Chivo
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Chivo
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Chivo
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  metric-numeral-lg:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.04em
  metric-numeral-md:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  label-code:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-caps:
    fontFamily: Chivo
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies the disciplined, relentless energy of endurance and strength conditioning. Built for the '100 Days Push & Run Challenge', the personality is aggressive yet precise, high-performance, focused, and technologically elite. It eliminates casual lifestyle fluff in favor of an interface calibrated like an athlete’s telemetry display.

The aesthetic fuses **Precision Dark Minimalist** foundations with **Electric Cyber-Athletic** accents. Deep obsidian voids and carbon-slate planes create an immersive, distraction-free stadium, while luminous neon tokens deliver instant cognitive feedback for split-second stat checks during high-exertion workouts. Glassmorphic data badges and laser-sharp glowing accents convey kinetic momentum and premium athletic prestige.

## Colors

The palette operates on a strict functional hierarchy built on an absolute dark core:

- **Canvas & Structural Neutrals:**
  - Base Canvas: Obsidian Black (`#0B0E14`)
  - Elevated Container / Surface Base: Deep Slate (`#151922`)
  - Elevated Surface High: Charcoal Slate (`#1C222E`)
  - Border Outline & Subdued Dividers: Slate Stroke (`#232A38`)
  - Text Primary: Pure Ice (`#F8FAFC`)
  - Text Secondary / Muted: Slate Grey (`#94A3B8`)

- **Domain-Specific Chromatic Accents:**
  - **Strength & Push-ups (Primary):** Hyper Neon Orange (`#FF6D00`) with high-intensity Amber glow (`#FF5722`). Used for rep tracking, strength progression bars, and upper-body milestone indicators.
  - **Endurance & Telemetry (Secondary):** Electric Cyan (`#00E5FF`) and Speed Cobalt (`#0070F3`). Applied to mileage counters, pace split tables, GPS routes, and Strava integration status.
  - **Streaks & Recovery (Tertiary):** Vivid Emerald (`#00E676`). Reserved strictly for streak validation, challenge completion milestones, restorative zones, and affirmative micro-states.

Chromatic accents must not be used as wide flat fills; deploy them as hairline stroke borders, glow-casted active indicators, progress metrics, and high-visibility state chips.

## Typography

The typographic hierarchy bridges aerodynamic aggression with surgical legibility:

- **Display & Headlines (Space Grotesk):** Engineered geometry with high-velocity character cuts. Used for hero numbers, day trackers ("DAY 084 / 100"), and card titles.
- **Body & Continuous Copy (Chivo):** Grounded, crisp grotesk with high x-height ensuring immediate readability under physical fatigue.
- **Metrics & Telemetry (Space Mono & Tabular Figures):** All numbers (reps, kilometers, splits, pace, BPM) must strictly enable CSS `font-variant-numeric: tabular-nums lining-nums;` to guarantee static column widths during real-time animated increments.
- **Labels & Micro-headers:** Set in uppercase with expanded tracking (`0.08em` to `0.1em`) to create contrast against dynamic data metrics.

## Layout & Spacing

The layout operates on a 12-column responsive fluid grid designed around a modular telemetry dashboard:

- **Grid Architecture:**
  - Desktop (≥1200px): 12-column grid, max-width `1440px`, centered, `2rem` margins, `1.25rem` gutters.
  - Tablet (768px - 1199px): 8-column grid, `1.5rem` margins, `1rem` gutters.
  - Mobile (320px - 767px): 4-column grid, `1rem` margins, `0.75rem` gutters.

- **Stacking & Modular Flow:**
  - The challenge timeline, weekly telemetry, and dual daily targets (Push vs. Run) exist within 2-column or 3-column synchronized widget clusters on desktop, reflowing into vertical single-column execution streams on mobile.
  - Critical action zones (Log Push-ups, Sync Run) pin to persistent viewport anchors on mobile devices for friction-free single-thumb interaction.

## Elevation & Depth

Visual hierarchy utilizes a dark architectural stack reinforced by colored kinetic glows rather than naturalistic drop shadows:

- **Surface Tiers:**
  - Level 0 (Base Canvas): `#0B0E14` (Void).
  - Level 1 (Static Cards/Panels): `#151922` paired with a 1px border of `#232A38`.
  - Level 2 (Interactive/Hover Surfaces): `#1C222E` paired with a 1px border of `rgba(255, 255, 255, 0.12)`.
  - Level 3 (Glass Overlays & Modals): `rgba(21, 25, 34, 0.75)` with `backdrop-filter: blur(16px)` and top edge highlight `linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 100%)`.

- **Kinetic Glows:**
  - Push Metric Active State: `box-shadow: 0 0 24px -4px rgba(255, 109, 0, 0.25), 0 0 1px 1px rgba(255, 109, 0, 0.5);`
  - Run Metric Active State: `box-shadow: 0 0 24px -4px rgba(0, 229, 255, 0.25), 0 0 1px 1px rgba(0, 229, 255, 0.5);`
  - Streak Fire State: `box-shadow: 0 0 32px -6px rgba(0, 230, 118, 0.3), inset 0 0 12px rgba(0, 230, 118, 0.1);`

## Shapes

The form factor conveys technical precision and aerodynamic ergonomics:

- **Core Radius (`0.5rem` / 8px):** Applied to form controls, inputs, data cards, and sub-panels. Delivers a modern, machined finish without becoming playful.
- **Large Radius (`1rem` / 16px):** Reserved for primary dashboard containers, modal dialogs, and parent milestone widgets.
- **Pill Radius (`9999px`):** Used strictly for numeric telemetry tags, state chips, filter toggles, and primary CTA buttons to emulate athletic performance wearables and speed gear.

## Components

### Buttons
- **Primary Kinetic (Strength):** Solid `#FF6D00`, text `#0B0E14` (Font: Space Grotesk Bold). Pill-shaped (`rounded-full`), active hover brings amber edge bloom (`box-shadow: 0 0 20px rgba(255, 109, 0, 0.4)`).
- **Secondary Telemetry (Run):** Translucent cyan core (`rgba(0, 229, 255, 0.1)`), 1px solid `#00E5FF`, text `#00E5FF`. On hover: surface shifts to `rgba(0, 229, 255, 0.2)`.
- **Tertiary Utility:** Surface `#1C222E`, border `#232A38`, text `#F8FAFC`. Subtle transition to border `rgba(255, 255, 255, 0.2)`.

### Chips & Badges
- **Status Pills:** Compact height (`24px`), Space Mono uppercase label.
  - Active Streak: Emerald border (`#00E676`), tinted fill (`rgba(0, 230, 118, 0.08)`), pulsing dot indicator.
  - Strava Connected: Speed Cobalt border (`#0070F3`), filled with brand mark and tabular sync time.
  - Push Set Indicator: Hyper Orange subtle gradient border with tabular rep counter.

### Cards & Telemetry Containers
- **Dashboard Modules:** Background `#151922`, 1px border `#232A38`, radius `1rem`. Internal grid padding `1.5rem`.
- **Dual Challenge Splits:** Cards split vertically or horizontally using hairline borders (`#232A38`), featuring dual glow highlights (Orange for left/upper Push-up module, Cyan for right/lower Run module).

### Progress & Streaks
- **100-Day Matrix:** 10x10 modular cell grid. Uncompleted: `#1C222E`. Push complete: `#FF6D00`. Run complete: `#00E5FF`. Dual Complete: Emerald `#00E676` with radiant micro-glow.
- **Linear Trackers:** 6px track height, background `#1C222E`, fill using directional sports gradient with high-contrast leading edge pointer.

### Inputs & Number Steppers
- **Rep Incrementer:** Stepper buttons embedded inside elevated dark field (`#151922`), large centered Space Grotesk numbers (`32px`), flanked by large tactile touch targets with subtle haptic-style scale response (`transform: scale(0.96)` on tap).
- **Text Inputs:** Surface `#0B0E14`, border `#232A38`, text `#F8FAFC`. Focus state transitions border to `#00E5FF` with zero exterior ring blowout.