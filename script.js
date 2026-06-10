document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Signboard Customizer Elements
    const physicalSignBoard = document.getElementById('physicalSignBoard');
    const activePresetName = document.getElementById('activePresetName');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const selectBg = document.getElementById('boardBackground');
    const selectText = document.getElementById('boardText');
    const selectAccent = document.getElementById('boardAccent');
    const exportBtn = document.getElementById('exportSelectionBtn');

    // Checkout Modal Elements
    const modal = document.getElementById('checkoutModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const modalCancel = document.querySelector('.modal-cancel');
    const buyButtons = document.querySelectorAll('.buy-btn');
    const modalProductName = document.getElementById('modalProductName');
    const modalProductPrice = document.getElementById('modalProductPrice');
    const modalForm = document.getElementById('modalCheckoutForm');

    // Toast Elements
    const toast = document.getElementById('notificationToast');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');

    // Contact Form
    const inquiryForm = document.getElementById('inquiryForm');

    /* ==========================================================================
       1. Mobile Navigation & Scroll Effects
       ========================================================================== */
    mobileNavToggle.addEventListener('click', () => {
        mobileNavToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close mobile menu when a nav link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileNavToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Scroll listener for sticky header & scroll spy
    window.addEventListener('scroll', () => {
        // Sticky Header styling
        if (window.scrollY > 50) {
            header.style.padding = '5px 0';
            header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
            header.style.background = 'rgba(7, 9, 19, 0.95)';
        } else {
            header.style.padding = '0';
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(7, 9, 19, 0.75)';
        }

        // Scroll Spy active navigation
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    /* ==========================================================================
       2. Sign Board Interactive Visualizer
       ========================================================================== */
    // Helper to calculate hex color opacity glow
    function getGlowColor(hex) {
        // Simple hex-to-rgb conversion
        let c = hex.substring(1);
        let rgb = parseInt(c, 16);
        let r = (rgb >> 16) & 0xff;
        let g = (rgb >> 8) & 0xff;
        let b = (rgb >> 0) & 0xff;
        return `rgba(${r}, ${g}, ${b}, 0.45)`;
    }

    // Apply colors to physical signboard
    function applySignBoardColors(bg, text, accent) {
        physicalSignBoard.style.setProperty('--sign-bg', bg);
        physicalSignBoard.style.setProperty('--sign-text', text);
        physicalSignBoard.style.setProperty('--sign-accent', accent);
        physicalSignBoard.style.setProperty('--sign-accent-glow', getGlowColor(accent));
    }

    // Preset button click handler
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active status
            presetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Retrieve configuration values
            const bg = btn.dataset.bg;
            const text = btn.dataset.text;
            const accent = btn.dataset.accent;
            const name = btn.dataset.name;

            // Apply to visualizer CSS
            applySignBoardColors(bg, text, accent);

            // Sync Dropdown Selects
            selectBg.value = bg;
            selectText.value = text;
            selectAccent.value = accent;

            // Update render caption name
            activePresetName.innerText = name;
        });
    });

    // Dropdown value changes handler
    function handleCustomDropdownChange() {
        // Remove preset highlight, since user manually overridden colors
        presetButtons.forEach(btn => btn.classList.remove('active'));
        
        const bg = selectBg.value;
        const text = selectText.value;
        const accent = selectAccent.value;

        applySignBoardColors(bg, text, accent);
        activePresetName.innerText = 'Custom Board Mix';
    }

    selectBg.addEventListener('change', handleCustomDropdownChange);
    selectText.addEventListener('change', handleCustomDropdownChange);
    selectAccent.addEventListener('change', handleCustomDropdownChange);

    // Export Color Preferences Action
    exportBtn.addEventListener('click', () => {
        const bg = selectBg.value;
        const text = selectText.value;
        const accent = selectAccent.value;
        const preset = activePresetName.innerText;

        showToast(
            'Palette Logged!',
            `Sign board preference stored: "${preset}" (${bg} bg, ${text} text, ${accent} accent).`
        );
        
        // Auto fill form message to make it feel connected
        const messageBox = document.getElementById('inquiryMessage');
        const prodSelect = document.getElementById('productSelect');
        prodSelect.value = 'general';
        messageBox.value = `Hi hexonn Labs! I just reviewed the Sign Board Visualizer. I really like the combination: "${preset}" with ${bg} Background, ${text} Text, and ${accent} LED Glow. Please use this style!`;
        
        // Smooth scroll user directly down to form
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    });

    /* ==========================================================================
       3. Checkout Modal (Software Licensing)
       ========================================================================== */
    function openCheckoutModal(product, price) {
        modalProductName.innerText = product;
        modalProductPrice.innerText = price;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Stop page scroll
    }

    function closeCheckoutModal() {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scroll
        modalForm.reset();
    }

    // Bind licenses trigger
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const product = button.getAttribute('data-product');
            const price = button.getAttribute('data-price');
            openCheckoutModal(product, price);
        });
    });

    // Close bindings
    [modalClose, modalCancel, modalOverlay].forEach(element => {
        if (element) {
            element.addEventListener('click', closeCheckoutModal);
        }
    });

    // Modal checkout form submission
    modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const productName = modalProductName.innerText;
        const buyerEmail = document.getElementById('buyerEmail').value;

        closeCheckoutModal();
        showToast(
            'License Provisioned!',
            `Thank you! Your active subscription details for ${productName} were sent to ${buyerEmail}.`
        );
    });

    /* ==========================================================================
       4. Contact / Inquiry Submit
       ========================================================================== */
    inquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('clientName').value;
        
        showToast(
            'Inquiry Received',
            `Hi ${name}, our software lab architects will review your request and reply shortly.`
        );
        inquiryForm.reset();
    });

    /* ==========================================================================
       5. Toast Notifications Helper
       ========================================================================== */
    let toastTimeout;
    function showToast(title, message) {
        // Reset timeout if already running
        clearTimeout(toastTimeout);
        
        toastTitle.innerText = title;
        toastMessage.innerText = message;
        toast.classList.add('active');

        // Automatic close toast after 5.5s
        toastTimeout = setTimeout(() => {
            toast.classList.remove('active');
        }, 5500);
    }
});
