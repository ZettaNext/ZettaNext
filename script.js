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

// Language Switcher Toggle
const langSwitcher = document.querySelector('.lang-switcher');
const langToggle = document.querySelector('.lang-toggle');

if (langToggle) {
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        langSwitcher.classList.toggle('open');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!langSwitcher.contains(e.target)) {
            langSwitcher.classList.remove('open');
        }
    });
}

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

// Detect language based on URL
const isEnglish = window.location.pathname.includes('/en/');

if (codeElement) {
    const codeSnippetPT = [
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

    const codeSnippetEN = [
        { text: "const ", class: "token-keyword" },
        { text: "yourBusiness ", class: "token-variable" },
        { text: "= {\n", class: "" },
        { text: "  goals: ", class: "token-variable" },
        { text: "[\n", class: "" },
        { text: "    'Attract Clients'", class: "token-string" },
        { text: ",\n", class: "" },
        { text: "    'Sell More'", class: "token-string" },
        { text: ",\n", class: "" },
        { text: "    'Automate'", class: "token-string" },
        { text: "\n  ],\n", class: "" },
        { text: "  partner: ", class: "token-variable" },
        { text: "'ZettaNext'", class: "token-string" },
        { text: "\n};\n\n", class: "" },
        { text: "function ", class: "token-keyword" },
        { text: "transformFuture", class: "token-function" },
        { text: "() {\n", class: "" },
        { text: "  return ", class: "token-keyword" },
        { text: "'Guaranteed Success'", class: "token-string" },
        { text: ";\n}", class: "" }
    ];

    const codeSnippet = isEnglish ? codeSnippetEN : codeSnippetPT;

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

// Contact Form Handler (front-only via Formspree - sem backend próprio)
// IMPORTANTE: no painel do Formspree restrinja o domínio permitido para
// https://www.zettanext.com.br e ative reCAPTCHA/honeypot lá também.
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

// Endpoint público do Formspree (por design é visível no front).
// Abuso é mitigado com honeypot + tempo mínimo + rate-limit abaixo.
const FORMSPREE_URL = 'https://formspree.io/f/mykykgpl';

// Serviços aceitos (PT + EN). Qualquer outro valor é rejeitado.
const ALLOWED_SERVICES = new Set([
    'website',
    'sistema_personalizado', 'estoque', 'agendamento', 'financas', 'dados',
    'custom_system', 'inventory', 'scheduling', 'finance', 'data'
]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FORM_LOAD_TIME = Date.now();
const RATE_LIMIT_MS = 60 * 1000;

function showFormMessage(type, text) {
    if (!formMessage) return;
    formMessage.style.display = 'block';
    if (type === 'ok') {
        formMessage.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
        formMessage.style.border = '1px solid rgba(34, 197, 94, 0.3)';
        formMessage.style.color = '#22c55e';
    } else {
        formMessage.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        formMessage.style.border = '1px solid rgba(239, 68, 68, 0.3)';
        formMessage.style.color = '#ef4444';
    }
    formMessage.textContent = text;
}

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;

        // 1. Honeypot: bots preenchem campo invisível. Finge sucesso e aborta.
        const honeypot = contactForm.querySelector('input[name="_gotcha"]');
        if (honeypot && honeypot.value) {
            showFormMessage('ok', isEnglish
                ? '✓ Message sent successfully! We will contact you soon.'
                : '✓ Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
            return;
        }

        // 2. Tempo mínimo de preenchimento (3s) — bloqueia bots instantâneos.
        if (Date.now() - FORM_LOAD_TIME < 3000) {
            showFormMessage('error', isEnglish
                ? '✗ Please wait a few seconds and try again.'
                : '✗ Aguarde alguns segundos e tente novamente.');
            return;
        }

        // 3. Rate-limit client-side (1 envio / 60s por navegador).
        try {
            const last = Number(localStorage.getItem('zn_last_submit') || 0);
            if (Date.now() - last < RATE_LIMIT_MS) {
                showFormMessage('error', isEnglish
                    ? '✗ You already sent a message. Please wait a minute before trying again.'
                    : '✗ Você já enviou uma mensagem. Aguarde um minuto antes de tentar de novo.');
                return;
            }
        } catch (_) { /* localStorage indisponível: segue sem rate-limit */ }

        // 4. Coleta + normalização (trim) com limites rígidos.
        const rawName = document.getElementById('name').value.trim().slice(0, 100);
        const rawEmail = document.getElementById('email').value.trim().slice(0, 254);
        const rawPhone = document.getElementById('phone').value.trim().slice(0, 30);
        const rawService = document.getElementById('service').value.trim().slice(0, 50);
        const rawMessage = document.getElementById('message').value.trim().slice(0, 2000);

        // 5. Validação estrita (não confia só no `required` do HTML).
        if (rawName.length < 2 || rawName.length > 100 || /[\r\n<>]/.test(rawName)) {
            showFormMessage('error', isEnglish ? '✗ Please enter a valid name.' : '✗ Informe um nome válido.');
            return;
        }
        if (!EMAIL_RE.test(rawEmail) || /[\r\n<>]/.test(rawEmail)) {
            showFormMessage('error', isEnglish ? '✗ Please enter a valid email.' : '✗ Informe um e-mail válido.');
            return;
        }
        const phoneDigits = rawPhone.replace(/\D/g, '');
        if (phoneDigits.length < 8 || phoneDigits.length > 15 || /[\r\n<>]/.test(rawPhone)) {
            showFormMessage('error', isEnglish ? '✗ Please enter a valid phone.' : '✗ Informe um telefone válido.');
            return;
        }
        if (!ALLOWED_SERVICES.has(rawService)) {
            showFormMessage('error', isEnglish ? '✗ Please select a valid service.' : '✗ Selecione um serviço válido.');
            return;
        }
        if (rawMessage.length < 10 || rawMessage.length > 2000) {
            showFormMessage('error', isEnglish
                ? '✗ Message must be between 10 and 2000 characters.'
                : '✗ A mensagem deve ter entre 10 e 2000 caracteres.');
            return;
        }

        const formData = {
            name: rawName,
            email: rawEmail,
            phone: rawPhone,
            service: rawService,
            message: rawMessage
        };

        submitButton.textContent = isEnglish ? 'Sending...' : 'Enviando...';
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

            if (response.ok) {
                try { localStorage.setItem('zn_last_submit', String(Date.now())); } catch (_) {}
                showFormMessage('ok', isEnglish
                    ? '✓ Message sent successfully! We will contact you soon.'
                    : '✓ Mensagem enviada com sucesso! Entraremos em contato em breve.');
                contactForm.reset();
            } else {
                throw new Error('Formspree rejected the request');
            }
        } catch (error) {
            // Não expõe detalhes internos ao usuário nem loga dados do formulário.
            console.error('Erro ao enviar formulário.');
            showFormMessage('error', isEnglish
                ? '✗ Error sending message. Please try again or contact us via WhatsApp.'
                : '✗ Erro ao enviar mensagem. Tente novamente ou entre em contato pelo WhatsApp.');
        } finally {
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    });
}

