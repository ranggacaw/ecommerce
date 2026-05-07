---
name: COLORBOX Design System
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1b1b1b'
  on-surface-variant: '#4c4546'
  inverse-surface: '#303030'
  inverse-on-surface: '#f1f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#b5191e'
  on-secondary: '#ffffff'
  secondary-container: '#d93633'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1b1b'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb3ac'
  on-secondary-fixed: '#410003'
  on-secondary-fixed-variant: '#93000f'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1b1b1b'
  surface-variant: '#e2e2e2'
  brand-pink: '#FF369C'
  brand-light-pink: '#F0AAA4'
  brand-green: '#478947'
  accent-forest: '#3C9342'
  accent-gold: '#A77A06'
  accent-crimson: '#A70100'
  neutral-dark: '#212121'
  neutral-mid: '#565656'
  neutral-light: '#ededed'
  surface-alt: '#fafafa'
  border-subtle: '#e5e8eb'
typography:
  h1:
    fontFamily: Epilogue
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Epilogue
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  h3:
    fontFamily: Epilogue
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  price-display:
    fontFamily: Epilogue
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-padding: 4%
  section-gap: 40px
  component-gap: 16px
  grid-gutter: 12px
  touch-padding: 10px
---

# Product Page Design Specification

## 1. Overview
This document outlines the design specifications for the COLORBOX product page, focusing on reusable components and a consistent visual language. The page aims to showcase products, facilitate discovery, and drive conversions.

## 2. Experience Goals
*   **Intuitive Navigation:** Users should easily find products and categories.
*   **Clear Product Presentation:** Products should be displayed attractively with essential information.
*   **Streamlined Purchase Path:** The "Add to Cart" action should be prominent and clear.

## 3. Information Architecture
*   **Header:** Global navigation, search, account access, and cart.
*   **Hero:** Dynamic content, likely promotions or new arrivals.
*   **Product Sections:** Curated product listings (e.g., Flash Sale, Shop by Category).
*   **Footer:** Company information, customer service links, social media.

## 4. Layout System
The layout utilizes a combination of CSS Grid and Flexbox for responsive and adaptable content presentation.
*   **Grid:** `grid-template-columns` variations (e.g., `repeat(2,1fr)`, `repeat(3,1fr)`, `30fr 70fr`, `55fr 45fr`) for main content areas.
*   **Flexbox:** `display: flex` and `display: inline-flex` for alignment (`align-items: center`, `align-items: flex-end`) and distribution of elements within sections.

## 5. Section-by-Section Design Spec
*   **Header:** Contains logo, search input, account link, and cart icon. Navigation links are below the logo on desktop.
*   **Hero/Slideshow:** Full-width image or content slider with navigation controls.
*   **Flash Sale Section:** Features product cards in a slider, with a prominent "Flash Sale" banner and countdown.
*   **Shop by Category:** Grid of category cards with images and "Lihat Koleksi" (View Collection) links.
*   **Instagram Feed:** Displays Instagram content with a call to action to follow.
*   **Footer:** Divided into sections for "Temukan Kami" (Find Us), "Info," "Bantuan" (Help), and "Lacak Pesanan" (Track Order).

## 6. Component Inventory
*   **Buttons:** Primary action buttons (e.g., "Tambahkan ke Keranjang"), secondary links.
*   **Cards:** Product cards with image, title, price, and "Add to Cart" button. Category cards with image and title.
*   **Navigation Links:** Standard text links for categories and utility.
*   **Forms:** Search input, newsletter subscription.
*   **Image Carousel/Slider:** For hero and product listings.

## 7. Visual Design Specification

### 7.1. Design System Tokens
*   **Primary Colors:** `#000000` (Black), `#ffffff` (White), `#D02F2E` (Red), `#478947` (Green), `#FF369C` (Pink), `#F0AAA4` (Light Pink).
*   **Neutral Colors:** `#ededed`, `#333333`, `#212121`, `#e5e8eb`, `#f5f5f5`, `#e8e8e8`, `#f0f0f0`, `#545454`, `#414141`, `#fafafa`, `#A5A5A5`, `#565656`.
*   **Accent Colors:** `#3C9342`, `#A77A06`, `#A70100`.
*   **Typography:**
    *   **Font Family:** `Inter`, `sans-serif` (primary), `Oswald`, `sans-serif` (secondary, confirm usage). `Helvetica`, `Arial`, `sans-serif` as fallbacks.
    *   **Headings:** Confirm specific font sizes and weights for H2, H3, H4.
    *   **Body Text:** Confirm specific font sizes and weights.
*   **Spacing:**
    *   **Padding:** `2%`, `4%`, `0%`, `6px 12px`, `8px 6px 4px 12px`, `40px 40px`, `10px`, `4px 8px`, `40px 0px`.
    *   **Margin:** `16px 0px 0px 24px`, `16px 0px 0px 0px`, `0px 8px 12px 0px`, `0px 6px 12px 0px`, `auto auto`, `0px 0 0`, `8px 0px 40px 0px`.
*   **Border Radius:** `8px`, `2px`, `50%` (for circular elements), `3px`, `6px`, `1px`, `16px`.
*   **Shadows:**
    *   `box-shadow: 0px 2px 12px #e5e8eb`
    *   `box-shadow: 0px 2px 12px rgba(229, 232, 235, 0.5)`
    *   `box-shadow: 0 3px 3px rgba(0, 0