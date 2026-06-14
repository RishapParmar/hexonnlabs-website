document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');



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
            header.style.boxShadow = '0 10px 30px rgba(20, 48, 34, 0.06)';
            header.style.background = 'rgba(252, 251, 249, 0.95)';
        } else {
            header.style.padding = '0';
            header.style.boxShadow = 'none';
            header.style.background = 'rgba(252, 251, 249, 0.82)';
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
