// База данных событий
const EVENTS_DATA = Array.of(
  {
    id: 1,
    category: 'Лекция',
    tagFull: 'ЛЕКЦИЯ / ТЕХНОЛОГИИ',
    title: 'ИИ: что будет после хайпа',
    shortDesc: 'О технологиях, которые меняют профессию.',
    fullDesc: 'Разберём, где искусственный интеллект уже полезен, а где пока больше обещаний. Обсудим реальные кейсы и навыки, которые пригодятся на старте карьеры.',
    dateList: '17 ноября • 18:30',
    dateOnly: '17 ноября',
    dateFull: '17 ноября, вторник',
    timeRange: '18:30–20:00',
    shortDate: '17.11',
    location: 'Корпус А, ауд. 301',
    locationFull: 'Корпус А, аудитория 301',
    address: 'Университетская, 12',
    organizer: 'IT-клуб',
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
    dateOnly: '18 ноября',
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
    title: 'Кубок по волейболу',
    shortDesc: 'Поддержи команду своего факультета.',
    fullDesc: 'Финальные игры межфакультетского турнира по волейболу. Приходи болеть за сборную своего института — зрителей ждут розыгрыши мерча и горячий чай.',
    dateList: '19 ноября • 16:00',
    dateOnly: '19 ноября',
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
    id: 5,
    category: 'Хакатон',
    tagFull: 'ХАКАТОН / РАЗРАБОТКА',
    title: 'College Hack 2026',
    shortDesc: '48 часов на создание прототипа цифрового сервиса для колледжа.',
    fullDesc: 'Командный хакатон по разработке студенческих сервисов. Собери команду из 2–4 человек, выбери трек и презентуй готовый прототип жюри.',
    dateList: '20 ноября • 10:00',
    dateOnly: '20 ноября',
    dateFull: '20 ноября, пятница',
    timeRange: '10:00–20:00',
    shortDate: '20.11',
    location: 'Актовый зал',
    locationFull: 'Главный корпус, Актовый зал',
    address: 'Университетская, 12',
    organizer: 'Хакатон Хаб',
    entry: 'По регистрации',
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
    dateOnly: '10 ноября',
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
);

// Параметры бонусной системы «Шабурята» для сервиса «Хакатон Хаб»
const BONUS_PER_VISIT = 10;
const SERVICE_WEEKLY_LIMIT = 20;
const GLOBAL_WEEKLY_LIMIT = 60;

// Хранилище пользователей (College Platform ID)
const STORAGE_USERS_KEY = 'college_platform_users';
const STORAGE_CURRENT_USER_KEY = 'college_platform_current_user';

let usersDB = {};
let currentUserId = null;

function loadStorage() {
  try {
    const rawUsers = JSON.parse(localStorage.getItem(STORAGE_USERS_KEY));
    if (rawUsers && typeof rawUsers === 'object') {
      usersDB = rawUsers;
    }
  } catch (e) {
    usersDB = {};
  }

  // Предзаполним два тестовых аккаунта, если база пустая
  if (!usersDB['ИТ-2305']) {
    usersDB['ИТ-2305'] = {
      id: 'ИТ-2305',
      name: 'Мария Иванова',
      balance: 24,
      weeklyServiceEarned: 0,
      weeklyTotalEarned: 14,
      registeredIds: Array.of(3),
      attendedIds: Array.of(),
      history: Array.of(
        { title: 'ИТ.Спорт: тренировка по баскетболу', amount: 8, date: '14 ноября' },
        { title: 'Медиацентр: одобренный отзыв', amount: 6, date: '12 ноября' },
        { title: 'Хакатон Хаб: посещение лекции', amount: 10, date: '05 ноября' }
      )
    };
  }

  if (!usersDB['ПМ-2412']) {
    usersDB['ПМ-2412'] = {
      id: 'ПМ-2412',
      name: 'Дмитрий Соколов',
      balance: 10,
      weeklyServiceEarned: 10,
      weeklyTotalEarned: 10,
      registeredIds: Array.of(1),
      attendedIds: Array.of(),
      history: Array.of(
        { title: 'Хакатон Хаб: посещение митапа', amount: 10, date: '16 ноября' }
      )
    };
  }

  const savedId = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
  if (savedId && usersDB[savedId]) {
    currentUserId = savedId;
  }

  saveStorage();
}

function saveStorage() {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(usersDB));
  if (currentUserId) {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, currentUserId);
  } else {
    localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
  }
}

function getCurrentUser() {
  return currentUserId ? usersDB[currentUserId] : null;
}

let currentCategory = 'all';
let searchQuery = '';
let selectedEventId = 1;
let regTab = 'upcoming';

const toastEl = document.getElementById('toast');
const navRegCountEl = document.getElementById('nav-reg-count');

// Вспомогательная функция создания DOM-элемента
function createEl(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined && text !== null) el.textContent = text;
  return el;
}

// Показ всплывающего уведомления
let toastTimer;
function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove('show');
  }, 2800);
}

// Отрисовка шапки профиля и баланса Шабурят
function renderUserPanel() {
  const panelEl = document.getElementById('user-panel');
  if (!panelEl) return;

  panelEl.innerHTML = '';
  const user = getCurrentUser();

  if (!user) {
    const loginBtn = createEl('button', 'btn-login-nav', 'Войти в аккаунт');
    loginBtn.addEventListener('click', openAuthModal);
    panelEl.appendChild(loginBtn);
    return;
  }

  const bonusPill = createEl('button', 'bonus-pill', '🪙 ' + user.balance + ' Шабурят');
  bonusPill.title = 'Открыть кошелёк Шабурят';
  bonusPill.addEventListener('click', openWalletModal);
  panelEl.appendChild(bonusPill);

  const userChip = createEl('div', 'user-chip');
  userChip.appendChild(createEl('span', 'user-name-text', user.name));

  const logoutBtn = createEl('button', 'btn-logout', 'Выйти');
  logoutBtn.addEventListener('click', logoutUser);
  userChip.appendChild(logoutBtn);

  panelEl.appendChild(userChip);
}

// Обновление счётчиков регистраций
function updateCounters() {
  const user = getCurrentUser();
  const regIds = user ? user.registeredIds : Array.of();
  const upcomingCount = EVENTS_DATA.filter(e => !e.isPast && regIds.includes(e.id)).length;

  if (navRegCountEl) {
    navRegCountEl.textContent = upcomingCount;
    navRegCountEl.style.display = upcomingCount > 0 ? 'inline-block' : 'none';
  }
  const segUpcomingEl = document.getElementById('seg-upcoming');
  if (segUpcomingEl) {
    segUpcomingEl.textContent = 'Предстоящие • ' + upcomingCount;
  }
}

// Модальное окно авторизации
function openAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('open');
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.remove('open');
}

function loginUser(name, studentId) {
  const cleanId = studentId.trim().toUpperCase();
  const cleanName = name.trim();
  if (!cleanId || !cleanName) return;

  if (!usersDB[cleanId]) {
    usersDB[cleanId] = {
      id: cleanId,
      name: cleanName,
      balance: 0,
      weeklyServiceEarned: 0,
      weeklyTotalEarned: 0,
      registeredIds: Array.of(),
      attendedIds: Array.of(),
      history: Array.of()
    };
    showToast('Создан новый аккаунт! Кошелёк Шабурят подключён');
  } else {
    showToast('Добро пожаловать, ' + usersDB[cleanId].name + '!');
  }

  currentUserId = cleanId;
  saveStorage();
  closeAuthModal();
  refreshAllUI();
}

function logoutUser() {
  currentUserId = null;
  saveStorage();
  showToast('Вы вышли из аккаунта');
  refreshAllUI();
}

// Модальное окно кошелька Шабурят
function openWalletModal() {
  const user = getCurrentUser();
  if (!user) {
    openAuthModal();
    return;
  }

  document.getElementById('wallet-balance-num').textContent = user.balance + ' 🪙';
  document.getElementById('wallet-service-limit').textContent =
    user.weeklyServiceEarned + ' / ' + SERVICE_WEEKLY_LIMIT + ' Шабурят';
  document.getElementById('wallet-total-limit').textContent =
    user.weeklyTotalEarned + ' / ' + GLOBAL_WEEKLY_LIMIT + ' Шабурят';

  const historyListEl = document.getElementById('wallet-history-list');
  historyListEl.innerHTML = '';

  if (!user.history || user.history.length === 0) {
    historyListEl.appendChild(
      createEl('div', 'empty-state', 'Пока нет начислений. Посетите мероприятие, чтобы получить +10 Шабурят!')
    );
  } else {
    user.history.forEach(item => {
      const row = createEl('div', 'history-item');
const left = createEl('div');
left.appendChild(createEl('div', 'history-item-title', item.title));
left.appendChild(createEl('div', 'history-item-date', item.date));
const right = createEl('div', 'history-item-amount', '+' + item.amount + ' 🪙');
row.appendChild(left);
row.appendChild(right);
historyListEl.appendChild(row);
});
}
document.getElementById('wallet-modal').classList.add('open');
}
function closeWalletModal() {
const modal = document.getElementById('wallet-modal');
if (modal) modal.classList.remove('open');
}
// Переключение экранов на index.html (Афиша <-> Детали)
function switchFeedOrDetails(viewName) {
const feedView = document.getElementById('view-feed');
const detailsView = document.getElementById('view-details');
if (!feedView || !detailsView) return;
feedView.classList.toggle('active', viewName === 'feed');
detailsView.classList.toggle('active', viewName === 'details');
window.scrollTo({ top: 0, behavior: 'smooth' });
}
// Запись или отмена регистрации
function toggleRegistration(eventId, e) {
if (e) e.stopPropagation();
const user = getCurrentUser();
if (!user) {
showToast('Войдите в аккаунт, чтобы записаться и копить Шабурята');
openAuthModal();
return;
}
const event = EVENTS_DATA.find(item => item.id === eventId);
if (!event) return;
if (user.registeredIds.includes(eventId)) {
user.registeredIds = user.registeredIds.filter(id => id !== eventId);
showToast('Регистрация на «' + event.title + '» отменена');
} else {
user.registeredIds.push(eventId);
showToast('Вы записаны! Подтвердите посещение, чтобы получить +10 Шабурят');
}
saveStorage();
refreshAllUI();
const detailsView = document.getElementById('view-details');
if (detailsView && detailsView.classList.contains('active') && selectedEventId === eventId) {
openEventDetails(eventId);
}
}
// Подтверждение посещения и начисление +10 Шабурят по правилам колледжа
function confirmAttendance(eventId, e) {
if (e) e.stopPropagation();
const user = getCurrentUser();
if (!user) {
openAuthModal();
return;
}
const event = EVENTS_DATA.find(item => item.id === eventId);
if (!event) return;
// Правило: за одно действие нельзя получить баллы повторно
if (user.attendedIds.includes(eventId)) {
showToast('Посещение этого события уже подтверждено');
return;
}
// Правило: лимит сервиса «Хакатон Хаб» — 20 Шабурят в неделю
if (user.weeklyServiceEarned + BONUS_PER_VISIT > SERVICE_WEEKLY_LIMIT) {
showToast('Достигнут недельный лимит сервиса Хакатон Хаб (20 Шабурят)');
return;
}
// Правило: общий недельный потолок — 60 Шабурят в неделю
if (user.weeklyTotalEarned + BONUS_PER_VISIT > GLOBAL_WEEKLY_LIMIT) {
showToast('Достигнут общий недельный лимит начислений (60 Шабурят)');
return;
}
user.attendedIds.push(eventId);
user.balance += BONUS_PER_VISIT;
user.weeklyServiceEarned += BONUS_PER_VISIT;
user.weeklyTotalEarned += BONUS_PER_VISIT;
user.history.unshift({
title: 'Хакатон Хаб: ' + event.title,
amount: BONUS_PER_VISIT,
date: 'Сегодня • подтверждено'
});
saveStorage();
refreshAllUI();
showToast('Посещение подтверждено! Начислено +' + BONUS_PER_VISIT + ' Шабурят 🪙');
}
// Создание карточки для Афиши
function buildFeedCard(event) {
const user = getCurrentUser();
const isReg = user ? user.registeredIds.includes(event.id) : false;
const card = createEl('article', event.featured ? 'event-card featured' : 'event-card');
card.addEventListener('click', () => openEventDetails(event.id));
const topWrap = createEl('div');
const topRow = createEl('div', 'card-top-row');
topRow.appendChild(createEl('span', 'card-tag', event.category.toUpperCase()));
topRow.appendChild(createEl('span', 'card-bonus-badge', '+10 🪙'));
topWrap.appendChild(topRow);
topWrap.appendChild(createEl('h2', 'card-title', event.title));
topWrap.appendChild(createEl('p', 'card-desc', event.shortDesc));
const metaList = createEl('div', 'card-meta-list');
metaList.appendChild(createEl('div', 'meta-item', '📅 ' + event.dateList));
metaList.appendChild(createEl('div', 'meta-item', '📍 ' + event.location));
topWrap.appendChild(metaList);
const footer = createEl('div', 'card-footer');
footer.appendChild(createEl('span', 'organizer', event.organizer));
let btnClass = event.featured ? 'btn-card btn-card-light' : 'btn-card btn-card-primary';
let btnText = 'Записаться';
if (isReg) {
btnClass = 'btn-card btn-card-registered';
btnText = 'Вы записаны';
}
const btn = createEl('button', btnClass, btnText);
btn.addEventListener('click', e => toggleRegistration(event.id, e));
footer.appendChild(btn);
card.appendChild(topWrap);
card.appendChild(footer);
return card;
}
// Рендер афиши (на index.html)
function renderFeed() {
const eventsListEl = document.getElementById('events-list');
if (!eventsListEl) return;
eventsListEl.innerHTML = '';
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
eventsListEl.appendChild(createEl('div', 'empty-state', 'По вашему запросу событий не найдено'));
return;
}
filtered.forEach(event => {
eventsListEl.appendChild(buildFeedCard(event));
});
}
// Открытие деталей события
function openEventDetails(eventId) {
const detailsView = document.getElementById('view-details');
if (!detailsView) {
window.location.href = 'index.html?event=' + eventId;
return;
}
const event = EVENTS_DATA.find(item => item.id === eventId);
if (!event) return;
selectedEventId = eventId;
const user = getCurrentUser();
const isReg = user ? user.registeredIds.includes(eventId) : false;
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
ctaCaption.textContent = 'Подтвердите посещение во вкладке «Мои регистрации» для получения +10 Шабурят';
} else {
ctaBtn.classList.remove('registered');
ctaText.textContent = 'Записаться';
ctaArrow.style.display = 'inline';
ctaCaption.textContent = 'Бонус +10 Шабурят начислится после подтверждения посещения';
}
switchFeedOrDetails('details');
}
// Создание карточки для страницы «Мои регистрации»
function buildRegistrationCard(event) {
const user = getCurrentUser();
const isAttended = user ? user.attendedIds.includes(event.id) : false;
const card = createEl('article', 'event-card');
card.addEventListener('click', () => openEventDetails(event.id));
const topWrap = createEl('div');
const header = createEl('div', 'reg-card-header');
header.appendChild(createEl('span', 'card-tag', event.category.toUpperCase()));
header.appendChild(
createEl('span', 'status-pill-green', isAttended ? '✓ Посещение подтверждено' : '✓ Вы записаны')
);
topWrap.appendChild(header);
topWrap.appendChild(createEl('h2', 'card-title', event.title));
topWrap.appendChild(createEl('p', 'card-desc', event.shortDesc));
const metaList = createEl('div', 'card-meta-list compact');
metaList.appendChild(createEl('div', 'meta-item', '📅 ' + event.dateOnly + ' • ' + event.timeRange));
metaList.appendChild(createEl('div', 'meta-item', '📍 ' + event.location));
topWrap.appendChild(metaList);
topWrap.appendChild(createEl('div', 'organizer reg-organizer', event.organizer));
// Кнопка подтверждения посещения для начисления Шабурят
if (!event.isPast) {
if (isAttended) {
const doneBtn = createEl('button', 'btn-confirm-visit done', '🪙 +10 Шабурят начислено');
doneBtn.addEventListener('click', e => e.stopPropagation());
topWrap.appendChild(doneBtn);
} else {
const confirmBtn = createEl(
'button',
'btn-confirm-visit',
'Подтвердить посещение (+10 Шабурят 🪙)'
);
confirmBtn.addEventListener('click', e => confirmAttendance(event.id, e));
topWrap.appendChild(confirmBtn);
}
}
const actions = createEl('div', 'reg-actions');
if (!event.isPast && !isAttended) {
const cancelLink = createEl('span', 'link-cancel', 'Отменить регистрацию');
cancelLink.addEventListener('click', e => toggleRegistration(event.id, e));
actions.appendChild(cancelLink);
} else {
actions.appendChild(createEl('span'));
}
const detailsLink = createEl('span', 'link-details', 'Подробнее');
detailsLink.addEventListener('click', e => {
e.stopPropagation();
openEventDetails(event.id);
});
actions.appendChild(detailsLink);
card.appendChild(topWrap);
card.appendChild(actions);
return card;
}
// Рендер страницы «Мои регистрации» (на registrations.html)
function renderRegistrations() {
const registrationsListEl = document.getElementById('registrations-list');
if (!registrationsListEl) return;
registrationsListEl.innerHTML = '';
const user = getCurrentUser();
if (!user) {
const loginPrompt = createEl('div', 'empty-state');
loginPrompt.appendChild(
createEl('p', '', 'Войдите в единую учётную запись, чтобы видеть свои регистрации и копить Шабурята.')
);
const btn = createEl('button', 'btn-login-nav', 'Войти в аккаунт');
btn.style.marginTop = '14px';
btn.addEventListener('click', openAuthModal);
loginPrompt.appendChild(btn);
registrationsListEl.appendChild(loginPrompt);
return;
}
const upcomingEvents = EVENTS_DATA.filter(e => !e.isPast && user.registeredIds.includes(e.id));
const pastEvents = EVENTS_DATA.filter(e => e.isPast);
const listToRender = regTab === 'upcoming' ? upcomingEvents : pastEvents;
if (listToRender.length === 0) {
const emptyText = regTab === 'upcoming'
? 'У вас пока нет предстоящих регистраций'
: 'У вас пока нет прошедших регистраций';
registrationsListEl.appendChild(createEl('div', 'empty-state', emptyText));
return;
}
listToRender.forEach(event => {
registrationsListEl.appendChild(buildRegistrationCard(event));
});
}
function refreshAllUI() {
renderUserPanel();
updateCounters();
renderFeed();
renderRegistrations();
}
// Инициализация
document.addEventListener('DOMContentLoaded', () => {
loadStorage();
refreshAllUI();
// Форма входа/регистрации
const authForm = document.getElementById('auth-form');
if (authForm) {
authForm.addEventListener('submit', e => {
e.preventDefault();
const nameVal = document.getElementById('auth-name').value;
const idVal = document.getElementById('auth-id').value;
loginUser(nameVal, idVal);
});
}
// Кнопки быстрого входа в демо-аккаунты
document.querySelectorAll('.demo-btn').forEach(btn => {
btn.addEventListener('click', () => {
loginUser(btn.dataset.name, btn.dataset.id);
});
});
// Закрытие модальных окон
const closeAuthBtn = document.getElementById('close-auth-modal');
if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthModal);
const closeWalletBtn = document.getElementById('close-wallet-modal');
if (closeWalletBtn) closeWalletBtn.addEventListener('click', closeWalletModal);
// Поиск на главной
const searchInput = document.getElementById('search-input');
if (searchInput) {
searchInput.addEventListener('input', e => {
searchQuery = e.target.value.trim().toLowerCase();
renderFeed();
});
}
// Фильтры по категориям
document.querySelectorAll('#category-chips .chip').forEach(chip => {
chip.addEventListener('click', () => {
document.querySelectorAll('#category-chips .chip').forEach(c => c.classList.remove('active'));
chip.classList.add('active');
currentCategory = chip.dataset.category;
renderFeed();
});
});
// Кнопка «Назад к афише»
const btnBack = document.getElementById('btn-back');
if (btnBack) {
btnBack.addEventListener('click', () => {
window.history.replaceState({}, '', 'index.html');
switchFeedOrDetails('feed');
});
}
// Кнопка «Записаться» на экране деталей
const detailCtaBtn = document.getElementById('detail-cta-btn');
if (detailCtaBtn) {
detailCtaBtn.addEventListener('click', () => {
toggleRegistration(selectedEventId);
});
}
// Тумблер напоминаний
const reminderToggle = document.getElementById('detail-reminder-toggle');
const reminderStatusText = document.getElementById('reminder-status-text');
if (reminderToggle && reminderStatusText) {
reminderToggle.addEventListener('change', () => {
if (reminderToggle.checked) {
reminderStatusText.textContent = 'Локальные уведомления в браузере';
showToast('Напоминания включены (за день и за час)');
} else {
reminderStatusText.textContent = 'Уведомления отключены';
showToast('Напоминания отключены');
}
});
}
// Переключатель «Предстоящие / Прошедшие»
document.querySelectorAll('.segment-btn').forEach(btn => {
btn.addEventListener('click', () => {
document.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
btn.classList.add('active');
regTab = btn.dataset.tab;
renderRegistrations();
});
});
// Открытие деталей по ссылке с registrations.html
const params = new URLSearchParams(window.location.search);
const eventParam = Number(params.get('event'));
if (eventParam && document.getElementById('view-details')) {
openEventDetails(eventParam);
}
});
