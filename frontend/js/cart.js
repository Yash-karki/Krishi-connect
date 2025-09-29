function getCart(){
  try { return JSON.parse(localStorage.getItem('cart')||'[]'); } catch(_e){ return []; }
}
function setCart(items){ localStorage.setItem('cart', JSON.stringify(items||[])); }

function renderCart() {
  const cartItemsDiv = document.getElementById("cartItems");
  const cart = getCart();

  if (!cartItemsDiv) return;

  cartItemsDiv.innerHTML = '';

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  let totalPrice = 0;

  cart.forEach(item => {
    totalPrice += item.price * item.quantity;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
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
    cartItemsDiv.appendChild(itemDiv);
  });

  document.getElementById("totalPrice").innerText = totalPrice.toFixed(2);

  // Setup checkout button
  var checkoutBtn = document.getElementById('checkoutBtn');
  if(checkoutBtn){
    checkoutBtn.onclick = async function(){
      var termsChecked = document.getElementById('termsCheck').checked;
      if (!termsChecked) {
        alert('Please agree to terms & conditions');
        return;
      }
      
      const cart = getCart();
      if (cart.length === 0) {
        alert('Your cart is empty');
        return;
      }
      
      // Disable checkout button during processing
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = 'Processing...';
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please login to checkout');
          window.location.href = 'signup.html';
          return;
        }
        
        // Format cart items for API
        const items = cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }));
        
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ items })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          alert('Order placed successfully! Order ID: ' + result.id);
          setCart([]);
          renderCart();
          window.location.href = 'dashboard.html';
        } else {
          alert('Checkout failed: ' + (result.message || 'Unknown error'));
        }
      } catch (error) {
        console.error('Checkout error:', error);
        alert('Checkout failed. Please try again.');
      } finally {
        // Re-enable checkout button
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Checkout';
      }
    };
  }
}

function updateQuantity(id, change) {
  const cart = getCart();
  const updatedCart = cart.map(item => {
    if (item.id === id) {
      const newQuantity = Math.max(1, (item.quantity||1) + change);
      return { ...item, quantity: newQuantity };
    }
    return item;
  });
  setCart(updatedCart);
  renderCart();
}

// Call renderCart on page load
renderCart();
