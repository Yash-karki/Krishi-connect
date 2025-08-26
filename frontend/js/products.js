(function(){
  var grid = document.getElementById('productsGrid');
  var searchForm = document.getElementById('products-search');
  var qInput = document.getElementById('q');
  var cartLink = document.getElementById('cartLink');

  function refreshCartLink(){
    var cart = (window.KrishiAPI && window.KrishiAPI.getCart()) || [];
    if(cartLink){
      var count = cart.reduce(function(sum, it){ return sum + (it.quantity||1); }, 0);
      cartLink.textContent = '🛒 Cart ('+count+')';
    }
  }

function render(products){
  if(!grid) return;
  grid.innerHTML = '';
  
  if (!products || products.length === 0) {
    var noProductsCard = document.createElement('div');
    noProductsCard.className = 'product-card no-products';
    noProductsCard.innerHTML = 
      '<div class="pc-body">' +
      '<div class="product-image">📦</div>' +
      '<h3 class="product-title">No Products Found</h3>' +
      '<p class="product-description">No products available at the moment.</p>' +
      '<p class="product-description">Farmers can add their produce in the Sell section.</p>' +
      '</div>';
    grid.appendChild(noProductsCard);
    return;
  }
  
  products.forEach(function(p){
    var card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML =
      '<div class="pc-body">' +
      '<div class="product-image">🥬</div>' +
      '<h3 class="product-title">'+p.name+'</h3>' +
      '<p class="product-description">'+ (p.unit||'Kg') +'</p>' +
      '<p class="product-description">'+ (p.description || 'No description available') +'</p>' +
      '<p class="price">₹'+p.price+' / '+(p.unit||'Kg')+'</p>' +
      '<div class="actions">' +
      '<button class="btn btn-success" data-id="'+p.id+'">Add to Cart</button>' +
      '</div>' +
      '</div>';
    grid.appendChild(card);
  });

  grid.querySelectorAll('button[data-id]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var id = parseInt(btn.getAttribute('data-id'),10);
      var product = products.find(function(x){ return x.id === id; });
      if(product && window.KrishiAPI){
        window.KrishiAPI.addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 });
        refreshCartLink();
        
        // Show feedback
        btn.textContent = 'Added!';
        btn.disabled = true;
        setTimeout(function() {
          btn.textContent = 'Add to Cart';
          btn.disabled = false;
        }, 1000);
      }
    });
  });
}

  function init(){
    var urlParams = new URLSearchParams(window.location.search);
    var initialQ = urlParams.get('q') || '';
    if(qInput) qInput.value = initialQ;
    
    // Load products from API
    window.KrishiAPI.listProducts(initialQ)
      .then(render)
      .catch(function(error) {
        console.error('Failed to load products:', error);
        if(grid) {
          grid.innerHTML = '<div class="error-message">Failed to load products. Please try again later.</div>';
        }
      });
    
    refreshCartLink();
  }

  if(searchForm){
    searchForm.addEventListener('submit', function(e){
      e.preventDefault();
      var q = (qInput && qInput.value || '').trim();
      window.history.replaceState({}, '', q ? ('?q='+encodeURIComponent(q)) : window.location.pathname);
      
      window.KrishiAPI.listProducts(q)
        .then(render)
        .catch(function(error) {
          console.error('Search failed:', error);
          if(grid) {
            grid.innerHTML = '<div class="error-message">Search failed. Please try again.</div>';
          }
        });
    });
  }

  init();
})();


