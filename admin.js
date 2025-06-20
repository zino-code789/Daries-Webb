// Admin Panel JavaScript

// API URL
const API_URL = 'http://localhost:3000/api';

// DOM Elements
const toggleSidebarBtn = document.getElementById('toggle-sidebar');
const themeToggleBtn = document.getElementById('theme-toggle');
const addProductBtn = document.getElementById('add-product-btn');
const productForm = document.getElementById('product-form');
const newProductForm = document.getElementById('new-product-form');
const cancelProductBtn = document.getElementById('cancel-product');
const searchProductsInput = document.getElementById('search-products');
const categoryFilter = document.getElementById('category-filter');
const productsTableBody = document.getElementById('products-table-body');
const editModal = document.getElementById('edit-modal');
const editProductForm = document.getElementById('edit-product-form');
const closeModalBtn = document.querySelector('.close-modal');
const productImageInput = document.getElementById('product-image');
const previewImage = document.getElementById('preview-image');

// State
let products = [];
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    fetchProducts();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    toggleSidebarBtn.addEventListener('click', toggleSidebar);
    themeToggleBtn.addEventListener('click', toggleTheme);
    addProductBtn.addEventListener('click', showProductForm);
    cancelProductBtn.addEventListener('click', hideProductForm);
    newProductForm.addEventListener('submit', handleAddProduct);
    searchProductsInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    closeModalBtn.addEventListener('click', closeModal);
    productImageInput.addEventListener('change', handleImagePreview);
}

// Sidebar Toggle
function toggleSidebar() {
    document.querySelector('.sidebar').classList.toggle('collapsed');
}

// Theme Toggle
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    applyTheme();
}

function applyTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggleBtn.innerHTML = currentTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

// Product Form
function showProductForm() {
    productForm.classList.remove('hidden');
    addProductBtn.classList.add('hidden');
}

function hideProductForm() {
    productForm.classList.add('hidden');
    addProductBtn.classList.remove('hidden');
    newProductForm.reset();
    previewImage.classList.add('hidden');
}

// Image Preview
function handleImagePreview(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
}

// Fetch Products
async function fetchProducts() {
    try {
        const response = await fetch(`₵{API_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        products = await response.json();
        renderProducts();
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Add Product
async function handleAddProduct(e) {
    e.preventDefault();
    
    const product = {
        name: document.getElementById('product-name').value,
        price: parseFloat(document.getElementById('product-price').value),
        category: document.getElementById('product-category').value,
        description: document.getElementById('product-description').value,
        image: previewImage.src
    };

    try {
        const response = await fetch(`₵{API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) throw new Error('Failed to add product');
        
        const newProduct = await response.json();
        products.unshift(newProduct);
        renderProducts();
        hideProductForm();
        showNotification('Product added successfully!');
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Edit Product
async function handleEditProduct(id) {
    const product = products.find(p => p._id === id);
    if (!product) return;

    const form = editProductForm;
    form.innerHTML = `
        <div class="form-group">
            <label for="edit-name">Product Name</label>
            <input type="text" id="edit-name" value="₵{product.name}" required>
        </div>
        <div class="form-group">
            <label for="edit-price">Price</label>
            <input type="number" id="edit-price" value="₵{product.price}" step="0.01" required>
        </div>
        <div class="form-group">
            <label for="edit-category">Category</label>
            <select id="edit-category" required>
                <option value="men" ₵{product.category === 'men' ? 'selected' : ''}>Men</option>
                <option value="women" ₵{product.category === 'women' ? 'selected' : ''}>Women</option>
                <option value="kids" ₵{product.category === 'kids' ? 'selected' : ''}>Kids</option>
                <option value="accessories" ₵{product.category === 'accessories' ? 'selected' : ''}>Accessories</option>
            </select>
        </div>
        <div class="form-group">
            <label for="edit-description">Description</label>
            <textarea id="edit-description" required>₵{product.description}</textarea>
        </div>
        <div class="form-group">
            <label>Current Image</label>
            <img src="₵{product.image}" alt="₵{product.name}" style="max-width: 200px;">
        </div>
        <div class="form-actions">
            <button type="submit" class="primary-btn">Save Changes</button>
            <button type="button" class="secondary-btn" onclick="closeModal()">Cancel</button>
        </div>
    `;

    form.onsubmit = async (e) => {
        e.preventDefault();
        const updatedProduct = {
            name: document.getElementById('edit-name').value,
            price: parseFloat(document.getElementById('edit-price').value),
            category: document.getElementById('edit-category').value,
            description: document.getElementById('edit-description').value
        };

        try {
            const response = await fetch(`₵{API_URL}/products/₵{id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            });

            if (!response.ok) throw new Error('Failed to update product');

            const updated = await response.json();
            products = products.map(p => p._id === id ? updated : p);
            renderProducts();
            closeModal();
            showNotification('Product updated successfully!');
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    editModal.classList.remove('hidden');
}

// Delete Product
async function handleDeleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            const response = await fetch(`₵{API_URL}/products/₵{id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete product');

            products = products.filter(p => p._id !== id);
            renderProducts();
            showNotification('Product deleted successfully!');
        } catch (error) {
            showNotification(error.message, 'error');
        }
    }
}

// Filter Products
function filterProducts() {
    const searchTerm = searchProductsInput.value.toLowerCase();
    const category = categoryFilter.value;

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || product.category === category;
        return matchesSearch && matchesCategory;
    });

    renderProducts(filteredProducts);
}

// Render Products
function renderProducts(productsToRender = products) {
    productsTableBody.innerHTML = productsToRender.map(product => `
        <tr>
            <td><img src="₵{product.image}" alt="₵{product.name}"></td>
            <td>₵{product.name}</td>
            <td>₵{product.category}</td>
            <td>₵₵{product.price.toFixed(2)}</td>
            <td>
                <span class="status-badge ₵{product.status}">₵{product.status}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="handleEditProduct('₵{product._id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="handleDeleteProduct('₵{product._id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Modal
function closeModal() {
    editModal.classList.add('hidden');
}

// Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ₵{type}`;
    notification.innerHTML = `
        <i class="fas fa-₵{type === 'success' ? 'check' : 'exclamation'}-circle"></i>
        <span>₵{message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
} 