const ICONS = ['apple', 'banana', 'big_win', 'cherry', 'grapes', 'strawberry',];

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
var cols;

let finalRow = [];


document.querySelector(".cheating-button").addEventListener("click", function () {
  spin({ cheat: true, elem: this });
});



window.addEventListener('DOMContentLoaded', function () {
    cols = document.querySelectorAll('.col');
    setInitialItems();
});
function setInitialItems() {
    let baseItemAmount = 40;
    for (let i = 0; i < cols.length; ++i) {
        let col = cols[i];
        let amountOfItems = baseItemAmount + (i * 3);
        let elms = '';
        let firstThreeElms = '';
        for (let x = 0; x < amountOfItems; x++) {
            let icon = getRandomIcon();
            let item = '<div class="icon" data-item="' + icon + '"><img src="items/' + icon + '.png"></div>';
            elms += item;
            if (x < 3) firstThreeElms += item;
        }
        col.innerHTML = elms + firstThreeElms;
    }
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
    const modal = document.querySelector(".modal-overlay")
    modal.style.display = "none"
}


document.querySelector(".modal-overlay").addEventListener("click", function (e) {
    // Закриваємо лише якщо клік був саме по фону, а не по вмісту
    if (e.target === this) {
        closeModal();
    }
});


document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeModal();
    }
});




function spin(options = {}) {
  const isCheat = options.cheat || false;
  const triggerElem = options.elem || null;

  // Блокуємо ручку чи елемент
  document.getElementById("slot-trigger").classList.add("disabled");
  if (triggerElem) triggerElem.setAttribute('disabled', true);

  let duration = BASE_SPINNING_DURATION + randomDuration();
  finalRow = [];

  for (let col of cols) {
    duration += COLUMN_SPINNING_DURATION + randomDuration();
    col.style.animationDuration = duration + "s";
  }

  document.getElementById('container').classList.add('spinning');

  // Результат підставляємо пізніше
  window.setTimeout(() => {
    setResult(isCheat);
  }, BASE_SPINNING_DURATION * 1000 / 2);

  window.setTimeout(() => {
    document.getElementById('container').classList.remove('spinning');
    if (triggerElem) triggerElem.removeAttribute('disabled');
    document.getElementById("slot-trigger").classList.remove("disabled");

    setTimeout(() => {
      const counts = {};
      finalRow.forEach(icon => {
        counts[icon] = (counts[icon] || 0) + 1;
      });

      for (const combo of winningCombos) {
        if ((counts[combo.name] || 0) >= combo.count) {
          console.log(`🎉 WIN ${combo.count}x ${combo.name} → +${combo.reward}`);
          showModal(combo);
        }
      }

    }, 1000);
  }, duration * 1000);
}






function setResult(isCheat = false) {
  finalRow = [];

  for (let col of cols) {
    let results;
    if (isCheat) {
      // Гарантована середня полуничка
      results = [getRandomIcon(), 'strawberry', getRandomIcon()];
    } else {
      results = [getRandomIcon(), getRandomIcon(), getRandomIcon()];
    }

    finalRow.push(results[1]);

    const icons = col.querySelectorAll('.icon img');
    for (let x = 0; x < 3; x++) {
      icons[x].setAttribute('src', `items/${results[x]}.png`);
      icons[icons.length - 3 + x].setAttribute('src', `items/${results[x]}.png`);
    }
  }
}



function getRandomIcon() {
    return ICONS[Math.floor(Math.random() * ICONS.length)];
}
function randomDuration() {
    return Math.floor(Math.random() * 10) / 100;
}