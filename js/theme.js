window.initializeTheme = () => {
    const themeSwitchBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themeSwitchText = themeSwitchBtn ? themeSwitchBtn.querySelector('.theme-switch-text') : null;

    // Function to apply the theme and update the switch button
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeSwitchBtn.classList.add('light-mode-btn');
            themeSwitchBtn.classList.remove('dark-mode-btn');
            if (themeSwitchText) themeSwitchText.textContent = window.i18n.translate('theme_light_mode');
        } else {
            body.classList.remove('dark-mode');
            themeSwitchBtn.classList.add('dark-mode-btn');
            themeSwitchBtn.classList.remove('light-mode-btn');
            if (themeSwitchText) themeSwitchText.textContent = window.i18n.translate('theme_dark_mode');
        }
    };

    // Event listener for the switch button
    if (themeSwitchBtn) {
        themeSwitchBtn.addEventListener('click', () => {
            const currentTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
            applyTheme(currentTheme);
            localStorage.setItem('theme', currentTheme);
        });
    }

    // Expose a function to set the initial theme after translations are loaded
    window.setInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            applyTheme('light'); // Default to light theme.
        }
    };
};
