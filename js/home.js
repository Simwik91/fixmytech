
document.addEventListener('DOMContentLoaded', function() {
    const toolsGrid = document.getElementById('tools-grid');
    const searchInput = document.getElementById('tool-search');

    // Fetch and display tools
    fetch('/tools/tools.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(tools => {
            displayTools(tools);

            // Search functionality
            searchInput.addEventListener('input', () => {
                const searchTerm = searchInput.value.toLowerCase();
                const filteredTools = tools.filter(tool => 
                    tool.category.toLowerCase().includes(searchTerm) || 
                    tool.description.toLowerCase().includes(searchTerm)
                );
                displayTools(filteredTools);
            });
        })
        .catch(error => {
            console.error('Error fetching tools:', error);
            toolsGrid.innerHTML = '<p class="error-message">Could not load tools. Please try again later.</p>';
        });

    function displayTools(tools) {
        toolsGrid.innerHTML = '';
        if (tools.length === 0) {
            toolsGrid.innerHTML = '<p>No tools found.</p>';
            return;
        }

        tools.forEach(tool => {
            const toolCard = `
                <article class="tool-card" data-category="${tool.category.toLowerCase()}">
                    <div class="tool-icon"><i class="${tool.icon}"></i></div>
                    <h3>${tool.category}</h3>
                    <p>${tool.description}</p>
                    <a href="${tool.url}" aria-label="Go to ${tool.category} tool">Go to Tool</a>
                </article>
            `;
            toolsGrid.insertAdjacentHTML('beforeend', toolCard);
        });
    }
});
