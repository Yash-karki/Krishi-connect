function getCart(){
  try { return JSON.parse(localStorage.getItem('cart')||'[]'); } catch(_e){ return []; }
}
function setCart(items){ localStorage.setItem('cart', JSON.stringify(items||[])); }

// Mock cart data to match the image
let cart = [
  {
    id: 1,
    name: "rice bag",
    price: 100,
    quantity: 1,
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGN0Y3Ii8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5SSUNFPC90ZXh0Pgo8L3N2Zz4K"
  },
  {
    id: 2,
    name: "wheat",
    price: 101.77,
    quantity: 2,
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGN0Y3Ii8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5XSEVBVDwvdGV4dD4KPC9zdmc+Cg=="
  },
  {
    id: 3,
    name: "pulses",
    price: 99.87,
    quantity: 1,
    image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGN0Y3Ii8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QVUxTRVM8L3RleHQ+Cjwvc3ZnPgo="
  }
];

function renderCart() {
  const cartItemsDiv = document.getElementById("cartItems");
  cartItemsDiv.innerHTML = "";

  let totalPrice = 0;

  cart.forEach(item => {
    totalPrice += item.price * item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <div class="item-details">
        <img src="${item.image}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGN0Y3Ii8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjNjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5QUk9EVUNUPC90ZXh0Pgo8L3N2Zz4K'">
        <div class="product-info">
          <h3>${item.name}</h3>
          <div class="product-id">#${Math.floor(Math.random() * 9000000000000) + 1000000000000}</div>
        </div>
      </div>
      <div class="quantity-control">
        <button onclick="updateQuantity(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${item.id}, 1)">+</button>
      </div>
      <div class="price">₹${(item.price * item.quantity).toFixed(2)}</div>
    `;
    cartItemsDiv.appendChild(div);
  });

  document.getElementById("totalPrice").innerText = totalPrice.toFixed(2);

  // Setup checkout button
  var checkoutBtn = document.getElementById('checkoutBtn');
  if(checkoutBtn){
    checkoutBtn.onclick = function(){
      var termsChecked = document.getElementById('termsCheck').checked;
      if (!termsChecked) {
        alert('Please agree to terms & conditions');
        return;
      }
      alert('Checkout successful!');
      cart = [];
      setCart(cart);
      renderCart();
      window.location.href = 'dashboard.html';
    };
  }
}

function updateQuantity(id, change) {
  cart = cart.map(item => {
    if (item.id === id) {
      const newQuantity = Math.max(1, (item.quantity||1) + change);
      return { ...item, quantity: newQuantity };
    }
    return item;
  });
  setCart(cart);
  renderCart();
}

// Initialize cart
renderCart();
