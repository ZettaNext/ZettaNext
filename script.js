// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.navbar ul');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Header Scroll Effect
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.section-header, .service-card, .about-content, .about-image, .contact-wrapper, .hero-content');

// Add reveal class initially
revealElements.forEach(el => {
    el.classList.add('reveal');
});

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight - elementVisible) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);

// Trigger once on load
revealOnScroll();

// Code Typewriter Animation
const codeElement = document.getElementById('typewriter-text');

if (codeElement) {
    const codeSnippet = [
        { text: "const ", class: "token-keyword" },
        { text: "suaEmpresa ", class: "token-variable" },
        { text: "= {\n", class: "" },
        { text: "  objetivos: ", class: "token-variable" },
        { text: "[\n", class: "" },
        { text: "    'Atrair Clientes'", class: "token-string" },
        { text: ",\n", class: "" },
        { text: "    'Vender Mais'", class: "token-string" },
        { text: ",\n", class: "" },
        { text: "    'Automatizar'", class: "token-string" },
        { text: "\n  ],\n", class: "" },
        { text: "  parceiro: ", class: "token-variable" },
        { text: "'ZettaNext'", class: "token-string" },
        { text: "\n};\n\n", class: "" },
        { text: "function ", class: "token-keyword" },
        { text: "transformarFuturo", class: "token-function" },
        { text: "() {\n", class: "" },
        { text: "  return ", class: "token-keyword" },
        { text: "'Sucesso Garantido'", class: "token-string" },
        { text: ";\n}", class: "" }
    ];

    let currentTokenIndex = 0;
    let currentCharIndex = 0;

    function typeCode() {
        if (currentTokenIndex < codeSnippet.length) {
            const token = codeSnippet[currentTokenIndex];
            const text = token.text;

            // Create span for token if starting new token
            if (currentCharIndex === 0) {
                const span = document.createElement('span');
                if (token.class) span.className = token.class;
                codeElement.appendChild(span);
                // Also remove cursor from previous spot and add to new
            }

            // Get the last span
            const currentSpan = codeElement.lastElementChild;
            currentSpan.textContent += text[currentCharIndex];

            // Move cursor
            updateCursor();

            currentCharIndex++;
            if (currentCharIndex >= text.length) {
                currentTokenIndex++;
                currentCharIndex = 0;
                setTimeout(typeCode, 30); // Delay between tokens
            } else {
                setTimeout(typeCode, 20 + Math.random() * 30); // Random typing speed
            }
        }
    }

    // Add cursor element initially
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    codeElement.parentNode.appendChild(cursor);

    function updateCursor() {
        // Just keeping it simple, cursor stays at end
    }

    // Start typing after a delay
    setTimeout(typeCode, 1000);
}

// Contact Form Handler
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

// CONFIGURAÇÃO FORMSPREE:
// 1. Crie uma conta em https://formspree.io
// 2. Crie um novo formulário e copie a URL gerada (Endpoint)
// 3. Cole a URL abaixo:
const FORMSPREE_URL = 'https://formspree.io/f/mykykgpl';

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Verifica se a URL foi configurada
        if (FORMSPREE_URL.includes('SEU_CODIGO_AQUI')) {
            alert('Por favor, configure a URL do Formspree no arquivo script.js para que o formulário funcione.');
            return;
        }

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            message: document.getElementById('message').value
        };

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;

        try {
            const response = await fetch(FORMSPREE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // Formspree retorna ok mesmo com alguns erros de validação, mas verificamos o status
            if (response.ok) {
                formMessage.style.display = 'block';
                formMessage.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
                formMessage.style.border = '1px solid rgba(34, 197, 94, 0.3)';
                formMessage.style.color = '#22c55e';
                formMessage.textContent = '✓ Mensagem enviada com sucesso! Entraremos em contato em breve.';
                contactForm.reset();
            } else {
                const data = await response.json();
                // Tenta pegar a mensagem de erro do Formspree ou usa genérica
                const errorMessage = data.error || 'Erro ao enviar mensagem.';
                throw new Error(errorMessage);
            }
        } catch (error) {
            console.error('Erro:', error);
            formMessage.style.display = 'block';
            formMessage.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            formMessage.style.border = '1px solid rgba(239, 68, 68, 0.3)';
            formMessage.style.color = '#ef4444';
            formMessage.textContent = '✗ Erro ao enviar mensagem. Tente novamente ou entre em contato pelo WhatsApp.';
        } finally {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
}

