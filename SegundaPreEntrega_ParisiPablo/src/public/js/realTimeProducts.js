const socket = io();

document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById("productList");
    productList.innerHTML = '';
    
    socket.emit('getProducts');
    
    socket.on('response', (products) => {
        productList.innerHTML = '';
        products.forEach(product => {
            displayProduct(product);
        });
    });
});

const buttonAdd = document.getElementById("addProductButton");
buttonAdd.addEventListener("click", (event) => {
    event.preventDefault();
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const code = document.getElementById("code").value.trim();
    const price = parseFloat(document.getElementById("price").value.trim());
    const stock = parseInt(document.getElementById("stock").value.trim());
    const category = document.getElementById("category").value.trim();


    if (isNaN(price) || price <= 0) {
        alert("Price must be positive numbers.");
        return;
    }

    if (isNaN(stock) || stock <= 0) {
        alert("Stock must be positive numbers.");
        return;
    }
    
    if (!title || !description || !code || !category || !price || !stock) {
        alert("All fields must be filled out.");
        return;
    }

    const product = {
        title: title,
        description: description,
        code: code,
        price: price,
        status: true,
        stock: stock,
        category: category,
        thumbnails: [],
    };

    socket.emit('addProduct', product);
    clearForm();

    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Product added successfully',
        showConfirmButton: false,
        timer: 1500,
        background: '#52B95BE6',
        iconColor: 'white', 
        customClass: {
            popup: 'swal2Custom',
            title: 'swal2TitleCustom'
        }
    });
});

function displayProduct(product) {
    const productList = document.getElementById("productList");
    const productItem = document.createElement("div");
    productItem.classList.add('productItem');
    productItem.innerHTML = `<div class="productContainer">
                                <div class="productCard">
                                    <h3 id="${product.id}">${product.title}</h3>
                                    <h4>Description: ${product.description}</h4> 
                                    <p>Code: ${product.code}</p>
                                    <p>Price: $${product.price}</p>
                                    <p>Stock: ${product.stock}</p>
                                    <p>Category: ${product.category}</p>
                                    <button type="button" class="deleteButton">Delete Product</button>
                                </div>
                            </div>`;
    productList.appendChild(productItem);
}

const productList = document.getElementById("productList")
productList.addEventListener("click", (event) => {
    if (event.target.classList.contains('deleteButton')) {
        const productItem = event.target.closest('.productItem');
        const productId = productItem.querySelector('h3').id;
        productList.removeChild(productItem);
        socket.emit('deleteProduct', productId);
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Product deleted successfully',
            showConfirmButton: false,
            timer: 1500,
            background: '#52B95BE6',
            iconColor: 'white', 
            customClass: {
                popup: 'swal2Custom',
                title: 'swal2TitleCustom'
            }
        });
    }
});

function clearForm() {
    document.getElementById("productForm").reset();
}