// Sample cart data
let cart = [
  { id: 1, name: "Organic Spinach", price: 50, quantity: 2, img: "https://i.ibb.co/N2cr9kP/spinach.jpg" },
  { id: 2, name: "Fresh Tomatoes", price: 40, quantity: 1, img: "https://i.ibb.co/c2j5QxT/tomato.jpg" }
];

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
      <img src="${item.img}" alt="${item.name}">
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
}

function updateQuantity(id, change) {
  cart = cart.map(item => {
    if (item.id === id) {
      return { ...item, quantity: Math.max(1, item.quantity + change) };
    }
    return item;
  });
  renderCart();
}

renderCart();
