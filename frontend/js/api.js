// Minimal API wrapper (can be extended to real backend)
(function(global){
  var API_BASE = '';

  function getJSON(url){
    return fetch(url).then(function(r){ return r.json(); });
  }

  function listProducts(query){
    // Placeholder static data while backend endpoints are empty
    var data = [
      { id: 1, name: 'Organic Spinach', price: 50, unit: 'Kg' },
      { id: 2, name: 'Fresh Tomatoes', price: 40, unit: 'Kg' },
      { id: 3, name: 'Golden Wheat', price: 32, unit: 'Kg' },
      { id: 4, name: 'Basmati Rice', price: 65, unit: 'Kg' }
    ];
    if(query){
      var q = query.toLowerCase();
      data = data.filter(function(p){ return p.name.toLowerCase().indexOf(q) !== -1; });
    }
    return Promise.resolve(data);
  }

  function getCart(){
    try { return JSON.parse(localStorage.getItem('cart')||'[]'); } catch(_e){ return []; }
  }
  function setCart(items){ localStorage.setItem('cart', JSON.stringify(items||[])); }
  function addToCart(item){
    var cart = getCart();
    var found = cart.find(function(ci){ return ci.id === item.id; });
    if(found){ found.quantity = (found.quantity||1) + (item.quantity||1); }
    else { cart.push({ id: item.id, name: item.name, price: item.price, quantity: item.quantity||1 }); }
    setCart(cart);
    return cart;
  }

  global.KrishiAPI = {
    listProducts: listProducts,
    getCart: getCart,
    setCart: setCart,
    addToCart: addToCart
  };
})(window);


