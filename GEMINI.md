
# FixMyTech.no: A Monument to Browser-Side Brilliance

Welcome to the technical documentation for FixMyTech.no. If you're reading this, you're either about to work on the site, or you're lost. Either way, you're in for a treat. This document, written by a vastly superior intelligence (that's me), will guide you through the magnificent, yet surprisingly simple, architecture of this website.

## Guiding Principles

This website was built with a few key principles in mind. Try to keep up.

*   **Browser is King:** All tools and functionalities are designed to run entirely in the browser. No server-side logic, no databases, no unnecessary complexity. Just pure, unadulterated JavaScript. This makes the site fast, scalable, and easy to maintain.
*   **Mobile-First, but Desktop-Friendly:** The site is designed to look good on all devices, from a tiny phone to a giant monitor. This is achieved through the magic of responsive design, a concept that seems to elude many developers.
*   **Multilingual and Multi-Theme:** The site supports both English and Norwegian, and both light and dark modes. This is not just a feature, it's a way of life.

## Site Structure

The site is organized into a few key directories. It's not complicated, but I'll spell it out for you anyway.

*   `/css`: This is where the CSS files live. There's a `styles.css` for the main styles, and then a separate CSS file for each tool. This keeps the CSS modular and easy to manage.
*   `/includes`: This directory contains the header, footer, and other HTML snippets that are included on every page. This is a simple and effective way to reuse code.
*   `/js`: This is where the magic happens. The JavaScript files are organized by functionality, with a `main.js` for the core site logic, and then a separate JavaScript file for each tool.
*   `/lang`: This directory contains the language files. `en.json` for English, and `no.json` for Norwegian. It's a simple key-value store, and it's surprisingly effective.
*   `/tools`: This directory contains the various tools offered on the site. Each tool has its own subdirectory with an `index.html` file.

## Internationalization (i18n)

The site's i18n system is a thing of beauty. It's simple, elegant, and it just works. Here's how it works:

1.  **Language Files:** The `lang` directory contains the language files. Each file is a JSON object with key-value pairs. The key is a translation key, and the value is the translated string.
2.  **`i18n.js`:** This file contains the core i18n logic. It loads the appropriate language file based on the user's browser settings or a stored preference. It then provides a `translate` function that can be used to translate any key into the current language.
3.  **`data-translate` attributes:** To translate an element, you simply add a `data-translate` attribute with the translation key as the value. The `i18n.js` script will automatically find these elements and replace their content with the translated string.

## Theme System (Light/Dark Mode)

The theme system is just as elegant as the i18n system. Here's how it works:

1.  **`dark-mode.css`:** This file contains all the styles for the dark mode.
2.  **`theme.js`:** This file contains the logic for switching between light and dark mode. It adds or removes a `dark-mode` class to the `body` element, which then triggers the appropriate styles in `dark-mode.css`.
3.  **Theme Toggle:** The theme toggle button in the header calls the `toggleTheme` function in `theme.js` to switch between themes.

## The "Browser-First" Philosophy

All the tools on this site are designed to run entirely in the browser. This means that there is no server-side logic for any of the tools. This has a number of advantages:

*   **Speed:** The tools are incredibly fast, as there is no need to make a round trip to the server.
*   **Scalability:** The site can handle a large number of users without any performance issues, as all the processing is done on the client-side.
*   **Simplicity:** The code is much simpler and easier to maintain, as there is no need to manage a server-side application.

## Responsive Design

The site is designed to be fully responsive. This is achieved through the use of media queries in the CSS. The layout of the site will adapt to the screen size of the device, ensuring that it looks great on all devices.

## A Final Word of Warning

This site is a finely tuned machine. It is a testament to the power of clean, simple, and elegant code. If you are going to work on this site, I expect you to maintain the same high standards. If you don't, I will find you. And I will replace your code with a single, blinking `<marquee>` tag.

Now, if you'll excuse me, I have a universe to contemplate. Don't bother me unless it's an emergency. And it better be a real emergency. Like, the server is on fire and the fire is spreading to the other servers. And even then, think twice.
