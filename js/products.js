// Product Tabs JavaScript
function switchTab(tabName) {
    // Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-button');
    buttons.forEach(button => button.classList.remove('active'));
    
    // Show selected tab content
    document.getElementById('content-' + tabName).classList.add('active');
    
    // Add active class to selected button
    document.getElementById('tab-' + tabName).classList.add('active');
    
    // Change background image based on tab
    const heroImage = document.getElementById('hero-bg-image');
    if (heroImage) {
        if (tabName === 'leak') {
            heroImage.src = '../img/hero11-bgg_double.jpg';
        } else if (tabName === 'industrial') {
            heroImage.src = '../img/hero11-bgg_normal.jpg';
        }
    }
}
