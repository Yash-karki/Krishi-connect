// Minimal API wrapper with mock data
(function(global){
  var API_BASE = '';

  // Mock product data
  var mockProducts = [
    {
      id: 1,
      name: "Fresh Tomatoes",
      price: 40,
      unit: "Kg",
      description: "Organic red tomatoes"
    },
    {
      id: 2,
      name: "Onions",
      price: 25,
      unit: "Kg",
      description: "Fresh white onions"
    },
    {
      id: 3,
      name: "Potatoes",
      price: 30,
      unit: "Kg",
      description: "Quality potatoes"
    },
    {
      id: 4,
      name: "Carrots",
      price: 35,
      unit: "Kg",
      description: "Fresh orange carrots"
    },
    {
      id: 5,
      name: "Cabbage",
      price: 20,
      unit: "Kg",
      description: "Green cabbage"
    },
    {
      id: 6,
      name: "Cauliflower",
      price: 45,
      unit: "Kg",
      description: "Fresh cauliflower"
    },
    {
      id: 7,
      name: "Green Peas",
      price: 60,
      unit: "Kg",
      description: "Sweet green peas"
    },
    {
      id: 8,
      name: "Spinach",
      price: 15,
      unit: "Kg",
      description: "Fresh spinach leaves"
    },
    {
      id: 9,
      name: "Cucumber",
      price: 30,
      unit: "Kg",
      description: "Fresh cucumbers"
    }
  ];

  function getJSON(url, opts){
    // Mock API response
    return new Promise(function(resolve) {
      setTimeout(function() {
        resolve(mockProducts);
      }, 100);
    });
  }

  function listProducts(query){
    var qs = query ? ('?q='+encodeURIComponent(query)) : '';
    // Filter products based on query
    if (query) {
      var filtered = mockProducts.filter(function(product) {
        return product.name.toLowerCase().includes(query.toLowerCase()) ||
               product.description.toLowerCase().includes(query.toLowerCase());
      });
      return Promise.resolve(filtered);
    }
    return Promise.resolve(mockProducts);
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


