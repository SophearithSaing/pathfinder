---
name: Academic Precision
colors:
  surface: '#faf9f7'
  surface-dim: '#dadad8'
  surface-bright: '#faf9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f1'
  surface-container: '#efeeec'
  surface-container-high: '#e9e8e6'
  surface-container-highest: '#e3e2e0'
  on-surface: '#1a1c1b'
  on-surface-variant: '#44474c'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#525f74'
  primary: '#172436'
  on-primary: '#ffffff'
  primary-container: '#2d3a4d'
  on-primary-container: '#96a4bb'
  inverse-primary: '#bac7df'
  secondary: '#674bb5'
  on-secondary: '#ffffff'
  secondary-container: '#ab8ffe'
  on-secondary-container: '#3f1e8c'
  tertiary: '#302106'
  on-tertiary: '#ffffff'
  tertiary-container: '#483619'
  on-tertiary-container: '#b99f7a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3fc'
  primary-fixed-dim: '#bac7df'
  on-primary-fixed: '#0e1c2e'
  on-primary-fixed-variant: '#3a475b'
  secondary-fixed: '#e8ddff'
  secondary-fixed-dim: '#cebdff'
  on-secondary-fixed: '#21005e'
  on-secondary-fixed-variant: '#4f319c'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29b'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#faf9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e3e2e0'
typography:
  display-lg:
    fontFamily: EB Garamond
    fontSize: 48px
    fontWeight: '500'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: EB Garamond
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-md:
    fontFamily: EB Garamond
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: EB Garamond
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  display-lg-mobile:
    fontFamily: EB Garamond
    fontSize: 36px
    fontWeight: '500'
    lineHeight: 44px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1120px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

This design system moves away from high-velocity tech aesthetics toward a "Modern Scholar" personality. The goal is to evoke a sense of quiet authority, intellectual rigor, and archival quality. It is designed for researchers, writers, and thinkers who value focus over distraction.

The visual style is a blend of **Minimalism** and **Modern Corporate**, utilizing heavy whitespace to simulate the margins of a well-designed book. The atmosphere is established through high-contrast typography and a "paper-first" philosophy, where the interface feels like a tangible, high-quality material rather than a digital backlight. Precision is conveyed through thin strokes, architectural alignment, and a rejection of unnecessary decoration.

## Colors

The palette is anchored by "Scholar Blue" (#2D3A4D), a muted, sophisticated navy that replaces the aggressive saturation of standard SaaS blues. This primary shade is used intentionally for navigation, key actions, and structural anchors to provide a sense of stability.

The background uses a curated "Off-White" (#F9F8F6) to reduce eye strain and mimic the warmth of premium paper stock. Accents are kept minimal, with secondary colors reserved only for specific status indicators or rare interactive highlights. Functional grays are cool-toned to maintain a crisp, professional environment.

## Typography

The typographic strategy relies on a traditional "Scholar" contrast. **EB Garamond** is the voice of the system, used for all significant headings to provide an intellectual, editorial feel. It should be typeset with generous leading to allow the elegant serifs to breathe.

**Hanken Grotesk** serves as the functional workhorse for body copy, data, and UI labels. Its contemporary, clean geometry ensures legibility at small sizes and provides a sharp, modern counterpoint to the classical nature of the serif headings. For small labels and metadata, use uppercase styling with increased letter spacing to evoke the look of a printed index.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to maintain a "columnar" feel reminiscent of academic journals. Content is centered with wide gutters, ensuring that line lengths for reading never exceed an optimal 700px width.

The spacing rhythm is disciplined, based on an 8px modular scale. Use generous vertical padding between sections to create a sense of "chapter breaks." On mobile, margins shrink to 16px, but the typographic hierarchy remains primary, ensuring that the "paper" feel persists even on smaller screens.

## Elevation & Depth

This system avoids heavy drop shadows in favor of **Tonal Layers** and **Low-Contrast Outlines**. Depth is communicated through subtle shifts in background color (e.g., a white card on an off-white surface) and thin 1px borders.

Where elevation is strictly necessary for interactivity (such as menus or modals), use a "Printed Shadow"—an extremely faint, neutral gray with a large blur radius and zero spread, suggesting a sheet of paper hovering slightly above the desk. Avoid any color-tinted shadows or high-opacity blurs that feel too "digital."

## Shapes

The shape language is defined by **Soft** precision. A 4px (0.25rem) corner radius is the standard for cards and inputs, providing just enough softening to feel approachable while maintaining the architectural structure of the layout. 

Interactive elements like buttons should never be pill-shaped; they must remain rectangular with the standard 4px radius to reinforce the sense of a structured document.

## Components

### Buttons
Primary buttons use the Scholar Blue background with white text. Secondary buttons utilize a thin 1px border with the primary blue text. Labels are always Hanken Grotesk, Semi-Bold.

### Input Fields
Inputs are characterized by 1px borders in a soft gray. On focus, the border transitions to Scholar Blue. Labels sit strictly above the field in uppercase label-md styling to mimic form-based archival documents.

### Cards
Cards are primarily defined by their background color (White) against the system background (Off-White). They should feature a subtle 1px border rather than a shadow.

### Chips & Tags
Use rectangular shapes with no more than 2px of rounding. Backgrounds should be very light gray or a faint tint of the accent color to keep them from drawing too much attention away from the primary text.

### Lists
Lists should be treated with editorial care. Use thin horizontal dividers and ample vertical padding. For "Modern Scholar" lists, consider using serif numerals for ordered lists to emphasize the classic influence.