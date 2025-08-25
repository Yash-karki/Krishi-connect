// API wrapper for KrishiConnect
(function(global){
  var API_BASE = '/api';

  function getJSON(url, opts = {}){
    return fetch(API_BASE + url, {
      headers: {
        'Content-Type': 'application/json',
        ...opts.headers
      },
      ...opts
    }).then(function(response) {
      if (!response.ok) {
        throw new Error('API request failed: ' + response.status);
      }
      return response.json();
    });
  }

  function listProducts(query){
    var qs = query ? ('?q='+encodeURIComponent(query)) : '';
    return getJSON('/products' + qs);
  }

  function getCart(){
    try { 
      return JSON.parse(localStorage.getItem('cart')||'[]'); 
    } catch(_e){ 
      return []; 
    }
  }
  
  function setCart(items){ 
    localStorage.setItem('cart', JSON.stringify(items||[])); 
  }
  
  function addToCart(item){
    var cart = getCart();
    var found = cart.find(function(ci){ return ci.id === item.id; });
    if(found){ 
      found.quantity = (found.quantity||1) + (item.quantity||1); 
    } else { 
      cart.push({ 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        quantity: item.quantity||1 
      }); 
    }
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


