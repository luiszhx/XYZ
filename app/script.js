let products = [
    { id: 1, name: 'Producto 1', price: 10, img: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Producto 2', price: 15, img: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Producto 3', price: 20, img: 'https://via.placeholder.com/150' },
];

let cart = [];
let editProductId = null; // ID del producto que se está editando
let isFormDisabled = true; // Estado inicial del formulario deshabilitado

const ADMIN_PASSWORD = 'admin123'; // Cambia esto por tu contraseña

function displayProducts() {
    const productsDiv = document.getElementById('products');
    productsDiv.innerHTML = ''; // Limpiar productos existentes
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Precio: S/${product.price}</p>
            <input type="number" min="1" value="1" id="quantity-${product.id}">
            <button onclick="addToCart(${product.id})">Añadir al carrito</button>
            ${!isFormDisabled ? `<button onclick="editProduct(${product.id})">Editar</button>` : ''}
        `;
        productsDiv.appendChild(productDiv);
    });
}

function addToCart(productId) {
    const quantity = document.getElementById(`quantity-${productId}`).value;
    const product = products.find(p => p.id === productId);
    const cartItem = { ...product, quantity: parseInt(quantity) };
    cart.push(cartItem);
    updateCart();
    alert('Producto añadido al carrito');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} x${item.quantity} - S/${item.price * item.quantity}`;
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Eliminar';
        removeButton.className = 'remove-button';
        removeButton.onclick = () => removeFromCart(item.id);
        li.appendChild(removeButton);
        cartItemsDiv.appendChild(li);
    });
}

document.getElementById('buy-button').addEventListener('click', () => {
    const message = 'Pedido:\n' + cart.map(item => `${item.name} x${item.quantity} - S/${item.price * item.quantity}`).join('\n');
    const whatsappUrl = `https://wa.me/51923763485?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
});

// Añadir nuevo producto o editar producto existente
document.getElementById('add-product-button').addEventListener('click', () => {
    if (isFormDisabled) {
        alert('La opción de añadir productos está desactivada.');
        return; // Salir si está deshabilitado
    }

    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const img = document.getElementById('product-img').value;

    if (name && !isNaN(price) && img) {
        if (editProductId) {
            // Editar producto existente
            const productIndex = products.findIndex(p => p.id === editProductId);
            products[productIndex] = { id: editProductId, name, price, img };
            editProductId = null; // Reiniciar ID de edición
            alert('Producto editado');
        } else {
            // Añadir nuevo producto
            const newProduct = {
                id: products.length + 1,
                name: name,
                price: price,
                img: img
            };
            products.push(newProduct);
            alert('Producto añadido');
        }
        displayProducts();
        clearForm();
    } else {
        alert('Por favor, complete todos los campos correctamente.');
    }
});

// Cargar datos del producto en el formulario para editar
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-img').value = product.img;
    editProductId = productId;
}

// Función para limpiar el formulario
function clearForm() {
    document.getElementById('product-name').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-img').value = '';
}

// Manejo de inicio de sesión del administrador
document.getElementById('login-button').addEventListener('click', () => {
    const password = document.getElementById('admin-password').value;
    if (password === ADMIN_PASSWORD) {
        isFormDisabled = false; // Habilitar formulario
        alert('Inicio de sesión exitoso');
        document.querySelector('.add-product').classList.remove('disabled');
        document.getElementById('toggle-form-button').style.display = 'block';
        document.getElementById('toggle-form-button').textContent = 'Desactivar Añadir Producto';
        displayProducts(); // Mostrar productos inmediatamente
    } else {
        alert('Contraseña incorrecta');
    }
});

// Alternar habilitación del formulario de añadir productos
document.getElementById('toggle-form-button').addEventListener('click', () => {
    isFormDisabled = !isFormDisabled;
    document.querySelector('.add-product').classList.toggle('disabled');
    document.getElementById('toggle-form-button').textContent = isFormDisabled ? 'Activar Añadir Producto' : 'Desactivar Añadir Producto';
});
