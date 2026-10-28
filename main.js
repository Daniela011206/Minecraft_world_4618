(function() {
  'use strict';

  // ---------- ПЕРЕМЕННЫЕ ----------
  const burger = document.getElementById('burger');
  const nav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const backToTop = document.getElementById('backToTop');
  const sections = document.querySelectorAll('.fade-section');
  const headerHeight = 76;

  // ---------- МОБИЛЬНОЕ МЕНЮ ----------
  if (burger && nav) {
    burger.addEventListener('click', function() {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
    });

    // Закрыть меню при клике по ссылке
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('open')) {
          nav.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Закрыть меню при клике вне его
    document.addEventListener('click', function(e) {
      if (nav.classList.contains('open') && 
          !nav.contains(e.target) && 
          !burger.contains(e.target)) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------- ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ ----------
  const observerOptions = {
    root: null,
    rootMargin: `-${headerHeight}px 0px -50% 0px`,
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  document.querySelectorAll('section[id]').forEach(section => {
    navObserver.observe(section);
  });

  // ---------- АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ ----------
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(section => {
    fadeObserver.observe(section);
  });

  // ---------- КНОПКА НАВЕРХ ----------
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- ИНТЕРАКТИВНЫЙ ВЕРСТАК ----------
  // Определения предметов
  const items = {
    oak_log: { icon: '🪵', img: 'images/log.png', name: 'Дубовое бревно', desc: 'Базовый ресурс, из которого получают доски.' },
    oak_planks: { icon: '🟫', img: 'images/Oak_Planks.png', name: 'Дубовые доски', desc: 'Материал для крафта и строительства.' },
    stick: { icon: '🥢', img: 'images/stick.png', name: 'Палка', desc: 'Используется для создания инструментов и факелов.' },
    coal: { icon: '⚫', img: 'images/coal.png', name: 'Уголь', desc: 'Топливо и материал для факелов.' },
    charcoal: { icon: '🌑', name: 'Древесный уголь', desc: 'Альтернатива углю, получается из дерева.' },
    torch: { icon: '🔥', img: 'images/torch.png', name: 'Факел', desc: 'Освещает территорию и отпугивает мобов.' },
    wooden_pickaxe: { icon: '⛏️', img: 'images/pickaxe.png', name: 'Деревянная кирка', desc: 'Инструмент из досок и палок для добычи камня и руд.' },
    wooden_axe: { icon: '🪓', img: 'images/axe.png', name: 'Деревянный топор', desc: 'Инструмент из досок и палок для быстрой рубки дерева.' }
  };

  // Рецепты
  const recipes = [
    {
      id: 'planks',
      name: 'Доски из бревна',
      description: 'Одно бревно даёт 4 доски.',
      grid: [
        [null, null, null],
        [null, 'oak_log', null],
        [null, null, null]
      ],
      result: { item: 'oak_planks', count: 4 }
    },
    {
      id: 'sticks',
      name: 'Палки',
      description: 'Две доски вертикально в одном столбце.',
      grid: [
        [null, 'oak_planks', null],
        [null, 'oak_planks', null],
        [null, null, null]
      ],
      result: { item: 'stick', count: 4 }
    },
    {
      id: 'torch',
      name: 'Факел',
      description: 'Уголь над палкой.',
      grid: [
        [null, 'coal', null],
        [null, 'stick', null],
        [null, null, null]
      ],
      result: { item: 'torch', count: 4 }
    },
    {
      id: 'wooden_pickaxe',
      name: 'Деревянная кирка',
      description: 'Три доски сверху и две палки по центру вниз.',
      grid: [
        ['oak_planks', 'oak_planks', 'oak_planks'],
        [null, 'stick', null],
        [null, 'stick', null]
      ],
      result: { item: 'wooden_pickaxe', count: 1 }
    },
    {
      id: 'wooden_axe',
      name: 'Деревянный топор',
      description: 'Доски углом (две сверху слева, одна под ними) и две палки по центру вниз.',
      grid: [
        ['oak_planks', 'oak_planks', null],
        ['oak_planks', 'stick', null],
        [null, 'stick', null]
      ],
      result: { item: 'wooden_axe', count: 1 }
    }
  ];

  // DOM элементы верстака
  const craftingGrid = document.getElementById('craftingGrid');
  const resultSlot = document.getElementById('resultSlot');
  const resultIcon = document.getElementById('resultIcon');
  const resultCount = document.getElementById('resultCount');
  const recipeList = document.getElementById('recipeList');
  const craftingInfo = document.getElementById('craftingInfo');

  let currentRecipe = null;

  // Создание сетки 3x3
  function buildGrid() {
    if (!craftingGrid) return;
    craftingGrid.innerHTML = '';
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const slot = document.createElement('div');
        slot.className = 'slot empty';
        slot.dataset.row = row;
        slot.dataset.col = col;
        slot.setAttribute('role', 'button');
        slot.setAttribute('tabindex', '0');
        slot.setAttribute('aria-label', `Ячейка ${row * 3 + col + 1}`);
        slot.addEventListener('click', () => handleSlotClick(slot));
        slot.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSlotClick(slot);
          }
        });
        craftingGrid.appendChild(slot);
      }
    }
  }

  // Обновить сетку по рецепту
  function renderRecipe(recipe) {
    currentRecipe = recipe;
    const slots = craftingGrid.querySelectorAll('.slot');
    slots.forEach((slot, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const itemKey = recipe.grid[row]?.[col];
      if (itemKey && items[itemKey]) {
        const it = items[itemKey];
        slot.innerHTML = it.img ? `<img class="slot__img" src="${it.img}" alt="${it.name}" loading="lazy">` : it.icon;
        slot.setAttribute('aria-label', `${it.name} — ячейка ${index + 1}`);
        slot.dataset.item = itemKey;
        slot.classList.remove('empty');
      } else {
        slot.textContent = '';
        delete slot.dataset.item;
        slot.classList.add('empty');
        slot.setAttribute('aria-label', `Ячейка ${index + 1}`);
      }
    });

    // Результат
    if (recipe.result) {
      const { item, count } = recipe.result;
      const it = items[item];
      resultIcon.innerHTML = (it && it.img) ? `<img class="result-slot__img" src="${it.img}" alt="${it.name}" loading="lazy">` : (it?.icon || '❓');
      resultCount.textContent = count > 1 ? `×${count}` : '';
      resultSlot.dataset.item = item;
    }

    // Подсветка выбранного рецепта
    document.querySelectorAll('.recipe-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.recipeId === recipe.id);
    });

    // Информация
    craftingInfo.innerHTML = `<p><strong>${recipe.name}</strong></p><p>${recipe.description}</p><p class="crafting-hint">Нажми на любой слот, чтобы узнать о предмете.</p>`;
  }

  // Обработка клика по слоту
  function handleSlotClick(slot) {
    const itemKey = slot.dataset.item;
    if (itemKey && items[itemKey]) {
      const item = items[itemKey];
      const iconHtml = item.img
        ? `<img class="hint-icon" src="${item.img}" alt="${item.name}" loading="lazy">`
        : item.icon;
      craftingInfo.innerHTML = `
        <p><strong>${item.name}</strong></p>
        <p>${item.desc}</p>
        <p class="crafting-hint">${iconHtml}${item.name}</p>
      `;
    } else {
      craftingInfo.innerHTML = '<p class="crafting-hint">Пустая ячейка. Выберите рецепт или нажмите на предмет.</p>';
    }
  }

  // Инициализация списка рецептов
  function initRecipeList() {
    if (!recipeList) return;
    recipeList.innerHTML = '';
    recipes.forEach(recipe => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'recipe-btn';
      btn.dataset.recipeId = recipe.id;
      btn.textContent = recipe.name;
      btn.setAttribute('aria-label', `Рецепт: ${recipe.name}`);
      btn.addEventListener('click', () => {
        renderRecipe(recipe);
      });
      li.appendChild(btn);
      recipeList.appendChild(li);
    });
  }

  // Инициализация верстака
  if (craftingGrid) {
    buildGrid();
    initRecipeList();

    // Выбрать первый рецепт по умолчанию
    if (recipes.length > 0) {
      renderRecipe(recipes[0]);
    }

    // Клик по слоту результата
    resultSlot.addEventListener('click', () => {
      const itemKey = resultSlot.dataset.item;
      if (itemKey && items[itemKey]) {
        const item = items[itemKey];
        const iconHtml = item.img
          ? `<img class="hint-icon" src="${item.img}" alt="${item.name}" loading="lazy">`
          : item.icon;
        craftingInfo.innerHTML = `
          <p><strong>${item.name}</strong></p>
          <p>${item.desc}</p>
          <p class="crafting-hint">${iconHtml}Результат крафта: ${currentRecipe?.result?.count || 1} шт.</p>
        `;
      }
    });

    resultSlot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        resultSlot.click();
      }
    });
  }

  // ---------- ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРЕЙ (дополнительно) ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  });

})();
