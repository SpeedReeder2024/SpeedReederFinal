// Select premium buttons for other pages if needed
const premiumButtons = document.querySelectorAll('.premium');

// Function to enable/disable premium features in local storage and UI
function updatePremiumUI(enable) {
    localStorage.setItem('premiumEnabled', enable);
    if (premiumButtons) {
        premiumButtons.forEach(button => {
            button.disabled = !enable;
            button.classList.toggle('premiumdisabled', !enable);
        });
    }
    // Alert only when toggling premium features, not on page reload
    if (!sessionStorage.getItem('premiumHandled')) {
        sessionStorage.setItem('premiumHandled', true);
    }
}

// Check the payment status from URL parameters
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_status');

    if (paymentStatus === 'success') {
        // Payment was successful, enable premium features
        updatePremiumUI(true);
        alert("Payment successful! Premium features are now enabled.");
    } else if (paymentStatus === 'cancelled') {
        // Payment was cancelled, notify the user
        alert("Payment was cancelled. Please try again.");
    }

    // Maintain existing premium status on page load
    const premiumEnabled = localStorage.getItem('premiumEnabled') === 'true';
    updatePremiumUI(premiumEnabled);
});
