function getCart(){
  try { return JSON.parse(localStorage.getItem('cart')||'[]'); } catch(_e){ return []; }
}
function setCart(items){ localStorage.setItem('cart', JSON.stringify(items||[])); }
let cart = getCart();

function renderCart() {
  const cartItemsDiv = document.getElementById("cartItems");
  cartItemsDiv.innerHTML = "";

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(item => {
    totalItems += item.quantity;
    totalPrice += item.price * item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="https://i.ibb.co/N2cr9kP/spinach.jpg" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p>₹${item.price} per kg</p>
      </div>
      <div class="quantity-control">
        <button onclick="updateQuantity(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="updateQuantity(${item.id}, 1)">+</button>
      </div>
      <p><strong>₹${item.price * item.quantity}</strong></p>
    `;
    cartItemsDiv.appendChild(div);
  });

  document.getElementById("totalItems").innerText = totalItems;
  document.getElementById("totalPrice").innerText = totalPrice;

  var checkoutBtn = document.querySelector('.checkout');
  if(checkoutBtn){
    checkoutBtn.onclick = function(){
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
      return { ...item, quantity: Math.max(1, (item.quantity||1) + change) };
    }
    return item;
  });
  setCart(cart);
  renderCart();
}

renderCart();
