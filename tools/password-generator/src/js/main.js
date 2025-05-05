// tools/password-generator/src/js/main.js

import { message } from './utils.js';
import { generateAppleStylePassword } from './passwordGenerator.js';

document.addEventListener('DOMContentLoaded', () => {

    const passwordDisplay = document.getElementById('password');
    const passwordContainer = document.getElementById('password_container');
    const copyButton = document.getElementById('copy');
    const generateButton = document.getElementById('generate');

    const originalCopyIconHTML = '<i class="fa-solid fa-copy" aria-hidden="true"></i>';
    const copiedIconHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i>';

    if (!passwordDisplay || !passwordContainer || !copyButton || !generateButton) {
        console.error("Initialization failed: Essential DOM elements not found.");
        try { message("Initialization Error!", "danger"); } catch(e) {}
        return;
    }

    function handleGenerateClick() {
        try {
            const newPassword = generateAppleStylePassword();
            passwordDisplay.textContent = newPassword;
            passwordContainer.classList.add('show');
        } catch (error) {
            console.error("Password generation failed:", error);
            passwordDisplay.textContent = '';
            passwordContainer.classList.remove('show');
        }
    }

    function handleCopyClick() {
        const passwordToCopy = passwordDisplay.textContent;

        if (!passwordToCopy || copyButton.disabled) {
            if (!passwordToCopy) {
                 if (!copyButton.disabled) message('Nothing to copy!', 'danger');
            }
            return;
        }

        navigator.clipboard.writeText(passwordToCopy)
            .then(() => {
                copyButton.innerHTML = copiedIconHTML;
                copyButton.disabled = true;
                message('Password copied!', 'success');
                setTimeout(() => {
                    copyButton.innerHTML = originalCopyIconHTML;
                    copyButton.disabled = false;
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy password: ', err);
                message('Failed to copy password!', 'danger');
                copyButton.innerHTML = originalCopyIconHTML;
                copyButton.disabled = false;
            });
    }

    generateButton.addEventListener('click', handleGenerateClick);
    copyButton.addEventListener('click', handleCopyClick);
});