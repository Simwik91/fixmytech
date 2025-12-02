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

This section details recent significant changes and new implementations:

### Cookie Consent Implementation
-   **Initial Implementation:** A new, Norwegian GDPR-compliant cookie consent banner and settings modal was implemented. This included the creation of `includes/cookie-consent.html`, `css/cookie-consent.css`, and the initial `js/cookie-consent.js`. The system provides granular control and a footer link to manage settings.
-   **Robust Refactoring:** The `cookie-consent.js` script was significantly refactored to be a self-contained module. It now fetches its own HTML on-demand, resolving a critical race condition that prevented it from working on sub-pages. This "lazy loading" approach ensures the settings modal is available globally and reliably.
-   **Expanded Options:** The consent banner was updated to include an "Accept necessary only" option, providing users with more granular choice from the first interaction.

### Technical Enhancements & Fixes
-   **Global Relative Paths:** All absolute URLs in `index.html` and all sub-page HTML files (`lisenser/`, `om/`, `personvern/`, `vilkår/`) have been converted to root-relative paths (e.g., `/css/styles.css`). This improves local development compatibility and site portability.
-   **Character Encoding Fix:** The local development server (`start_server.py`) has been modified to explicitly send `Content-Type: text/html; charset=utf-8` headers, resolving issues with garbled Norwegian characters (e.g., 'ø', 'å') in the browser.

### UI/UX Improvements
-   **Layout Overhaul (Pricing & Contact):** The "Priser og Betingelser" and "Kontakt Oss" sections on the main page have been changed from a side-by-side layout to a stacked, single-column layout for improved readability.
-   **Spacing & Alignment Standardization:**
    -   The top padding for all main "hero" sections across all pages (`index.html`, `om/index.html`, etc.) has been increased and standardized to `8rem` for a more spacious and consistent look.
    -   The spacing between card-based elements (`.process-steps`, `.services-grid`, etc.) has been standardized with a consistent `1.8rem` gap.
    -   Vertical margins and padding between various sections have been adjusted to create a more consistent rhythm.
-   **Card Hover Effects:** A "pop" hover effect (lift and shadow) was added to the `.pricing-card` and `.contact-section` to match the interactive feel of other cards on the site.
-   **Icon Updates:** Outdated Font Awesome 4/5 icon class names throughout the project have been upgraded to their Font Awesome 6 equivalents, ensuring all icons render correctly.
