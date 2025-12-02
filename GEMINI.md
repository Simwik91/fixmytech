# 2. CURRENT PROJECT CONTEXT

## Project Hosting Context

These projects are live domains on the internet.

-   **Hosting:** The websites are hosted using a combination of **GitHub Pages** (for serving the static files) and **Cloudflare** (for DNS, caching, and other services).
-   **Domain Registrar:** The domain names were acquired from **domene.shop**.

This context is important for any operations that might affect the live sites.

## Project Structure Guidelines

To maintain project clarity and ease of navigation, the following structure guidelines should be followed.

-   **Root Folder:** This is where the core components reside. You'll find:
    -   `GEMINI.md`: Project-specific context and instructions for the AI assistant.
    -   `favicon.ico` / `favicon.png`: The site's favicon.
    -   `CNAME`: Defines the custom domain for GitHub Pages.
    -   `index.html`: The main entry point of the website.
    -   `robots.txt`: Instructions for web crawlers.
    -   `sitemap.xml`: A map of the site for search engines.
    -   `server.py`: A simple Python script to run a local HTTP server for development.
-   **`/css` Folder:** All stylesheets go here, split into modules for maintainability.
-   **`/js` Folder:** All JavaScript files go here, split into modules for maintainability.
-   **`/images` Folder:** Contains all image assets.
-   **`/includes` Folder:** Contains shared HTML components like headers and footers to ensure reusability.

Adhering to this structure makes projects easier to navigate and maintain.

## Recent Project Updates (December 2025)

This section details recent significant changes and new implementations, divided into two phases.

---

### Phase 1: Initial Setup & Core Functionality (Cookie Consent & Layout)

#### Cookie Consent Implementation
-   **Initial Implementation:** A new, Norwegian GDPR-compliant cookie consent banner and settings modal was implemented. This included the creation of `includes/cookie-consent.html`, `css/cookie-consent.css`, and the initial `js/cookie-consent.js`.
-   **Robust Refactoring:** The `cookie-consent.js` script was significantly refactored to be a self-contained module that fetches its own HTML on-demand. This "lazy loading" approach resolves a critical race condition and ensures the cookie settings modal is available globally and reliably on all sub-pages.
-   **Expanded Options:** The consent banner was updated to include an "Accept necessary only" option, providing users with more granular choice from the first interaction.

#### Technical Enhancements & Fixes
-   **Global Relative Paths:** All absolute URLs in `index.html` and all sub-page HTML files (`lisenser/`, `om/`, `personvern/`, `vilkår/`) were converted to root-relative paths (e.g., `/css/styles.css`) to improve local development compatibility and site portability.
-   **Character Encoding Fix:** The local development server (`start_server.py`) was modified to explicitly send `Content-Type: text/html; charset=utf-8` headers, resolving issues with garbled Norwegian characters.

#### UI/UX Improvements
-   **Layout Overhaul (Pricing & Contact):** The "Priser og Betingelser" and "Kontakt Oss" sections on the main page were changed from a side-by-side layout to a stacked, single-column layout for improved readability.
-   **Spacing & Alignment Standardization:** A comprehensive pass was done to normalize spacing. Top padding for all page headers was standardized to `8rem`, and gaps/margins for card grids were made consistent.
-   **Card Hover Effects:** A "pop" hover effect (lift and shadow) was added to the `.pricing-card` and `.contact-section` to match the interactive feel of other cards.
-   **Icon Updates:** Outdated Font Awesome 4/5 icon class names were upgraded to their Font Awesome 6 equivalents.

---

### Phase 2: UX & Engagement Features

#### Interactive "Problem Solver" FAQ
-   **Implementation:** A new interactive FAQ section with an accordion interface was added to the homepage under the title "Hva er problemet?".
-   **Functionality:** Custom JavaScript was added to `js/main.js` to handle the accordion's open/close state, ensuring only one panel is open at a time for a cleaner user experience.
-   **Content Expansion:** The section was populated with common user problems, including cases that would require sending in hardware, to act as a helpful triage tool for potential clients.

#### Prominent Call-to-Action (CTA) Banner
-   **Implementation:** A new, visually distinct CTA banner was added to the homepage after the main services grid.
-   **Low-Friction Options:** The banner provides two clear options: a primary button to scroll to the main contact form ("Få et gratis tilbud") and a secondary, lower-friction `mailto:` link for users who just want to "Still et raskt spørsmål" (Ask a quick question).

#### "About Us" Page Refinement
-   **Design Iteration:** A "Meet the founder" section was added to the `om/index.html` page to humanize the brand. Upon review, this section was subsequently removed at the user's request to maintain a more direct and service-focused narrative. The corresponding CSS was also removed.
