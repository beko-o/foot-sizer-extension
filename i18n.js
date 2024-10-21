document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const message = chrome.i18n.getMessage(element.getAttribute('data-i18n'));
        if (element.placeholder) {
            element.placeholder = message;
        } else {
            element.textContent = message;
        }
    });
});
