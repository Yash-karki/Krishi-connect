(function () {
  var form = document.getElementById('search-form');
  var input = document.getElementById('search-input');
  if (!form || !input) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var q = (input.value || '').trim();
    var url = 'products.html' + (q ? ('?q=' + encodeURIComponent(q)) : '');
    window.location.href = url;
  });
})();
