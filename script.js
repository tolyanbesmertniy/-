// База данных событий
const EVENTS_DATA = [
  {
    id: 1,
    category: 'Лекция',
    tagFull: 'ЛЕКЦИЯ / ТЕХНОЛОГИИ',
    title: 'ИИ: что будет после хайпа',
    shortDesc: 'О технологиях, которые меняют профессию.',
    fullDesc: 'Разберём, где искусственный интеллект уже полезен, а где пока больше обещаний. Обсудим реальные кейсы и навыки, которые пригодятся на старте карьеры.',
    dateList: '17 ноября • 18:30',
    dateFull: '17 ноября, вторник',
    timeRange: '18:30–20:00',
    shortDate: '17.11',
    location: 'Корпус А, ауд. 301',
    locationFull: 'Корпус А, аудитория 301',
    address: 'Университетская, 12',
    organizer: 'IT-клуб кампуса',
    entry: 'Вход свободный',
    featured: true,
    isPast: false
  },
  {
    id: 2,
    category: 'Митап',
    tagFull: 'МИТАП / ДИЗАЙН',
    title: 'Дизайн без границ',
    shortDesc: 'Портфолио, первые проекты и честный фидбэк.',
    fullDesc: 'Встреча для начинающих продуктовых и графических дизайнеров. Разберём ваши кейсы, обсудим тренды интерфейсов и расскажем, как попасть на первую стажировку.',
    dateList: '18 ноября • 17:00',
    dateFull: '18 ноября, среда',
    timeRange: '17:00–19:30',
    shortDate: '18.11',
    location: 'Коворкинг «Точка»',
    locationFull: 'Коворкинг «Точка», 2 этаж',
    address: 'Студенческий проспект, 5',
    organizer: 'Design community',
    entry: 'Вход свободный',
    featured: false,
    isPast: false
  },
  {
    id: 3,
    category: 'Спорт',
    tagFull: 'СПОРТ / ТУРНИР',
    title: 'Кубок кампуса: волейбол',
    shortDesc: 'Поддержи команду своего факультета.',
    fullDesc: 'Финальные игры межфакультетского турнира по волейболу. Приходи болеть за сборную своего института — зрителей ждут розыгрыши мерча и горячий чай.',
    dateList: '19 ноября • 16:00',
    dateFull: '19 ноября, четверг',
    timeRange: '16:00–19:00',
    shortDate: '19.11',
    location: 'Спорткомплекс, зал 1',
    locationFull: 'Спорткомплекс, игровой зал №1',
    address: 'Спортивная, 8',
    organizer: 'Студенческий спортклуб',
    entry: 'Для всех студентов',
    featured: false,
    isPast: false
  },
  {
    id: 4,
    category: 'Лекция',
    tagFull: 'ЛЕКЦИЯ / КАРЬЕРА',
    title: 'Как запустить пет-проект за выходные',
    shortDesc: 'От идеи до первых пользователей без бюджета.',
    fullDesc: 'Прошедший воркшоп по быстрому прототипированию и запуску MVP для студенческих команд.',
    dateList: '10 ноября • 18:00',
    dateFull: '10 ноября, вторник',
    timeRange: '18:00–19:30',
    shortDate: '10.11',
    location: 'Корпус Б, ауд. 105',
    locationFull: 'Корпус Б, аудитория 105',
    address: 'Университетская, 14',
    organizer: 'Бизнес-инкубатор',
    entry: 'Вход свободный',
    featured: false,
    isPast: true
  }
];

// Состояние приложения (по умолчанию пользователь уже записан на событие с id: 3, как на скриншоте)
const savedRegs = JSON.parse(localStorage.getItem('campus_registrations'));
let registeredIds = savedRegs ||;
let currentCategory = 'all';
let searchQuery = '';
let selectedEventId = 1;
let regTab = 'upcoming'; // 'upcoming' | 'past'

// DOM-элементы
const views = {
  feed: document.getElementById('view-feed'),
  details: document.getElementById('view-details'),
  registrations: document.getElementById('view-registrations')
};

const eventsListEl = document.getElementById('events-list');
const registrationsListEl = document.getElementById('registrations-list');
const searchInput = document.getElementById('search-input');
const toastEl = document.getElementById('toast');

// Сохранение в localStorage
function saveState() {
  localStorage.setItem('campus_registrations', JSON.stringify(registeredIds));
}

// Показ всплывающего уведомления
let toastTimer;
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2400);
}

// Переключение между экранами
function switchView(viewName) {
  Object.values(views).forEach(el => el.classList.remove('active'));
  views[viewName].classList.add('active');

  // Подсветка активной вкладки в таб-баре
  document.querySelectorAll('.tab-item').forEach(tab => {
    const target = tab.dataset.target;
    const isActive = (viewName === 'details' && target === 'feed') || (target === viewName);
    tab.classList.toggle('active', isActive);
  });

  if (viewName === 'feed') renderFeed();
  if (viewName === 'registrations') renderRegistrations();
}

// Запись или отмена регистрации
function toggleRegistration(eventId, e) {
  if (e) e.stopPropagation();

  const event = EVENTS_DATA.find(item => item.id === eventId);
  if (!event) return;

  if (registeredIds.includes(eventId)) {
    registeredIds = registeredIds.filter(id => id !== eventId);
    showToast(`Регистрация на «${event.title}» отменена`);
  } else {
    registeredIds.push(eventId);
    showToast('Вы записаны! Напомним за день и за час 🔔');
  }

  saveState();
  renderFeed();
  renderRegistrations();

  if (views.details.classList.contains('active') && selectedEventId === eventId) {
    openEventDetails(eventId);
  }
}

// Рендер главного экрана (Афиша)
function renderFeed() {
  const filtered = EVENTS_DATA.filter(event => {
    if (event.isPast) return false;
    const matchesCat = currentCategory === 'all' || event.category === currentCategory;
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery) ||
      event.shortDesc.toLowerCase().includes(searchQuery) ||
      event.organizer.toLowerCase().includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    eventsListEl.innerHTML = `<div class="empty-state">По вашему запросу событий не найдено</div>`;
    return;
  }

  eventsListEl.innerHTML = filtered
    .map(event => {
      const isReg = registeredIds.includes(event.id);
      let btnClass = event.featured ? 'btn-card-light' : 'btn-card-primary';
      let btnText = 'Записаться';

      if (isReg) {
        btnClass = 'btn-card-registered';
        btnText = 'Вы записаны';
      }

      return `
        <div class="event-card ${event.featured ? 'featured' : ''}" onclick="openEventDetails(${event.id})">
          <span class="card-tag">${event.category.toUpperCase()}</span>
          <h2 class="card-title">${event.title}</h2>
          <p class="card-desc">${event.shortDesc}</p>
          <div class="card-meta-list">
            <div class="meta-item">📅 ${event.dateList}</div>
            <div class="meta-item">📍 ${event.location}</div>
          </div>
          <div class="card-footer">
            <span class="organizer">${event.organizer}</span>
            <button class="btn-card ${btnClass}" onclick="toggleRegistration(${event.id}, event)">
              ${btnText}
            </button>
          </div>
        </div>
      `;
    })
    .join('');
}

// Открытие экрана деталей события
function openEventDetails(eventId) {
  const event = EVENTS_DATA.find(item => item.id === eventId);
  if (!event) return;

  selectedEventId = eventId;
  const isReg = registeredIds.includes(eventId);

  document.getElementById('detail-tag').textContent = event.tagFull;
  document.getElementById('detail-title').textContent = event.title;
  document.getElementById('detail-entry').textContent = event.entry;
  document.getElementById('detail-short-date').textContent = event.shortDate;
  document.getElementById('detail-date').textContent = event.dateFull;
  document.getElementById('detail-time').textContent = event.timeRange;
  document.getElementById('detail-location').textContent = event.locationFull;
  document.getElementById('detail-address').textContent = event.address;
  document.getElementById('detail-organizer').textContent = event.organizer;
  document.getElementById('detail-description').textContent = event.fullDesc;

  const ctaBtn = document.getElementById('detail-cta-btn');
  const ctaText = document.getElementById('detail-cta-text');
  const ctaArrow = document.getElementById('detail-cta-arrow');
  const ctaCaption = document.getElementById('detail-cta-caption');

  if (isReg) {
    ctaBtn.classList.add('registered');
    ctaText.textContent = '✓ Вы записаны (нажмите для отмены)';
    ctaArrow.style.display = 'none';
    ctaCaption.textContent = 'Событие добавлено в «Мои регистрации»';
  } else {
    ctaBtn.classList.remove('registered');
    ctaText.textContent = 'Записаться';
    ctaArrow.style.display = 'inline';
    ctaCaption.textContent = 'Событие появится в «Моих регистрациях»';
  }

  switchView('details');
}

// Рендер экрана «Мои регистрации»
function renderRegistrations() {
  const upcomingEvents = EVENTS_DATA.filter(e => !e.isPast && registeredIds.includes(e.id));
  const pastEvents = EVENTS_DATA.filter(e => e.isPast);

  document.getElementById('seg-upcoming').textContent = `Предстоящие • ${upcomingEvents.length}`;

  const alertBanner = document.getElementById('reg-alert-banner');
  const listToRender = regTab === 'upcoming' ? upcomingEvents : pastEvents;

  alertBanner.style.display = regTab === 'upcoming' && upcomingEvents.length > 0 ? 'flex' : 'none';

  if (listToRender.length === 0) {
    registrationsListEl.innerHTML = `
      <div class="empty-state">
        У вас пока нет ${regTab === 'upcoming' ? 'предстоящих' : 'прошедших'} регистраций
      </div>
    `;
    return;
  }

  registrationsListEl.innerHTML = listToRender
    .map(event => `
      <div class="event-card" onclick="openEventDetails(${event.id})">
        <div class="reg-card-header">
          <span class="card-tag no-margin">${event.category.toUpperCase()}</span>
          <span class="status-pill-green">${event.isPast ? 'Завершено' : '✓ Вы записаны'}</span>
        </div>
        <h2 class="card-title">${event.title}</h2>
        <p class="card-desc">${event.shortDesc}</p>

        <div class="card-meta-list compact">
📅 ${event.dateList.split('•')[0].trim()} • ${event.timeRange}
📍 ${event.location}

${event.organizer}
${
!event.isPast
? <span class="link-cancel" onclick="toggleRegistration(${event.id}, event)">Отменить регистрацию</span>
: <span></span>
}
Подробнее


`)
.join('');
}
// Инициализация обработчиков событий
document.addEventListener('DOMContentLoaded', () => {
// Нижний таб-бар
document.querySelectorAll('.tab-item').forEach(tab => {
tab.addEventListener('click', () => switchView(tab.dataset.target));
});
// Кнопка «Назад» на экране события
document.getElementById('btn-back').addEventListener('click', () => switchView('feed'));
// Кнопка «Записаться / Отменить» внутри деталей события
document.getElementById('detail-cta-btn').addEventListener('click', () => {
toggleRegistration(selectedEventId);
});
// Тумблер локальных уведомлений
const reminderToggle = document.getElementById('detail-reminder-toggle');
const reminderStatusText = document.getElementById('reminder-status-text');
reminderToggle.addEventListener('change', () => {
if (reminderToggle.checked) {
reminderStatusText.textContent = 'Локальные уведомления включены';
showToast('Напоминания включены (за день и за час)');
} else {
reminderStatusText.textContent = 'Уведомления отключены';
showToast('Напоминания отключены');
}
});
// Поиск по событиям
searchInput.addEventListener('input', e => {
searchQuery = e.target.value.trim().toLowerCase();
renderFeed();
});
// Фильтрация по чипсам категорий
document.querySelectorAll('#category-chips .chip').forEach(chip => {
chip.addEventListener('click', () => {
document.querySelectorAll('#category-chips .chip').forEach(c => c.classList.remove('active'));
chip.classList.add('active');
currentCategory = chip.dataset.category;
renderFeed();
});
});
// Переключение «Предстоящие / Прошедшие» в регистрациях
document.querySelectorAll('.segment-btn').forEach(btn => {
btn.addEventListener('click', () => {
document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
btn.classList.add('active');
regTab = btn.dataset.tab;
renderRegistrations();
});
});
// Ссылка «Найти ещё события»
document.getElementById('link-find-more').addEventListener('click', e => {
e.preventDefault();
switchView('feed');
});
// Первичный рендер
renderFeed();
renderRegistrations();
});