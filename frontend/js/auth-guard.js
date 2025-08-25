(function(){
  try{
    var publicPaths = ['signup.html', 'products.html', 'index.html'];
    var path = (location.pathname.split('/').pop() || '').toLowerCase();
    if(publicPaths.indexOf(path) !== -1) return;
    var token = localStorage.getItem('token');
    if(!token){
      document.addEventListener('click', function(e){
        var target = e.target;
        if(!target) return;
        if(target.tagName === 'BUTTON' || target.closest('button')){
          e.preventDefault();
          e.stopPropagation();
          window.location.href = 'signup.html';
        }
      }, true);
    }
  }catch(_e){}
})();

