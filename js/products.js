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
}
