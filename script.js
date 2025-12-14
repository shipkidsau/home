// Данные шипкидов
const shipkidsData = [
    { id: 1, name: "Абстракт", parents: ["Рипер", "Инк"], image: "images/abstract.jpg" },
    { id: 2, name: "Алуреон", parents: ["Гено", "Эррор"], image: "images/alureon3.jpg", page: "/characters/alureon.html" },
    { id: 3, name: "Анколи", parents: ["Рипер", "Гено"], image: "images/ankoli.jpg" },
    { id: 4, name: "Аномалия 64", parents: ["Эррор", "Киллер"], image: "images/anomaly64.jpg" },
    { id: 5, name: "Белладона", parents: ["Даст", "Ласт"], image: "images/belladonna.jpg" },
    { id: 6, name: "Кей", parents: ["Даст", "Ласт"], image: "images/kay.jpg" },
    { id: 7, name: "Кенза", parents: ["Даст", "Ласт"], image: "images/kenza.jpg" },
    { id: 8, name: "Луна", parents: ["Рипер", "Гено"], image: "images/luna.jpg" },
    { id: 9, name: "Маруи", parents: ["Рипер", "Гено"], image: "images/marui.jpg" },
    { id: 10, name: "Номи", parents: ["Рипер", "Гено"], image: "images/nomi.jpg" },
    { id: 11, name: "Рено", parents: ["Рипер", "Гено"], image: "images/reno.jpg" },
    { id: 12, name: "Роуг", parents: ["Рипер", "Гено"], image: "images/rogue.jpg" },
    { id: 13, name: "Сильвер", parents: ["Рипер", "Гено"], image: "images/silver.jpg" },
    { id: 14, name: "Сорелл", parents: ["Рипер", "Гено"], image: "images/sorell.jpg" },
    { id: 15, name: "Спарк", parents: ["Дрим", "Блу"], image: "images/spark.jpg" },
    { id: 16, name: "Старке", parents: ["Эпик", "Кросс"], image: "images/starke.jpg" },
    { id: 17, name: "Шарм", parents: ["Найтмер", "Ласт"], image: "images/charm.jpg" },
    { id: 18, name: "Шейд", parents: ["Рипер", "Гено"], image: "images/shade.jpg" },
    { id: 19, name: "Шэдоу", parents: ["Рипер", "Гено"], image: "images/shadow.jpg" },
    { id: 20, name: "Экзолит", parents: ["Рипер", "Гено"], image: "images/exolite.jpg" },
    { id: 21, name: "Эрген", parents: ["Рипер", "Гено"], image: "images/ergen.jpg" },
    { id: 22, name: "Вермилион", parents: ["Фатал Эррор", "Лавендер"], image: "images/vermillion.jpg" }
];

// родители
const parentsList = [
    "Все", "Блу", "Гено", "Даст", "Дрим", "Инк", "Киллер", "Колор", 
    "Кросс", "Ласт", "Найтмер", "Оутер", "Рипер", "Саенс", "Фатал Эррор", 
    "Фелл", "Фреш", "Хоррор", "Чино", "Эпик", "Эррор"
];

let selectedParents = [];
let currentSearchTerm = "";

// Переменные для свайпа
let isDragging = false;
let startX = 0;
let scrollLeft = 0;

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    renderFilters();
    renderShipkids();
    setupEventListeners();
    setupSwipe();
    setupMobileSearch();
});

// Рендер фильтров
function renderFilters() {
    const filtersGrid = document.querySelector('.filters-grid');
    filtersGrid.innerHTML = '';

    parentsList.forEach(parent => {
        const filterTag = document.createElement('button');
        filterTag.className = 'filter-tag';
        filterTag.textContent = parent;
        filterTag.setAttribute('data-parent', parent);
        
        if (parent === "Все") {
            filterTag.classList.add('active');
        }
        
        filtersGrid.appendChild(filterTag);
    });
}

// Рендер шипкидов
function renderShipkids() {
    const grid = document.querySelector('.shipkids-grid');
    
    // Фильтрация данных
    let filteredData = shipkidsData.filter(shipkid => {
        // Поиск по имени
        const matchesSearch = shipkid.name.toLowerCase().includes(currentSearchTerm.toLowerCase());
        
        // Фильтрация по родителям
        let matchesParents = true;
        if (selectedParents.length > 0) {
            if (selectedParents.length === 1) {
                // Один родитель - показываем всех детей этого родителя
                matchesParents = shipkid.parents.includes(selectedParents[0]);
            } else if (selectedParents.length === 2) {
                // Два родителя - точное совпадение
                matchesParents = selectedParents.every(parent => 
                    shipkid.parents.includes(parent)
                );
            }
        }
        
        return matchesSearch && matchesParents;
    });

    // Сортировка по алфавиту
    filteredData.sort((a, b) => a.name.localeCompare(b.name));

    // Очистка сетки
    grid.innerHTML = '';

    // Добавление карточек
    filteredData.forEach(shipkid => {
        const card = document.createElement('div');
        card.className = 'shipkid-card';
        card.innerHTML = `
            <div class="shipkid-image">
                <img src="${shipkid.image}" alt="${shipkid.name}" 
                     onerror="this.src='https://via.placeholder.com/300x300/2d3748/9099EF?text=🖼️'">
            </div>
            <div class="shipkid-info">
                <div class="shipkid-name">${shipkid.name}</div>
            </div>
        `;
        
        // Клик по карточке (для будущих страниц персонажей)
        card.addEventListener('click', function() {
            console.log('Открыть страницу:', shipkid.name);
        });
        
        grid.appendChild(card);
    });
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Фильтры по родителям
    document.querySelectorAll('.filter-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const parent = this.getAttribute('data-parent');
            
            if (parent === "Все") {
                selectedParents = [];
                updateFilterStates();
                renderShipkids();
                return;
            }
            
            if (this.classList.contains('active')) {
                // Удаляем родителя из выбранных
                selectedParents = selectedParents.filter(p => p !== parent);
                this.classList.remove('active');
            } else {
                // Добавляем родителя
                if (selectedParents.length < 2) {
                    selectedParents.push(parent);
                    this.classList.add('active');
                }
            }
            
            updateFilterStates();
            renderShipkids();
        });
    });

    // Поиск
    document.getElementById('searchInput').addEventListener('input', function(e) {
        currentSearchTerm = e.target.value;
        renderShipkids();
    });
}

// Обновление состояния фильтров
function updateFilterStates() {
    document.querySelectorAll('.filter-tag').forEach(tag => {
        const parent = tag.getAttribute('data-parent');
        
        if (parent === "Все") {
            tag.classList.toggle('active', selectedParents.length === 0);
        } else {
            tag.classList.toggle('active', selectedParents.includes(parent));
            tag.classList.toggle('disabled', 
                selectedParents.length === 2 && !selectedParents.includes(parent)
            );
        }
    });  
}

// Настройка свайпа для десктопа
function setupSwipe() {
    const scrollContainer = document.getElementById('filtersScroll');
    
    scrollContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        scrollContainer.classList.add('grabbing');
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
        isDragging = false;
        scrollContainer.classList.remove('grabbing');
    });

    scrollContainer.addEventListener('mouseup', () => {
        isDragging = false;
        scrollContainer.classList.remove('grabbing');
    });

    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 2; // Умножаем для более плавного скролла
        scrollContainer.scrollLeft = scrollLeft - walk;
    });

    // Отключаем стандартное поведение при клике на теги
    scrollContainer.addEventListener('click', (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
}

// Управление мобильным поиском
// Управление мобильным поиском
function setupMobileSearch() {
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    const searchInput = document.getElementById('searchInput');
    const header = document.querySelector('.header');
    const logo = document.querySelector('.logo');
    
    if (mobileSearchBtn && closeSearchBtn) {
        // Открыть поиск
        mobileSearchBtn.addEventListener('click', function() {
            header.classList.add('search-active');
            searchInput.focus();
            // На мобильных скрываем логотип при поиске для экономии места
            if (window.innerWidth <= 768) {
                logo.style.opacity = '0';
                logo.style.width = '0';
                logo.style.overflow = 'hidden';
            }
        });
        
        // Закрыть поиск
        closeSearchBtn.addEventListener('click', function() {
            header.classList.remove('search-active');
            searchInput.value = '';
            currentSearchTerm = '';
            renderShipkids();
            
            // Возвращаем логотип
            logo.style.opacity = '';
            logo.style.width = '';
            logo.style.overflow = '';
        });
        
        // Закрыть поиск при нажатии Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && header.classList.contains('search-active')) {
                header.classList.remove('search-active');
                searchInput.value = '';
                currentSearchTerm = '';
                renderShipkids();
                
                // Возвращаем логотип
                logo.style.opacity = '';
                logo.style.width = '';
                logo.style.overflow = '';
            }
        });
        
        // Закрыть поиск при клике вне поисковой строки (только на мобильных)
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                header.classList.contains('search-active') &&
                !searchContainer.contains(e.target) && 
                !mobileSearchBtn.contains(e.target)) {
                
                header.classList.remove('search-active');
                searchInput.value = '';
                currentSearchTerm = '';
                renderShipkids();
                
                // Возвращаем логотип
                logo.style.opacity = '';
                logo.style.width = '';
                logo.style.overflow = '';
            }
        });
    }
}

// Аккордеон для FAQ
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Закрываем все остальные элементы
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем текущий элемент
            item.classList.toggle('active');
        });
    });
});

