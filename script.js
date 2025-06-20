// Sample product data (in a real application, this would come from a backend)
const products = [
    {
        id: 1,
        name: "Tiles 1",
        price: 89.99,
        image: "Tiles images/ceramic-vs-vitrified-tiles-for-your-flooring-thumb-og.jpg",
        category: "tiles",
        description: "Premium Floor Tiles with comfortable cushioning",
        isNew: true
    },
    {
        id: 2,
        name: "T&G 2",
        price: 129.99,
        image: "T&G images/157194634-56a49f463df78cf772834e9f.jpg",
        category: "t&g",
        description: "Elegant T&G Tiles perfect for formal occasions",
        isNew: true
    },
    {
        id: 3,
        name: "WC 2",
        price: 79.99,
        image: "wc images/newsCover_2023_8_9_1691566315571-xmkv9.jpg",
        category: "wc",
        description: "Stylish Water Closet Tiles for a casual yet sophisticated look",
        isNew: false
    },
    {
        id: 4,
        name: "Tiles 3",
        price: 59.99,
        image: "Tiles images/ceramic-vs-vitrified-tiles-for-your-flooring-thumb-og.jpg",
        category: "tiles",
        description: "Lightweight Floor Tiles for everyday wear",
        isNew: true
    },
    {
        id: 5,
        name: "T&G 1",
        price: 149.99,
        image: "T&G images/157194634-56a49f463df78cf772834e9f.jpg",
        category: "t&g",
        description: "Premium T&G Tiles with modern design",
        isNew: false
    },
    {
        id: 6,
        name: "WC 1",
        price: 49.99,
        image: "wear-6.jpg",
        category: "wc",
        description: "Comfortable Water Closet Tiles perfect for summer days",
        isNew: true
    }
];

// Cart functionality
let cart = [];

// Order History functionality
let orders = JSON.parse(localStorage.getItem('orders') || '[]');

// DOM Elements
const productContainer = document.getElementById('product-container');
const cartSidebar = document.getElementById('cart-sidebar');
const cartItems = document.getElementById('cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotalAmount = document.getElementById('cart-total-amount');
const cartIcon = document.querySelector('.cart-icon');
const closeCart = document.querySelector('.close-cart');

// Search functionality
let searchResults = [];

// Dark Mode Toggle
const darkModeToggle = document.getElementById('dark-mode-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
const currentTheme = localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light');

// Apply the theme
document.documentElement.setAttribute('data-theme', currentTheme);
updateDarkModeIcon(currentTheme);

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateDarkModeIcon(newTheme);
});

// Update dark mode icon
function updateDarkModeIcon(theme) {
    const icon = darkModeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Listen for system theme changes
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        updateDarkModeIcon(newTheme);
    }
});

// Check authentication status
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        // Clear any remaining data
        localStorage.removeItem('cart');
        localStorage.removeItem('cartCount');
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Initialize the website
function init() {
    if (!checkAuth()) return;
    
    displayProducts();
    displayNewArrivals();
    setupEventListeners();
    updateUserInterface();
}

// Add event listener for add to cart buttons
function setupAddToCartListeners(container) {
    container.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
            showNotification('Product added to cart!');
        });
    });
}

// Display products in the product grid
function displayProducts() {
    productContainer.innerHTML = products.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-overlay">
                    <button class="quick-view" data-id="${product.id}">Quick View</button>
                </div>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">₵${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');

    // Add event listeners for quick view buttons
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            showQuickView(productId);
        });
    });

    // Add event listeners for add to cart buttons
    setupAddToCartListeners(productContainer);
}

// Display new arrivals
function displayNewArrivals() {
    const newArrivalsContainer = document.getElementById('new-arrivals-container');
    const newProducts = products.filter(product => product.isNew);

    newArrivalsContainer.innerHTML = newProducts.map(product => `
        <div class="new-arrival-card">
            <div class="new-arrival-badge">New</div>
            <div class="new-arrival-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="new-arrival-overlay">
                    <button class="quick-view" data-id="${product.id}">Quick View</button>
                </div>
            </div>
            <div class="new-arrival-info">
                <h3>${product.name}</h3>
                <p class="price">₵${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');

    // Add event listeners for quick view buttons
    newArrivalsContainer.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            showQuickView(productId);
        });
    });

    // Add event listeners for add to cart buttons
    setupAddToCartListeners(newArrivalsContainer);
}

// Add quick view functionality
function showQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.createElement('div');
    modal.className = 'quick-view-modal';
    modal.innerHTML = `
        <div class="quick-view-content">
            <button class="close-quick-view"><i class="fas fa-times"></i></button>
            <div class="quick-view-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="quick-view-details">
                <h2>${product.name}</h2>
                <p class="description">${product.description}</p>
                <p class="price">₵${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.classList.add('active');

    // Add event listeners
    const closeBtn = modal.querySelector('.close-quick-view');
    const addToCartBtn = modal.querySelector('.add-to-cart');

    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    addToCartBtn.addEventListener('click', () => {
        addToCart(productId);
        modal.remove();
        showNotification('Product added to cart!');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navContainer.classList.toggle('active');
        document.body.style.overflow = navContainer.classList.contains('active') ? 'hidden' : '';
    });

    // Category filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterProducts(button.dataset.category);
        });
    });

    // Category overlay click functionality
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        const overlay = card.querySelector('.category-overlay');
        overlay.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default anchor behavior
            const category = card.dataset.category;
            filterProducts(category);
            // Scroll to collection section
            document.getElementById('collection').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navContainer.classList.contains('active') && 
            !navContainer.contains(e.target) && 
            !mobileMenuBtn.contains(e.target)) {
            mobileMenuBtn.classList.remove('active');
            navContainer.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            navContainer.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Cart toggle
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            handleNewsletterSignup(email);
        });
    }

    // Checkout button functionality
    const checkoutButton = document.querySelector('.checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', handleCheckout);
    }

    // Order history button
    const ordersBtn = document.getElementById('orders-btn');
    if (ordersBtn) {
        ordersBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showOrderHistory();
        });
    }

    // Search functionality
    const searchBtn = document.querySelector('a[href="#search"]');
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showSearchModal();
        });
    }

    // User account functionality
    const accountBtn = document.querySelector('a[href="#account"]');
    if (accountBtn) {
        accountBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showAccountModal();
        });
    }

    // Add logout button to account modal
    const accountModal = document.querySelector('.account-modal');
    if (accountModal) {
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'logout-btn';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutBtn.addEventListener('click', handleLogout);
        accountModal.querySelector('.account-header').appendChild(logoutBtn);
    }

    // Add sign out button event listener
    const signOutBtn = document.getElementById('signout-btn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', handleSignOut);
    }

    // Floating cart click handler
    const floatingCart = document.getElementById('floating-cart');
    if (floatingCart) {
        floatingCart.addEventListener('click', () => {
            cartSidebar.classList.add('active');
        });
    }
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showNotification('Product added to cart!');
}

// Update cart display
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update floating cart count
    const floatingCartCount = document.querySelector('.floating-cart-count');
    if (floatingCartCount) {
        floatingCartCount.textContent = totalItems;
    }

    // Show/hide floating cart based on cart items
    const floatingCart = document.getElementById('floating-cart');
    if (floatingCart) {
        if (totalItems > 0) {
            floatingCart.classList.remove('hide');
        } else {
            floatingCart.classList.add('hide');
        }
    }

    // Update cart items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
            </div>
            <button class="remove-item" data-id="${item.id}">×</button>
        </div>
    `).join('');

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalAmount.textContent = total.toFixed(2);

    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            removeFromCart(productId);
        });
    });
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('Product removed from cart!');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Add icon based on notification type
    let icon;
    switch(type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i>';
    }
    
    notification.innerHTML = `${icon}${message}`;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Handle newsletter signup
function handleNewsletterSignup(email) {
    // In a real application, this would send the email to a backend
    console.log('Newsletter signup:', email);
    showNotification('Thank you for subscribing to our newsletter!');
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    const modal = createCheckoutModal();
    document.body.appendChild(modal);
    modal.classList.add('active');

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Handle form submission
    const checkoutForm = modal.querySelector('.checkout-form');
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        processOrder(checkoutForm);
    });
}

function createCheckoutModal() {
    const modal = document.createElement('div');
    modal.className = 'checkout-modal';
    modal.innerHTML = `
        <div class="checkout-content">
            <h2>Complete Your Order</h2>
            <form class="checkout-form">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" required>
                </div>
                <div class="form-group">
                    <label for="address">Shipping Address</label>
                    <textarea id="address" name="address" required></textarea>
                </div>
                <div class="order-summary">
                    <h3>Order Summary</h3>
                    <div class="summary-items">
                        ${cart.map(item => `
                            <div class="summary-item">
                                <div class="summary-item-details">
                                    <img src="${item.image}" alt="${item.name}" class="summary-item-image">
                                    <div class="summary-item-info">
                                        <span class="summary-item-name">${item.name}</span>
                                        <span class="summary-item-quantity">Quantity: ${item.quantity}</span>
                                    </div>
                                </div>
                                <span class="summary-item-price">₵${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="summary-total">
                        <strong>Total:</strong>
                        <strong>$${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</strong>
                    </div>
                </div>
                <button type="submit" class="confirm-order">Pay with Paystack</button>
            </form>
        </div>
    `;
    return modal;
}

function processOrder(form) {
    try {
        const formData = new FormData(form);
        const customerInfo = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address')
        };

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Check if PaystackPop is available
        if (typeof PaystackPop === 'undefined') {
            console.error('Paystack script not loaded');
            showNotification('Payment system not available. Please try again later.', 'error');
            return;
        }

        // Play payment processing sound
        const processingSound = document.getElementById('payment-processing-sound');
        if (processingSound) {
            processingSound.play().catch(error => {
                console.log('Audio playback failed:', error);
            });
        }

        // Generate a unique reference for this transaction
        const transactionRef = 'AYW-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

        // Initialize Paystack payment
        const handler = PaystackPop.setup({
            key: 'pk_test_5eb21e1b62c2170fd6b855f43c40dbcb59364157',
            email: customerInfo.email,
            amount: Math.round(total * 100),
            currency: 'GHS',
            ref: transactionRef,
            metadata: {
                custom_fields: [
                    {
                        display_name: "Customer Name",
                        variable_name: "customer_name",
                        value: customerInfo.name
                    },
                    {
                        display_name: "Phone Number",
                        variable_name: "phone_number",
                        value: customerInfo.phone
                    },
                    {
                        display_name: "Shipping Address",
                        variable_name: "shipping_address",
                        value: customerInfo.address
                    }
                ]
            },
            callback: function(response) {
                // Stop the processing sound
                if (processingSound) {
                    processingSound.pause();
                    processingSound.currentTime = 0;
                }

                // Play success sound
                const successSound = document.getElementById('payment-success-sound');
                if (successSound) {
                    successSound.play().catch(error => {
                        console.log('Success sound playback failed:', error);
                    });
                }

                // Create order object
                const orderData = {
                    customerInfo: customerInfo,
                    items: cart,
                    total: total,
                    paymentReference: response.reference,
                    transactionId: response.transaction,
                    status: 'success',
                    date: new Date().toISOString()
                };

                // Add to orders array
                orders.unshift(orderData);
                localStorage.setItem('orders', JSON.stringify(orders));
                
                handleOrderSuccess(orderData);
            },
            onClose: function() {
                // Stop the processing sound
                if (processingSound) {
                    processingSound.pause();
                    processingSound.currentTime = 0;
                }
                showNotification('Payment cancelled. Please try again.', 'error');
            }
        });

        handler.openIframe();
    } catch (error) {
        console.error('Error processing payment:', error);
        showNotification('An error occurred while processing your payment. Please try again.', 'error');
    }
}

function handleOrderSuccess(orderData) {
    // Clear cart
    cart = [];
    updateCart();
    
    // Create modern success alert
    const successAlert = document.createElement('div');
    successAlert.className = 'success-alert';
    successAlert.innerHTML = `
        <div class="success-alert-content">
            <div class="success-header">
                <h3><i class="fas fa-check-circle"></i> Order Placed Successfully!</h3>
                <button class="close-alert"><i class="fas fa-times"></i></button>
            </div>
            <div class="success-body" id="order-success-content">
                <div class="success-icon">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <div class="order-details">
                    <div class="detail-item">
                        <span class="label">Order Reference:</span>
                        <span class="value">${orderData.paymentReference}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Total Amount:</span>
                        <span class="value">$${orderData.total.toFixed(2)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Date:</span>
                        <span class="value">${new Date().toLocaleDateString()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="label">Status:</span>
                        <span class="value status-success">Confirmed</span>
                    </div>
                </div>
                <div class="success-message">
                    <p>A confirmation email has been sent to your email address.</p>
                </div>
            </div>
            <div class="success-actions">
                <button class="screenshot-btn" id="take-screenshot">
                    <i class="fas fa-camera"></i> Take Screenshot
                </button>
                <button class="continue-btn" id="continue-shopping">
                    <i class="fas fa-shopping-cart"></i> Continue Shopping
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(successAlert);
    
    // Add event listeners
    const closeBtn = successAlert.querySelector('.close-alert');
    const screenshotBtn = successAlert.querySelector('#take-screenshot');
    const continueBtn = successAlert.querySelector('#continue-shopping');
    
    closeBtn.addEventListener('click', () => {
        successAlert.remove();
        window.location.href = 'index.html';
    });
    
    screenshotBtn.addEventListener('click', async () => {
        try {
            const content = document.getElementById('order-success-content');
            const canvas = await html2canvas(content, {
                backgroundColor: '#ffffff',
                scale: 2, // Higher quality
                logging: false,
                useCORS: true
            });
            
            // Convert to blob
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `order-${orderData.paymentReference}.png`;
                link.click();
                URL.revokeObjectURL(url);
                
                showNotification('Screenshot saved successfully!', 'success');
            }, 'image/png');
        } catch (error) {
            console.error('Screenshot failed:', error);
            showNotification('Failed to take screenshot. Please try again.', 'error');
        }
    });
    
    continueBtn.addEventListener('click', () => {
        successAlert.remove();
        window.location.href = 'index.html';
    });
    
    // Close all active modals
    const modals = document.querySelectorAll('.checkout-modal, .cart-sidebar, .quick-view-modal, .search-modal, .account-modal');
    modals.forEach(modal => {
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        }
    });
    
    // Reset mobile menu if open
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');
    if (mobileMenuBtn && navContainer) {
        mobileMenuBtn.classList.remove('active');
        navContainer.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Update order history
    updateOrderHistory();
}

function showOrderHistory() {
    const orderHistoryList = document.getElementById('order-history-list');
    const orderHistoryModal = document.getElementById('order-history-modal');

    // Add filter controls to the modal header
    const orderHistoryHeader = document.querySelector('.order-history-header');
    orderHistoryHeader.innerHTML = `
        <div class="order-history-controls">
            <h2>Order History</h2>
            <div class="order-filters">
                <select id="status-filter">
                    <option value="">All Status</option>
                    <option value="success">Success</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
                <input type="date" id="date-filter" placeholder="Filter by date">
                <button id="export-orders" class="export-btn">
                    <i class="fas fa-download"></i> Export
                </button>
            </div>
        </div>
        <button class="close-order-history"><i class="fas fa-times"></i></button>
    `;

    // Add event listeners for filters
    const statusFilter = document.getElementById('status-filter');
    const dateFilter = document.getElementById('date-filter');
    const exportBtn = document.getElementById('export-orders');
    const closeBtn = document.querySelector('.close-order-history');

    // Close button functionality
    closeBtn.addEventListener('click', () => {
        orderHistoryModal.classList.remove('active');
    });

    // Close on outside click
    orderHistoryModal.addEventListener('click', (e) => {
        if (e.target === orderHistoryModal) {
            orderHistoryModal.classList.remove('active');
        }
    });

    function filterOrders() {
        const status = statusFilter.value;
        const date = dateFilter.value;

        let filteredOrders = orders;

        if (status) {
            filteredOrders = filteredOrders.filter(order => order.status === status);
        }

        if (date) {
            const filterDate = new Date(date).toDateString();
            filteredOrders = filteredOrders.filter(order => 
                new Date(order.date).toDateString() === filterDate
            );
        }

        displayOrders(filteredOrders);
    }

    function displayOrders(ordersToDisplay) {
        if (ordersToDisplay.length === 0) {
            orderHistoryList.innerHTML = `
                <div class="empty-orders">
                    <p>No orders found</p>
                </div>
            `;
            return;
        }

        orderHistoryList.innerHTML = ordersToDisplay.map(order => `
            <div class="order-card">
                <div class="order-header">
                    <span class="order-reference">Order #${order.paymentReference}</span>
                    <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
                </div>
                <div class="order-details">
                    <p><strong>Customer:</strong> ${order.customerInfo.name}</p>
                    <p><strong>Email:</strong> ${order.customerInfo.email}</p>
                    <p><strong>Phone:</strong> ${order.customerInfo.phone}</p>
                    <p><strong>Address:</strong> ${order.customerInfo.address}</p>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <span>${item.name} x ${item.quantity}</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    <span>Total Amount:</span>
                    <span>$${order.total.toFixed(2)}</span>
                </div>
                <div class="order-actions">
                    <div class="order-status status-${order.status}">
                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                    ${order.status === 'pending' ? `
                        <button class="cancel-order" data-reference="${order.paymentReference}">
                            Cancel Order
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');

        // Add event listeners for cancel buttons
        document.querySelectorAll('.cancel-order').forEach(button => {
            button.addEventListener('click', (e) => {
                const reference = e.target.dataset.reference;
                cancelOrder(reference);
            });
        });
    }

    function exportOrders() {
        const ordersToExport = orders.map(order => ({
            reference: order.paymentReference,
            date: new Date(order.date).toLocaleDateString(),
            customer: order.customerInfo.name,
            email: order.customerInfo.email,
            phone: order.customerInfo.phone,
            address: order.customerInfo.address,
            items: order.items.map(item => `${item.name} x ${item.quantity}`).join(', '),
            total: order.total,
            status: order.status
        }));

        const csv = convertToCSV(ordersToExport);
        downloadCSV(csv, 'order-history.csv');
    }

    function convertToCSV(data) {
        const headers = ['Reference', 'Date', 'Customer', 'Email', 'Phone', 'Address', 'Items', 'Total', 'Status'];
        const rows = data.map(order => [
            order.reference,
            order.date,
            order.customer,
            order.email,
            order.phone,
            order.address,
            order.items,
            order.total,
            order.status
        ]);

        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    function downloadCSV(csv, filename) {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function cancelOrder(reference) {
        if (confirm('Are you sure you want to cancel this order?')) {
            const orderIndex = orders.findIndex(order => order.paymentReference === reference);
            if (orderIndex !== -1) {
                orders[orderIndex].status = 'failed';
                localStorage.setItem('orders', JSON.stringify(orders));
                showNotification('Order cancelled successfully', 'success');
                filterOrders(); // Refresh the display
            }
        }
    }

    // Add event listeners
    statusFilter.addEventListener('change', filterOrders);
    dateFilter.addEventListener('change', filterOrders);
    exportBtn.addEventListener('click', exportOrders);

    // Initial display
    displayOrders(orders);
    orderHistoryModal.classList.add('active');
}

function showSearchModal() {
    const modal = document.createElement('div');
    modal.className = 'search-modal';
    modal.innerHTML = `
        <div class="search-content">
            <div class="search-header">
                <h2>Search Products</h2>
                <button class="close-search"><i class="fas fa-times"></i></button>
            </div>
            <div class="search-body">
                <div class="search-input-container">
                    <input type="text" id="search-input" placeholder="Search for products...">
                    <button id="search-button"><i class="fas fa-search"></i></button>
                </div>
                <div class="search-filters">
                    <select id="category-filter">
                        <option value="">All Categories</option>
                        <option value="sneakers">Sneakers</option>
                        <option value="formal">Formal Shoes</option>
                        <option value="boots">Boots</option>
                        <option value="sandals">Sandals</option>
                    </select>
                    <select id="price-filter">
                        <option value="">All Prices</option>
                        <option value="0-50">$0 - $50</option>
                        <option value="51-100">$51 - $100</option>
                        <option value="101-150">$101 - $150</option>
                        <option value="151+">$151+</option>
                    </select>
                </div>
                <div id="search-results" class="search-results"></div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.classList.add('active');

    const searchInput = modal.querySelector('#search-input');
    const searchButton = modal.querySelector('#search-button');
    const categoryFilter = modal.querySelector('#category-filter');
    const priceFilter = modal.querySelector('#price-filter');
    const searchResults = modal.querySelector('#search-results');
    const closeSearch = modal.querySelector('.close-search');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const priceRange = priceFilter.value;

        let filteredProducts = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm);
            const matchesCategory = !category || product.category === category;
            const matchesPrice = !priceRange || checkPriceRange(product.price, priceRange);
            return matchesSearch && matchesCategory && matchesPrice;
        });

        displaySearchResults(filteredProducts);
    }

    function checkPriceRange(price, range) {
        switch(range) {
            case '0-50': return price <= 50;
            case '51-100': return price > 50 && price <= 100;
            case '101-150': return price > 100 && price <= 150;
            case '151+': return price > 150;
            default: return true;
        }
    }

    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p class="no-results">No products found</p>';
            return;
        }

        searchResults.innerHTML = results.map(product => `
            <div class="search-result-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="result-details">
                    <h3>${product.name}</h3>
                    <p class="price">₵${product.price.toFixed(2)}</p>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `).join('');

        // Add event listeners to the new Add to Cart buttons
        setupAddToCartListeners(searchResults);
    }

    searchInput.addEventListener('input', performSearch);
    searchButton.addEventListener('click', performSearch);
    categoryFilter.addEventListener('change', performSearch);
    priceFilter.addEventListener('change', performSearch);

    closeSearch.addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function showAccountModal() {
    const modal = document.createElement('div');
    modal.className = 'account-modal';
    modal.innerHTML = `
        <div class="account-content">
            <div class="account-header">
                <h2>My Account</h2>
                <button class="close-account"><i class="fas fa-times"></i></button>
            </div>
            <div class="account-body">
                <div class="account-tabs">
                    <button class="tab-btn active" data-tab="profile">Profile</button>
                    <button class="tab-btn" data-tab="orders">Orders</button>
                    <button class="tab-btn" data-tab="settings">Settings</button>
                </div>
                <div class="tab-content">
                    <div class="tab-pane active" id="profile">
                        <form class="profile-form">
                            <div class="form-group">
                                <label for="profile-name">Full Name</label>
                                <input type="text" id="profile-name" value="${localStorage.getItem('userName') || ''}">
                            </div>
                            <div class="form-group">
                                <label for="profile-email">Email</label>
                                <input type="email" id="profile-email" value="${localStorage.getItem('userEmail') || ''}">
                            </div>
                            <div class="form-group">
                                <label for="profile-phone">Phone</label>
                                <input type="tel" id="profile-phone" value="${localStorage.getItem('userPhone') || ''}">
                            </div>
                            <button type="submit" class="save-profile">Save Changes</button>
                        </form>
                    </div>
                    <div class="tab-pane" id="orders">
                        <div class="account-orders">
                            ${orders.length === 0 ? '<p>No orders found</p>' : orders.map(order => `
                                <div class="account-order-card">
                                    <div class="order-header">
                                        <span>Order #${order.paymentReference}</span>
                                        <span>${new Date(order.date).toLocaleDateString()}</span>
                                    </div>
                                    <div class="order-status status-${order.status}">
                                        ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="tab-pane" id="settings">
                        <form class="settings-form">
                            <div class="form-group">
                                <label for="notification-settings">Email Notifications</label>
                                <select id="notification-settings">
                                    <option value="all">All Notifications</option>
                                    <option value="orders">Orders Only</option>
                                    <option value="none">None</option>
                                </select>
                            </div>
                            <button type="submit" class="save-settings">Save Settings</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    modal.classList.add('active');

    // Tab switching functionality
    const tabBtns = modal.querySelectorAll('.tab-btn');
    const tabPanes = modal.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding tab pane
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === tabId) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // Profile form submission
    const profileForm = modal.querySelector('.profile-form');
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = modal.querySelector('#profile-name').value;
        const email = modal.querySelector('#profile-email').value;
        const phone = modal.querySelector('#profile-phone').value;

        localStorage.setItem('userName', name);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPhone', phone);

        showNotification('Profile updated successfully!', 'success');
    });

    // Settings form submission
    const settingsForm = modal.querySelector('.settings-form');
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const notificationSettings = modal.querySelector('#notification-settings').value;
        localStorage.setItem('notificationSettings', notificationSettings);
        showNotification('Settings saved successfully!', 'success');
    });

    // Close modal functionality
    const closeAccount = modal.querySelector('.close-account');
    closeAccount.addEventListener('click', () => {
        modal.remove();
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function handleSignOut() {
    // Clear all user-related data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    localStorage.removeItem('cartCount');
    
    // Show success notification
    showNotification('Successfully signed out', 'success');
    
    // Redirect to login page after a short delay
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

function updateUserInterface() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        // Update account icon to show user is logged in
        const accountIcon = document.querySelector('.nav-icons a[href="#account"] i');
        accountIcon.classList.remove('fa-user');
        accountIcon.classList.add('fa-user-check');
        
        // Add user name to account modal
        const accountModal = document.querySelector('.account-modal');
        if (accountModal) {
            const userName = document.createElement('div');
            userName.className = 'user-name';
            userName.textContent = `Welcome, ${currentUser.name}`;
            accountModal.querySelector('.account-header').prepend(userName);
        }
    }
}

// Initialize the website when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Preloader
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
    }, 2000); // Show preloader for 2 seconds
});

// Add this new function for filtering products
function filterProducts(category) {
    // Remove active class from all buttons
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    // Add active class to the corresponding button
    const activeButton = document.querySelector(`.filter-btn[data-category="${category}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productCategory = card.dataset.category;
        if (category === 'all' || category === productCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}