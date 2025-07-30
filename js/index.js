const ICONS = ['apple', 'banana', 'cherry', 'grapes', 'strawberry'];

const winningCombos = [
  { name: 'cherry', count: 2, reward: 50 },
  { name: 'grapes', count: 4, reward: 150 },
  { name: 'strawberry', count: 3, reward: 100 },
  { name: 'banana', count: 3, reward: 40 },
  { name: 'apple', count: 4, reward: 130 },
  { name: 'strawberry', count: 5, reward: 500 }
];

const BASE_SPINNING_DURATION = 2.7;
const COLUMN_SPINNING_DURATION = 0.3;

let cols = [];
let finalRow = [];

// 🔧 Допоміжні функції (мають бути оголошені до використання)
function getRandomIcon() {
  return ICONS[Math.floor(Math.random() * ICONS.length)];
}

function randomDuration() {
  return Math.floor(Math.random() * 10) / 100;
}

// 🚀 DOM завантажився
document.addEventListener('DOMContentLoaded', () => {
  cols = document.querySelectorAll('.col');
  initReels();
  bindUI();
});

function initReels() {
  const baseItemAmount = 40;
  cols.forEach((col, i) => {
    const totalItems = baseItemAmount + i * 3;
    let itemsHTML = '', firstThree = '';

    for (let j = 0; j < totalItems; j++) {
      const icon = getRandomIcon();
      const item = `<div class="icon" data-item="${icon}"><img src="items/${icon}.png"></div>`;
      itemsHTML += item;
      if (j < 3) firstThree += item;
    }

    col.innerHTML = itemsHTML + firstThree;
  });
}

function bindUI() {
  const modal = document.querySelector(".modal-overlay");
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  document.querySelector(".cheating-button").addEventListener("click", function () {
    this.classList.add("disabled");
    spin({ cheat: true, elem: this });
  });
}

function showModal(combo) {
  const modal = document.querySelector(".modal-overlay");
  const amountSpan = modal.querySelector(".modal-amount");
  const message = modal.querySelector(".modal-message");

  amountSpan.textContent = `+${combo.reward}`;
  message.innerHTML = `You won <span class="modal-amount">+${combo.reward}</span> coins`;

  modal.style.display = "flex";
}

function closeModal() {
  document.querySelector(".modal-overlay").style.display = "none";
}

function spin({ cheat = false, elem = null } = {}) {
  document.getElementById("slot-trigger").classList.add("disabled");
  document.querySelector(".cheating-button").classList.add("disabled");
  if (elem) elem.setAttribute('disabled', true);

  // Очистити старі виграшні іконки
  document.querySelectorAll('.icon.win-icon').forEach(icon => icon.classList.remove('win-icon'));

  let duration = BASE_SPINNING_DURATION + randomDuration();
  finalRow = [];

  cols.forEach(col => {
    duration += COLUMN_SPINNING_DURATION + randomDuration();
    col.style.animationDuration = `${duration}s`;
  });

  document.getElementById('container').classList.add('spinning');

  setTimeout(() => setResult(cheat), BASE_SPINNING_DURATION * 1000 / 2);

  setTimeout(() => {
    document.getElementById('container').classList.remove('spinning');
    document.getElementById("slot-trigger").classList.remove("disabled");
    document.querySelector(".cheating-button").classList.remove("disabled");
    if (elem) elem.removeAttribute('disabled');

    // ✅ Після завершення анімації
    checkWin();

  }, duration * 1000);

  highlightActualCenterIcons();


}

function highlightActualCenterIcons(comboName = null) {
  cols.forEach((col, i) => {
    const icons = col.querySelectorAll('.icon');
    const centerIcon = icons[icons.length - 2]; // справжній центр після обертання
    const item = centerIcon.getAttribute('data-item');

    if (comboName && item === comboName) {
      centerIcon.classList.add('win-icon');
      console.log(`🎯 Column ${i}: highlighted center "${item}"`);
    } else {
      centerIcon.classList.remove('win-icon');
    }
  });
}








function setResult(isCheat) {
  finalRow = [];

  cols.forEach(col => {
    const results = isCheat
      ? [getRandomIcon(), 'strawberry', getRandomIcon()]
      : [getRandomIcon(), getRandomIcon(), getRandomIcon()];

    finalRow.push(results[1]);

    const images = col.querySelectorAll('.icon img');
    const icons = col.querySelectorAll('.icon');

    for (let i = 0; i < 3; i++) {
      images[i].src = `items/${results[i]}.png`;
      images[images.length - 3 + i].src = `items/${results[i]}.png`;

      icons[i].setAttribute('data-item', results[i]);
      icons[icons.length - 3 + i].setAttribute('data-item', results[i]);
    }
  });
}

function checkWin() {
  const counts = {};
  finalRow.forEach(item => {
    counts[item] = (counts[item] || 0) + 1;
  });

  for (const combo of winningCombos) {
    if ((counts[combo.name] || 0) >= combo.count) {
      console.log(`🎉 WIN ${combo.count}x ${combo.name} → +${combo.reward}`);

      // Підсвічуємо тільки відповідні центральні іконки
      highlightActualCenterIcons(combo.name);

      // Показуємо модалку після затримки
      setTimeout(() => {
        showModal(combo);
      }, 700);

      break;
    }
  }
}
