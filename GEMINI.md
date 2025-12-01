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
-   **Old Implementation Removed:** The previous cookie consent HTML (`includes/cookie-consent.html`), associated JavaScript from `js/main.js`, and CSS from `css/styles.css` were entirely removed to facilitate a fresh start.
-   **New Compliant System:** A new, Norwegian GDPR-compliant cookie consent banner and settings modal has been implemented.
    -   **HTML:** Encapsulated in `includes/cookie-consent.html`.
    -   **CSS:** New dedicated styles added to `css/styles.css`.
    -   **JavaScript:** All logic managed by a new modular script, `js/cookie-consent.js`, providing explicit consent, granular control over cookie categories (analytics, marketing), and a global function (`window.openCookieSettings()`) to reopen settings.
-   **Footer Integration:** A link in `includes/footer.html` now triggers the cookie settings modal.

### Technical Enhancements & Fixes
-   **Relative Paths:** All absolute URLs in `index.html` and `includes/header.html` (for `main.js`, `styles.css`, `favicon.ico`, and included HTML fragments) have been converted to relative paths for improved local development compatibility and robustness.
-   **Character Encoding Fix:** The local development server (`start_server.py`) has been modified to explicitly send `Content-Type: text/html; charset=utf-8` headers, resolving issues with garbled Norwegian characters (e.g., 'ø', 'å') in the browser.

### UI/UX Improvements
-   **Process Steps:** The "process-steps" section in `index.html` has been updated:
    -   The text "Gjennomføring og Levering" was shortened to "Gjennomføring".
    -   Numbered step indicators were replaced with visually appealing Font Awesome icons (`fa-file-signature`, `fa-clipboard-check`, `fa-truck-fast`), using a dedicated CSS style in `css/styles.css` for consistent appearance.
-   **Icon Updates:** Outdated Font Awesome 4/5 icon class names throughout the project (in `index.html`, `includes/header.html`, and `js/main.js`) have been upgraded to their Font Awesome 6 equivalents (e.g., `fa-exclamation-triangle` to `fa-triangle-exclamation`, `fa-shield-alt` to `fa-shield-halved`, `fa-history` to `fa-clock-rotate-left`, `fa-tools` to `fa-screwdriver-wrench`, `fa-times` to `fa-xmark`), ensuring icons render correctly.
-   **Problem Cards Layout:** The CSS for the `.problem-cards` section (`css/styles.css`) has been adjusted to display cards in a responsive 2-column grid on wider screens, preventing a single card from wrapping to a new line.
