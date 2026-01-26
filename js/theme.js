window.initializeTheme = () => {
    const body = document.body;
    const themeOptionsContainer = document.getElementById('theme-options');

    // Function to apply the theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
        }
        updateActiveThemeOption(theme);
    };

    // Function to update the active theme option
    const updateActiveThemeOption = (theme) => {
        const activeLinks = themeOptionsContainer.querySelectorAll('.active');
        activeLinks.forEach(link => link.classList.remove('active'));

        const newActiveLink = themeOptionsContainer.querySelector(`[data-theme="${theme}"]`);
        if (newActiveLink) {
            newActiveLink.classList.add('active');
        }
    };

    // Function to populate the theme options
    const populateThemeOptions = () => {
        if (!themeOptionsContainer) return;
        themeOptionsContainer.innerHTML = ''; // Clear existing content

        const themes = [
            { name: 'theme_light_mode', value: 'light' },
            { name: 'theme_dark_mode', value: 'dark' }
        ];

        themes.forEach(theme => {
            const link = document.createElement('a');
            link.href = 'javascript:void(0);';
            link.textContent = window.i18n.translate(theme.name);
            link.setAttribute('data-theme', theme.value);
            link.onclick = () => {
                applyTheme(theme.value);
                localStorage.setItem('theme', theme.value);
            };
            themeOptionsContainer.appendChild(link);
        });
    };

    // Expose a function to set the initial theme after translations are loaded
    window.setInitialTheme = () => {
        populateThemeOptions();
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
    };
};