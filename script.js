// ========================================
// PBK FREELANCING - COMPLETE JAVASCRIPT
// ========================================

// Preloader with Internet Connection Check
document.addEventListener('DOMContentLoaded', function() {
    checkInternetConnection();
    startPreloader();
    initStatsCounter();
    initPortfolioFilter();
    initMobileMenu();
    initFormSubmission();
});

// Internet Connection Check
function checkInternetConnection() {
    const connectionStatus = document.getElementById('connectionStatus');
    
    function updateConnectionStatus() {
        if (navigator.onLine) {
            if (connectionStatus) {
                connectionStatus.innerHTML = '<i class="fas fa-wifi"></i> Connected';
                connectionStatus.style.background = 'rgba(16, 185, 129, 0.2)';
                connectionStatus.style.color = '#10b981';
            }
        } else {
            if (connectionStatus) {
                connectionStatus.innerHTML = '<i class="fas fa-wifi-slash"></i> No Internet Connection';
                connectionStatus.style.background = 'rgba(239, 68, 68, 0.2)';
                connectionStatus.style.color = '#ef4444';
            }
        }
    }
    
    updateConnectionStatus();
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
}

// Preloader Animation
function startPreloader() {
    let progress = 0;
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.progress-bar');
    const percentageText = document.querySelector('.percentage-text');
    const loaderText = document.querySelector('.loader-text');
    
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        
        if (progressBar) progressBar.style.width = progress + '%';
        if (percentageText) percentageText.textContent = Math.floor(progress) + '%';
        
        if (loaderText) {
            if (progress < 30) loaderText.textContent = 'Checking connection...';
            else if (progress < 60) loaderText.textContent = 'Loading resources...';
            else if (progress < 90) loaderText.textContent = 'Preparing amazing content...';
            else loaderText.textContent = 'Almost ready...';
        }
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('fade-out');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        }
    }, 100);
}

// Stats Counter Animation
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseInt(stat.getAttribute('data-count'));
                animateNumber(stat, target);
                observer.unobserve(stat);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateNumber(element, target) {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
}

// Portfolio Filter
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter items
            const filter = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks && mobileBtn && !navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    });
}

// Contact Form Submission - Working with Email
function initFormSubmission() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoader = submitBtn.querySelector('.btn-loader');
            const formData = new FormData(contactForm);
            
            // Get form values
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone') || 'Not provided';
            const service = formData.get('service') || 'Not specified';
            const message = formData.get('message');
            
            // Validate
            if (!name || !email || !message) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Show loading state
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            submitBtn.disabled = true;
            
            try {
                // Send email using FormSubmit.co or EmailJS
                // For demo, we'll open email client with pre-filled message
                const subject = `New Contact from ${name} - ${service}`;
                const body = `Name: ${name}%0AEmail: ${email}%0APhone: ${phone}%0AService: ${service}%0A%0AMessage:%0A${message}`;
                
                window.location.href = `mailto:pbkfreelancing@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                showNotification('Opening email client...', 'success');
                
                // Reset form
                contactForm.reset();
                
                setTimeout(() => {
                    // Hide loading state
                    btnText.style.display = 'inline-block';
                    btnLoader.style.display = 'none';
                    submitBtn.disabled = false;
                }, 2000);
                
            } catch (error) {
                console.error('Error:', error);
                showNotification('Failed to send message. Please try again.', 'error');
                
                // Hide loading state
                btnText.style.display = 'inline-block';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                background: #1e293b;
                color: white;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                border-left: 4px solid;
            }
            .notification.success { border-left-color: #10b981; }
            .notification.error { border-left-color: #ef4444; }
            .notification.info { border-left-color: #3b82f6; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#services' && href !== '#about' && href !== '#contact') {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Video Background Optimization
const video = document.getElementById('bgVideo');
if (video) {
    video.addEventListener('loadeddata', () => {
        console.log('Video loaded successfully');
    });
}
