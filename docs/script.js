// Smooth scrolling for navigation links
document.addEventListener("DOMContentLoaded", function () {
    // Handle navigation link clicks for smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });

    // Copy to clipboard functionality
    window.copyToClipboard = function (text) {
        navigator.clipboard
            .writeText(text)
            .then(function () {
                // Find the button that was clicked and show feedback
                const button = event.target;
                const originalText = button.textContent;
                button.textContent = "Copied!";
                button.style.background = "#10b981";

                setTimeout(() => {
                    button.textContent = originalText;
                    button.style.background = "#374151";
                }, 2000);
            })
            .catch(function (err) {
                console.error("Failed to copy text: ", err);
            });
    };

    // Add copy buttons to all code blocks that don't already have them
    document
        .querySelectorAll(".code-block:not(:has(.copy-btn)) pre code")
        .forEach((codeElement) => {
            const codeBlock = codeElement.closest(".code-block");
            if (codeBlock && !codeBlock.querySelector(".copy-btn")) {
                const copyBtn = document.createElement("button");
                copyBtn.className = "copy-btn";
                copyBtn.textContent = "Copy";
                copyBtn.onclick = function () {
                    copyToClipboard(codeElement.textContent);
                };
                codeBlock.appendChild(copyBtn);
            }
        });

    // Highlight active navigation link based on scroll position
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    const sections = document.querySelectorAll("section[id]");

    function highlightNavLink() {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop <= 100 && sectionTop > -section.offsetHeight) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === "#" + current) {
                link.classList.add("active");
            }
        });
    }

    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener("scroll", function () {
        if (!ticking) {
            requestAnimationFrame(function () {
                highlightNavLink();
                ticking = false;
            });
            ticking = true;
        }
    });

    // API sidebar navigation
    const apiNavLinks = document.querySelectorAll('.api-nav a[href^="#"]');
    apiNavLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });

                // Update active state
                apiNavLinks.forEach((l) => l.classList.remove("active"));
                this.classList.add("active");
            }
        });
    });

    // Examples page navigation
    const exampleNavLinks = document.querySelectorAll(".example-nav-link");
    exampleNavLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
        });
    });

    // Add loading animation for code blocks
    document.querySelectorAll(".code-block").forEach((block) => {
        const pre = block.querySelector("pre");
        if (pre) {
            pre.style.opacity = "0";
            pre.style.transform = "translateY(10px)";
            pre.style.transition = "opacity 0.3s ease, transform 0.3s ease";

            // Use intersection observer for animation
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const pre = entry.target.querySelector("pre");
                            if (pre) {
                                setTimeout(() => {
                                    pre.style.opacity = "1";
                                    pre.style.transform = "translateY(0)";
                                }, 100);
                            }
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1 }
            );

            observer.observe(block);
        }
    });

    // Feature cards animation
    const featureCards = document.querySelectorAll(
        ".feature-card, .example-card, .install-card"
    );
    const cardObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    cardObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );

    featureCards.forEach((card) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        cardObserver.observe(card);
    });

    // Mobile navigation toggle (if needed in future)
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");

    if (navToggle && navMenu) {
        navToggle.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });
    }

    // Search functionality (placeholder for future implementation)
    const searchInput = document.querySelector(".search-input");
    if (searchInput) {
        searchInput.addEventListener("input", function () {
            const query = this.value.toLowerCase();
            // Implement search logic here
            console.log("Searching for:", query);
        });
    }

    // Dark mode toggle (placeholder for future implementation)
    const darkModeToggle = document.querySelector(".dark-mode-toggle");
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
            localStorage.setItem(
                "darkMode",
                document.body.classList.contains("dark-mode")
            );
        });

        // Load dark mode preference
        if (localStorage.getItem("darkMode") === "true") {
            document.body.classList.add("dark-mode");
        }
    }

    // Initialize DocManager and load dynamic content
    if (window.docManager) {
        window.docManager.init().then(() => {
            // Load quick start section if on homepage
            const quickStartContainer = document.querySelector(
                ".quick-start-content"
            );
            if (quickStartContainer) {
                window.docManager.renderQuickStart("quick-start");
            }

            // Load examples if on examples page
            const examplesContainer =
                document.querySelector(".examples-content");
            if (examplesContainer) {
                window.docManager.renderExamplesPage().then(() => {
                    // Re-apply animations to new content
                    const newCards = document.querySelectorAll(
                        ".example:not(.animated)"
                    );
                    newCards.forEach((card) => {
                        card.classList.add("animated");
                        card.style.opacity = "0";
                        card.style.transform = "translateY(20px)";
                        card.style.transition =
                            "opacity 0.6s ease, transform 0.6s ease";
                        cardObserver.observe(card);
                    });

                    // Apply syntax highlighting
                    window.docManager.highlightCode();
                });
            } else {
                // Apply syntax highlighting to static content
                window.docManager.highlightCode();
            }
        });
    }

    // Performance optimization: lazy load images if any
    const images = document.querySelectorAll("img[data-src]");
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute("data-src");
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach((img) => imageObserver.observe(img));
    }
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Export functions for potential use in other scripts
window.RyleJSDocs = {
    copyToClipboard: window.copyToClipboard,
    debounce,
    throttle,
};
