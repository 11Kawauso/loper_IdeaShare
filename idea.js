/* =========================================================
   アイデア投稿ページ スクリプト
   ※ ローカル保存（localStorage）のみで動作する簡易版です。
   ========================================================= */

const STORAGE_KEY = 'loper_ideas';
const MAX_TEXT_LENGTH = 300;

let ideas = [];
const els = {};

document.addEventListener('DOMContentLoaded', () => {
  cacheElements();
  loadIdeas();
  renderIdeas();
  setupForm();
});

function cacheElements() {
  els.form = document.getElementById('ideaForm');
  els.nameInput = document.getElementById('ideaNameInput');
  els.textInput = document.getElementById('ideaTextInput');
  els.charCounter = document.getElementById('ideaCharCounter');
  els.list = document.getElementById('ideaList');
}

function loadIdeas() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    ideas = raw ? JSON.parse(raw) : [];
  } catch (e) {
    ideas = [];
  }
}

function saveIdeas() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return y + '年' + m + '月' + d + '日 ' + hh + ':' + mm;
}

function setupForm() {
  els.textInput.addEventListener('input', () => {
    const len = els.textInput.value.length;
    els.charCounter.textContent = len + ' / ' + MAX_TEXT_LENGTH;
    els.charCounter.className = 'idea-char-counter' +
      (len >= MAX_TEXT_LENGTH ? ' at-limit' : len >= MAX_TEXT_LENGTH - 50 ? ' near-limit' : '');
  });

  els.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = els.textInput.value.trim();
    if (!text) return;

    const name = els.nameInput.value.trim() || '匿名';

    const newIdea = {
      id: Date.now(),
      name: name,
      text: text,
      date: formatDate(new Date()),
      likes: 0,
      liked: false,
    };

    ideas.unshift(newIdea);
    saveIdeas();
    renderIdeas();

    els.form.reset();
    els.charCounter.textContent = '0 / ' + MAX_TEXT_LENGTH;
    els.charCounter.className = 'idea-char-counter';
  });
}

function renderIdeas() {
  els.list.innerHTML = '';

  if (ideas.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'idea-empty';
    empty.textContent = 'まだアイデアが投稿されていません。最初の投稿者になりましょう。';
    els.list.appendChild(empty);
    return;
  }

  ideas.forEach((idea) => {
    els.list.appendChild(createIdeaCard(idea));
  });
}

function createIdeaCard(idea) {
  const card = document.createElement('div');
  card.className = 'idea-card';

  const header = document.createElement('div');
  header.className = 'idea-card-header';

  const name = document.createElement('span');
  name.className = 'idea-card-name';
  name.textContent = idea.name;

  const date = document.createElement('span');
  date.className = 'idea-card-date';
  date.textContent = idea.date;

  header.appendChild(name);
  header.appendChild(date);

  const text = document.createElement('div');
  text.className = 'idea-card-text';
  text.textContent = idea.text;

  const footer = document.createElement('div');
  footer.className = 'idea-card-footer';

  const likeBtn = document.createElement('button');
  likeBtn.type = 'button';
  likeBtn.className = 'idea-like-btn' + (idea.liked ? ' liked' : '');
  likeBtn.textContent = '👍 ' + idea.likes;
  likeBtn.addEventListener('click', () => {
    idea.liked = !idea.liked;
    idea.likes += idea.liked ? 1 : -1;
    likeBtn.textContent = '👍 ' + idea.likes;
    likeBtn.classList.toggle('liked', idea.liked);
    saveIdeas();
  });

  footer.appendChild(likeBtn);

  card.appendChild(header);
  card.appendChild(text);
  card.appendChild(footer);

  return card;
}
