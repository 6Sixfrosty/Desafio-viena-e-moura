let currentPage = null;

document.addEventListener('DOMContentLoaded', function () {
  // Esconde todos os painéis
  document.querySelectorAll('[data-page]').forEach(link => {
    const painel = document.getElementById(link.dataset.page);
    if (painel) painel.style.display = 'none';
  });

  // Lê o link active e exibe o painel correspondente
  const activeLink = document.querySelector('.nav-link.active[data-page]');
  if (activeLink) {
    currentPage = activeLink.dataset.page;
    document.getElementById(currentPage).style.display = 'block';
  }
});

function Nav(elemento, id) {
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.remove('active');
  });

  elemento.classList.add('active');

  if (currentPage) {
    document.getElementById(currentPage).style.display = 'none';
  }

  document.getElementById(id).style.display = 'block';
  currentPage = id;
}

document.addEventListener('click', function (e) {
  const btn = e.target.closest('.nav-link[data-page]');
  if (btn) Nav(btn, btn.dataset.page);
});