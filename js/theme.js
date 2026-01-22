window.initializeTheme = () => {
    const themeSwitchBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const themeSwitchText = themeSwitchBtn ? themeSwitchBtn.querySelector('.theme-switch-text') : null;
    const themeSwitchIcon = themeSwitchBtn ? themeSwitchBtn.querySelector('i') : null;

    // Function to apply the theme and update the switch button
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeSwitchBtn.classList.remove('light-mode-btn');
            themeSwitchBtn.classList.add('dark-mode-btn');
            if (themeSwitchText) themeSwitchText.textContent = 'Lys modus';
            if (themeSwitchIcon) {
                themeSwitchIcon.classList.remove('fa-moon');
                themeSwitchIcon.classList.add('fa-sun');
            }
        } else {
            body.classList.remove('dark-mode');
            themeSwitchBtn.classList.remove('dark-mode-btn');
            themeSwitchBtn.classList.add('light-mode-btn');
            if (themeSwitchText) themeSwitchText.textContent = 'Mørk modus';
            if (themeSwitchIcon) {
                themeSwitchIcon.classList.remove('fa-sun');
                themeSwitchIcon.classList.add('fa-moon');
            }
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

    // --- Initial Theme Application ---
    const savedTheme = localStorage.getItem('theme');

    // Default to light theme if no preference is saved
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme('light'); // Default to light theme as requested.
    }
};
