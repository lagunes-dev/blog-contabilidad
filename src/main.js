import './style.css'

// Interactive functionality for UI/UX
document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('shadow-md', 'bg-white/95');
            navbar.classList.remove('bg-white/80', 'shadow-sm');
        } else {
            navbar.classList.remove('shadow-md', 'bg-white/95');
            navbar.classList.add('bg-white/80', 'shadow-sm');
        }
    });

    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Dropdown Calculadoras toggle
    const dropdownBtn = document.getElementById('btn-dropdown-calc');
    const dropdownMenu = document.getElementById('dropdown-menu-calc');
    const dropdownArrow = document.getElementById('dropdown-arrow');

    if (dropdownBtn && dropdownMenu) {
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = !dropdownMenu.classList.contains('hidden');
            if (isOpen) {
                dropdownMenu.classList.add('hidden', 'opacity-0', 'translate-y-1');
                dropdownMenu.classList.remove('opacity-100', 'translate-y-0');
                if (dropdownArrow) dropdownArrow.classList.remove('rotate-180');
            } else {
                dropdownMenu.classList.remove('hidden');
                // Small timeout to allow CSS transition
                requestAnimationFrame(() => {
                    dropdownMenu.classList.remove('opacity-0', 'translate-y-1');
                    dropdownMenu.classList.add('opacity-100', 'translate-y-0');
                });
                if (dropdownArrow) dropdownArrow.classList.add('rotate-180');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.add('hidden', 'opacity-0', 'translate-y-1');
                dropdownMenu.classList.remove('opacity-100', 'translate-y-0');
                if (dropdownArrow) dropdownArrow.classList.remove('rotate-180');
            }
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                // Close mobile menu if open
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }

                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Search & Filter Functionality ---
    const searchInput = document.getElementById('searchInput');
    const searchFeedback = document.getElementById('search-feedback');
    const categoryButtons = document.querySelectorAll('#categoryList button');
    const quickFilters = document.querySelectorAll('.quick-filter-btn');
    const clickBadges = document.querySelectorAll('.click-badge');
    const resetBtn = document.getElementById('btn-reset-filters');
    const articles = document.querySelectorAll('#articulos article');
    
    let activeCategory = null;

    function filterArticles() {
        if (!searchInput) return;
        
        const searchTerm = searchInput.value.toLowerCase();
        let visibleCount = 0;

        articles.forEach(article => {
            const title = article.querySelector('h3').textContent.toLowerCase();
            const desc = article.querySelector('p').textContent.toLowerCase();
            const categoryBadge = article.querySelector('.click-badge').textContent.trim();
            
            const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
            const matchesCategory = !activeCategory || categoryBadge === activeCategory;

            if (matchesSearch && matchesCategory) {
                article.style.display = 'flex';
                visibleCount++;
            } else {
                article.style.display = 'none';
            }
        });

        // Update feedback
        if (searchTerm || activeCategory) {
            searchFeedback.textContent = `${visibleCount} artículo(s) encontrado(s).`;
            searchFeedback.classList.remove('hidden');
            resetBtn.classList.remove('hidden');
        } else {
            searchFeedback.classList.add('hidden');
            resetBtn.classList.add('hidden');
        }
    }

    function setActiveCategory(catName) {
        activeCategory = catName || null;

        // Visual sync sidebar
        if (categoryButtons.length > 0) {
            categoryButtons.forEach(b => {
                b.classList.remove('font-bold', 'text-brand-blue');
                if(b.getAttribute('data-cat') === catName) {
                    b.classList.add('font-bold', 'text-brand-blue');
                }
            });
        }

        // Visual sync quick filters
        if (quickFilters.length > 0) {
            quickFilters.forEach(b => {
                b.classList.remove('bg-brand-blue', 'text-white');
                b.classList.add('bg-gray-100', 'text-gray-600');
                if(b.getAttribute('data-cat') === (catName || '')) {
                    b.classList.remove('bg-gray-100', 'text-gray-600');
                    b.classList.add('bg-brand-blue', 'text-white');
                }
            });
        }

        filterArticles();
    }

    if(searchInput) {
        searchInput.addEventListener('input', filterArticles);
    }

    // Sidebar Category Buttons
    if(categoryButtons.length > 0) {
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                setActiveCategory(btn.getAttribute('data-cat'));
                document.getElementById('articulos').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }

    // Quick Filter Buttons (Above grid)
    if(quickFilters.length > 0) {
        quickFilters.forEach(btn => {
            btn.addEventListener('click', () => {
                setActiveCategory(btn.getAttribute('data-cat'));
            });
        });
    }

    // Article Badges (Inside cards)
    if(clickBadges.length > 0) {
        clickBadges.forEach(badge => {
            badge.addEventListener('click', (e) => {
                e.preventDefault();
                setActiveCategory(badge.textContent.trim());
                document.getElementById('articulos').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    if(resetBtn) {
        resetBtn.addEventListener('click', () => {
            if(searchInput) searchInput.value = '';
            setActiveCategory(null);
        });
    }
});
