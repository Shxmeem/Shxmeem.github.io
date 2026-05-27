document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
});

function initializeNavigation() {
    if (document.querySelector('nav')) {
        return;
    }
    
    injectBasePositioningCSS();
    
    injectOfferBanner().then(() => {
        injectNavigationHTML();
        finalizeNavigationSetup();
    }).catch(() => {
        injectNavigationHTML();
        finalizeNavigationSetup();
    });
}

function injectBasePositioningCSS() {
    if (document.querySelector('#base-positioning-styles')) return;
    
    const css = `
        :root {
            --banner-height: 0px;
            --nav-height: 0px;
            --header-total: 0px;
        }
        
        body {
            margin: 0 !important;
            padding-top: var(--header-total, 0px) !important;
            transition: padding-top 0.2s ease;
        }
        
        .offer-banner {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1021;
            background: linear-gradient(135deg, #f3e8ff 0%, #f8f0ff 100%);
            box-shadow: 0 2px 10px rgba(106, 17, 203, 0.1);
            border-bottom: 2px solid rgba(106, 17, 203, 0.2);
            backdrop-filter: blur(10px);
            transform: translateZ(0);
            will-change: transform;
        }
        
        nav {
            position: fixed;
            top: var(--banner-height, 0px);
            left: 0;
            right: 0;
            z-index: 1020;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px) saturate(180%);
            border-bottom: 1px solid rgba(106, 17, 203, 0.1);
            transition: box-shadow 0.3s ease, top 0.2s ease;
            transform: translateZ(0);
            will-change: top;
        }
        
        .offer-banner, nav {
            backface-visibility: hidden;
        }
    `;
    
    const style = document.createElement('style');
    style.id = 'base-positioning-styles';
    style.textContent = css;
    document.head.appendChild(style);
}

async function injectOfferBanner() {
    return new Promise((resolve) => {
        if (document.querySelector('.offer-banner')) {
            updateBannerHeight();
            resolve();
            return;
        }
        
        fetch('https://res.qxel.app/public/data/header-notifications.json')
            .then(response => response.json())
            .then(banners => {
                if (banners && banners.length > 0) {
                    createBannerElement(banners);
                } else {
                    document.documentElement.style.setProperty('--banner-height', `0px`);
                }
                resolve();
            })
            .catch(() => {
                document.documentElement.style.setProperty('--banner-height', `0px`);
                resolve();
            });
    });
}

function createBannerElement(banners) {
    const bannerHTML = `
        <div class="offer-banner" id="offerBanner">
            <div class="offer-container">
                <div class="offer-slider" id="offerSlider">
                    ${banners.map((banner, index) => `
                        <div class="offer-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <a href="${banner.url}" class="offer-content-link" target="_blank" rel="noopener noreferrer">
                                <div class="offer-content">
                                    <i class="fas fa-bullhorn offer-icon"></i>
                                    <span class="offer-text">${banner.title}</span>
                                    <span class="offer-claim-text">Learn More <i class="fas fa-arrow-right"></i></span>
                                </div>
                            </a>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', bannerHTML);
    
    if (banners.length > 1) {
        startAutoRotation(banners.length);
    }
    
    updateBannerHeight();
}

function updateBannerHeight() {
    const banner = document.querySelector('.offer-banner');
    if (banner) {
        const height = banner.offsetHeight;
        document.documentElement.style.setProperty('--banner-height', `${height}px`);
        
        const nav = document.querySelector('nav');
        if (nav) {
            nav.style.top = `${height}px`;
        }
        
        updateTotalHeaderHeight();
    } else {
        document.documentElement.style.setProperty('--banner-height', `0px`);
        const nav = document.querySelector('nav');
        if (nav) {
            nav.style.top = `0px`;
        }
        updateTotalHeaderHeight();
    }
}

function updateNavHeight() {
    const nav = document.querySelector('nav');
    if (nav) {
        const height = nav.offsetHeight;
        document.documentElement.style.setProperty('--nav-height', `${height}px`);
        updateTotalHeaderHeight();
    }
}

function updateTotalHeaderHeight() {
    const bannerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--banner-height')) || 0;
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 0;
    const total = bannerHeight + navHeight;
    document.documentElement.style.setProperty('--header-total', `${total}px`);
    document.body.style.paddingTop = `${total}px`;
}

function injectNavigationHTML() {
    if (document.querySelector('nav')) return;
    
    const currentBannerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--banner-height')) || 0;
    
    const navHTML = `
        <nav style="top: ${currentBannerHeight}px;">
            <div class="nav-container">
                <div class="logo-container">
                    <img src="https://cdn.qxel.app/assets/logo/qxel-logo.svg" alt="Qxel Logo - Digital Products Marketplace" class="logo">
                </div>
                
                <div class="nav-right">
                    <div class="cart-icon-container">
                        <i class="fas fa-shopping-cart cart-icon"></i>
                    </div>
                    
                    <div class="dropdown-menu">
                        <button class="dropdown-trigger">
                            <i class="fas fa-bars"></i>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="dropdown-content">
                            <a href="/dashboard" class="dropdown-link">
                                <i class="fas fa-tachometer-alt"></i>
                                <span>Dashboard</span>
                            </a>
                            <a href="/orders" class="dropdown-link">
                                <i class="fas fa-box"></i>
                                <span>My Orders</span>
                            </a>
                            <a href="/profile" class="dropdown-link">
                                <i class="fas fa-user-edit"></i>
                                <span>Profile</span>
                            </a>
                            <a href="/pricing" class="dropdown-link">
                                <i class="fas fa-tag"></i>
                                <span>Pricing</span>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="/auth/login" class="dropdown-link">
                                <i class="fas fa-sign-in-alt"></i>
                                <span>Login</span>
                            </a>
                            <a href="/auth/signup" class="dropdown-link signup-dropdown">
                                <i class="fas fa-user-plus"></i>
                                <span>Sign Up</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="nav-bg-effect"></div>
        </nav>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', navHTML);
    
    injectCompleteCSS();
    
    setTimeout(() => {
        updateNavHeight();
    }, 10);
}

function injectCompleteCSS() {
    if (document.querySelector('#nav-complete-styles')) return;
    
    const css = `
        .offer-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 48px;
        }
        
        .offer-slider {
            flex: 1;
            position: relative;
            overflow: hidden;
        }
        
        .offer-slide {
            display: none;
            animation: fadeIn 0.5s ease forwards;
        }
        
        .offer-slide.active {
            display: block;
        }
        
        .offer-content-link {
            text-decoration: none;
            display: block;
            cursor: pointer;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .offer-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            flex-wrap: wrap;
            padding: 10px 0;
        }
        
        .offer-icon {
            font-size: 1.2rem;
            color: #6a11cb;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }
        
        .offer-text {
            font-size: 0.9rem;
            font-weight: 500;
            letter-spacing: 0.3px;
            color: #4a4a5a;
        }
        
        .offer-text strong {
            font-weight: 700;
            background: linear-gradient(135deg, #6a11cb, #9b59b6);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin: 0 2px;
        }
        
        .offer-claim-text {
            background: linear-gradient(135deg, #6a11cb, #9b59b6);
            color: white;
            padding: 6px 20px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.85rem;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 8px rgba(106, 17, 203, 0.2);
        }
        
        .offer-content-link:hover .offer-claim-text {
            transform: translateX(3px);
            box-shadow: 0 4px 12px rgba(106, 17, 203, 0.3);
            background: linear-gradient(135deg, #7d2ae8, #a96bc7);
        }
        
        .offer-content-link:hover .offer-claim-text i {
            transform: translateX(3px);
        }
        
        .offer-claim-text i {
            transition: transform 0.3s ease;
        }
        
        nav.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 4px 20px rgba(106, 17, 203, 0.12);
            border-bottom-color: rgba(106, 17, 203, 0.2);
        }
        
        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: relative;
        }
        
        .logo-container {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 100%;
            overflow: hidden;
            border-radius: 0.5rem;
            transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            flex-shrink: 0;
        }
        
        .logo {
            height: 68px;
            width: auto;
            min-width: 200px;
            position: relative;
            z-index: 1;
            object-fit: contain;
        }
        
        .nav-right {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .cart-icon-container {
            position: relative;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .cart-icon-container:hover {
            background: rgba(106, 17, 203, 0.05);
            transform: translateY(-2px);
        }
        
        .cart-icon {
            font-size: 1.4rem;
            color: #4a4a5a;
            transition: color 0.3s ease;
        }
        
        .cart-icon-container:hover .cart-icon {
            color: #6a11cb;
        }
        
        .dropdown-menu {
            position: relative;
        }
        
        .dropdown-trigger {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 2rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #4a4a5a;
            font-size: 1.2rem;
            transition: all 0.3s ease;
        }
        
        .dropdown-trigger:hover {
            background: rgba(106, 17, 203, 0.05);
            color: #6a11cb;
            transform: translateY(-2px);
        }
        
        .dropdown-trigger i:first-child {
            font-size: 1.3rem;
        }
        
        .dropdown-trigger i:last-child {
            font-size: 0.8rem;
            transition: transform 0.3s ease;
        }
        
        .dropdown-menu.active .dropdown-trigger i:last-child {
            transform: rotate(180deg);
        }
        
        .dropdown-content {
            position: absolute;
            top: calc(100% + 10px);
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            min-width: 220px;
            border-radius: 1rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(106, 17, 203, 0.1);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            transform: translateY(-10px) scale(0.95);
            z-index: 2000;
        }
        
        .dropdown-menu.active .dropdown-content {
            opacity: 1;
            visibility: visible;
            transform: translateY(0) scale(1);
        }
        
        .dropdown-link {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1.25rem;
            text-decoration: none;
            color: #4a4a5a;
            font-size: 0.9rem;
            transition: all 0.25s ease;
            border-left: 3px solid transparent;
        }
        
        .dropdown-link:hover {
            background: rgba(106, 17, 203, 0.05);
            color: #6a11cb;
            border-left-color: #6a11cb;
            padding-left: 1.5rem;
        }
        
        .dropdown-link i {
            width: 1.2rem;
            font-size: 1rem;
        }
        
        .dropdown-divider {
            height: 1px;
            background: rgba(106, 17, 203, 0.1);
            margin: 0.5rem 0;
        }
        
        .signup-dropdown {
            background: linear-gradient(135deg, rgba(106, 17, 203, 0.05), rgba(155, 89, 182, 0.05));
            font-weight: 600;
        }
        
        .signup-dropdown:hover {
            background: linear-gradient(135deg, rgba(106, 17, 203, 0.1), rgba(155, 89, 182, 0.1));
        }
        
        .nav-bg-effect {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(106, 17, 203, 0.03) 20%,
                rgba(106, 17, 203, 0.06) 50%,
                rgba(106, 17, 203, 0.03) 80%,
                transparent 100%);
            opacity: 0.5;
            pointer-events: none;
            z-index: -1;
            animation: shimmer 3s infinite;
        }
        
        @keyframes shimmer {
            0% {
                transform: translateX(-100%);
            }
            100% {
                transform: translateX(100%);
            }
        }
        
        @media (max-width: 1024px) {
            .offer-container {
                padding: 0 1.5rem;
            }
            
            .offer-content {
                font-size: 0.85rem;
                gap: 0.75rem;
            }
            
            .offer-text {
                font-size: 0.85rem;
            }
            
            .nav-container {
                padding: 0 1rem;
                gap: 1rem;
            }
            
            .logo {
                min-width: 160px;
                height: 58px;
            }
        }
        
        @media (max-width: 768px) {
            .offer-container {
                padding: 0 1rem;
            }
            
            .offer-content {
                padding: 8px 0;
                gap: 0.6rem;
            }
            
            .offer-icon {
                font-size: 1rem;
            }
            
            .offer-text {
                font-size: 0.75rem;
            }
            
            .offer-claim-text {
                padding: 4px 12px;
                font-size: 0.75rem;
            }
            
            .nav-container {
                padding: 0 1rem;
                height: 72px;
                gap: 0.5rem;
            }
            
            .logo {
                min-width: 140px;
                height: 50px;
            }
            
            .cart-icon {
                font-size: 1.2rem;
            }
            
            .dropdown-trigger i:first-child {
                font-size: 1.1rem;
            }
        }
    `;
    
    const style = document.createElement('style');
    style.id = 'nav-complete-styles';
    style.textContent = css;
    document.head.appendChild(style);
}

function finalizeNavigationSetup() {
    const logoContainer = document.querySelector('.logo-container');
    if (logoContainer) {
        logoContainer.addEventListener('click', function() {
            window.location.href = 'https://www.qxel.app';
        });
    }
    
    const cartContainer = document.querySelector('.cart-icon-container');
    if (cartContainer) {
        cartContainer.addEventListener('click', function() {
            window.location.href = '/cart';
        });
    }
    
    const setupDropdown = function() {
        const dropdownMenu = document.querySelector('.dropdown-menu');
        if (!dropdownMenu) {
            setTimeout(setupDropdown, 100);
            return;
        }
        
        const trigger = dropdownMenu.querySelector('.dropdown-trigger');
        if (!trigger) return;
        
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);
        
        newTrigger.addEventListener('mousedown', function(e) {
            e.preventDefault();
            e.stopPropagation();
            document.querySelectorAll('.dropdown-menu.active').forEach(menu => {
                if (menu !== dropdownMenu) {
                    menu.classList.remove('active');
                }
            });
            dropdownMenu.classList.toggle('active');
        });
        
        const handleOutsideClick = function(e) {
            if (dropdownMenu && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('active');
            }
        };
        
        document.removeEventListener('click', handleOutsideClick);
        document.addEventListener('click', handleOutsideClick);
        
        const handleEscape = function(e) {
            if (e.key === 'Escape' && dropdownMenu && dropdownMenu.classList.contains('active')) {
                dropdownMenu.classList.remove('active');
            }
        };
        document.removeEventListener('keydown', handleEscape);
        document.addEventListener('keydown', handleEscape);
        
        const dropdownLinks = dropdownMenu.querySelectorAll('.dropdown-link');
        dropdownLinks.forEach(link => {
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            newLink.addEventListener('click', function(e) {
                e.stopPropagation();
                const href = this.getAttribute('href');
                if (href && href !== '#') {
                    window.location.href = href;
                }
                if (dropdownMenu) dropdownMenu.classList.remove('active');
            });
        });
        
        const dropdownContent = dropdownMenu.querySelector('.dropdown-content');
        if (dropdownContent) {
            const newContent = dropdownContent.cloneNode(true);
            dropdownContent.parentNode.replaceChild(newContent, dropdownContent);
            newContent.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    };
    
    setTimeout(setupDropdown, 50);
    
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', function() {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        });
        if (window.scrollY > 50) nav.classList.add('scrolled');
    }
    
    window.addEventListener('resize', function() {
        updateBannerHeight();
        updateNavHeight();
    });
    
    const banner = document.querySelector('.offer-banner');
    if (banner) {
        const observer = new ResizeObserver(() => updateBannerHeight());
        observer.observe(banner);
    }
    
    if (nav) {
        const observer = new ResizeObserver(() => updateNavHeight());
        observer.observe(nav);
    }
}

let autoRotateInterval = null;
let currentRotationIndex = 0;

function startAutoRotation(totalSlides) {
    if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
        autoRotateInterval = null;
    }
    
    currentRotationIndex = 0;
    
    function showSlide(index) {
        const slides = document.querySelectorAll('.offer-slide');
        if (!slides.length || index >= slides.length) return;
        slides.forEach(slide => slide.classList.remove('active'));
        if (slides[index]) {
            slides[index].classList.add('active');
            currentRotationIndex = index;
        }
    }
    
    function nextSlide() {
        const slides = document.querySelectorAll('.offer-slide');
        if (!slides.length) return;
        let newIndex = currentRotationIndex + 1;
        if (newIndex >= slides.length) {
            newIndex = 0;
        }
        showSlide(newIndex);
    }
    
    function startRotation() {
        if (autoRotateInterval) clearInterval(autoRotateInterval);
        autoRotateInterval = setInterval(nextSlide, 5000);
    }
    
    function stopRotation() {
        if (autoRotateInterval) {
            clearInterval(autoRotateInterval);
            autoRotateInterval = null;
        }
    }
    
    startRotation();
    
    const banner = document.querySelector('.offer-banner');
    if (banner) {
        banner.removeEventListener('mouseenter', stopRotation);
        banner.removeEventListener('mouseleave', startRotation);
        banner.addEventListener('mouseenter', stopRotation);
        banner.addEventListener('mouseleave', startRotation);
    }
}

if (typeof Turbo !== 'undefined') {
    document.addEventListener('turbo:load', () => {
        const oldNav = document.querySelector('nav');
        if (oldNav) oldNav.remove();
        const oldBanner = document.querySelector('.offer-banner');
        if (oldBanner) oldBanner.remove();
        initializeNavigation();
    });
}

window.addEventListener('pageshow', function(event) {
    if (event.persisted) {
        const oldNav = document.querySelector('nav');
        if (oldNav) oldNav.remove();
        const oldBanner = document.querySelector('.offer-banner');
        if (oldBanner) oldBanner.remove();
        initializeNavigation();
    }
});

window.Navigation = {
    init: initializeNavigation,
    refresh: function() {
        const oldNav = document.querySelector('nav');
        if (oldNav) oldNav.remove();
        const oldBanner = document.querySelector('.offer-banner');
        if (oldBanner) oldBanner.remove();
        initializeNavigation();
    }
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeNavigation);
} else {
    initializeNavigation();
}
