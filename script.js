// Данные шипкидов
const shipkidsData = [
    { id: 1, name: "Абстракт", parents: ["Рипер", "Инк"], image: "images/abstract.jpg" },
    { id: 2, name: "Алуреон", parents: ["Гено", "Эррор"], image: "images/alureon3.jpg" },
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
let filtersExpanded = true;

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    renderFilters();
    renderShipkids();
    setupEventListeners();
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

// Переключение видимости фильтров
function toggleFilters() {
    const container = document.getElementById('filtersContainer');
    const toggleText = document.getElementById('toggleText');
    
    filtersExpanded = !filtersExpanded;
    
    if (filtersExpanded) {
        container.classList.remove('collapsed');
        container.classList.add('expanded');
        toggleText.textContent = 'свернуть';
    } else {
        container.classList.remove('expanded');
        container.classList.add('collapsed');
        toggleText.textContent = 'развернуть';
    }
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
            // Пока просто заглушка
            console.log('Открыть страницу:', shipkid.name);
        });
        
        grid.appendChild(card);
    });
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Переключение фильтров
    document.getElementById('toggleFilters').addEventListener('click', toggleFilters);
    
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

    // Очистка фильтров
    document.getElementById('clearFilters').addEventListener('click', function() {
        selectedParents = [];
        currentSearchTerm = "";
        document.getElementById('searchInput').value = "";
        updateFilterStates();
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

    // Обновление информации о выбранных фильтрах
    const infoElement = document.getElementById('selectedFiltersInfo');
    if (selectedParents.length === 0) {
        infoElement.textContent = "Выбрано: 0 родителей";
    } else if (selectedParents.length === 1) {
        infoElement.textContent = `Выбран: ${selectedParents[0]}`;
    } else {
        infoElement.textContent = `Выбраны: ${selectedParents.join(' и ')}`;
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
