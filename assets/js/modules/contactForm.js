export function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.btn-submit');
            const originalText = btn.innerHTML;
            
            // Basic UI feedback for submission
            btn.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Enviando...';
            btn.style.opacity = '0.7';
            
            // Simulate API Call
            setTimeout(() => {
                btn.innerHTML = '<i class="ph ph-check-circle"></i> Mensagem Enviada!';
                btn.style.background = 'var(--success)';
                btn.style.color = '#000';
                btn.style.opacity = '1';
                contactForm.reset();
                
                // Reset button after 3s
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                    btn.style.color = '';
                }, 3000);
            }, 1500);
        });
    }
}
