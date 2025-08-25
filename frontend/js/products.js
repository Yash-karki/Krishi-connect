(function(){
  var grid = document.getElementById('productsGrid');
  var searchForm = document.getElementById('products-search');
  var qInput = document.getElementById('q');
  var cartLink = document.getElementById('cartLink');

  function refreshCartLink(){
    var cart = (window.KrishiAPI && window.KrishiAPI.getCart()) || [];
    if(cartLink){
      var count = cart.reduce(function(sum, it){ return sum + (it.quantity||1); }, 0);
      cartLink.textContent = 'Cart ('+count+')';
    }
  }

  function render(products){
    if(!grid) return;
    grid.innerHTML = '';
    products.forEach(function(p){
      var card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML =
        '<div class="pc-body">'
        + '<h3>'+p.name+'</h3>'
        + '<p class="muted">'+ (p.unit||'Kg') +'</p>'
        + '<p class="price">₹'+p.price+' / '+(p.unit||'Kg')+'</p>'
        + '<div class="actions">'
        +   '<button class="btn btn-success" data-id="'+p.id+'">Add to Cart</button>'
        + '</div>'
        + '</div>';
      grid.appendChild(card);
    });

    grid.querySelectorAll('button[data-id]').forEach(function(btn){
      btn.addEventListener('click', function(){
        var id = parseInt(btn.getAttribute('data-id'),10);
        var product = products.find(function(x){ return x.id === id; });
        if(product && window.KrishiAPI){
          window.KrishiAPI.addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1 });
          refreshCartLink();
        }
      });
    });
  }

  function init(){
    var urlParams = new URLSearchParams(window.location.search);
    var initialQ = urlParams.get('q') || '';
    if(qInput) qInput.value = initialQ;
    window.KrishiAPI.listProducts(initialQ).then(render);
    refreshCartLink();
  }

  if(searchForm){
    searchForm.addEventListener('submit', function(e){
      e.preventDefault();
      var q = (qInput && qInput.value || '').trim();
      window.history.replaceState({}, '', q ? ('?q='+encodeURIComponent(q)) : window.location.pathname);
      window.KrishiAPI.listProducts(q).then(render);
    });
  }

  init();
})();


