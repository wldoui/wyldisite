const art = {
  "лаборатория": `
+-----------------+
|                 |
|                 |
|\\               /|
| \\_ _       _ _/ |
|    | |    | |   |
+-----------------+`,

  "коридор": `
+-----------------+
| \\             / |
|    \\       /    |
|      +---+      |
|      |   |      |
|      |   |      |
+-----------------+`,

  "комната отдыха": `
+---------------------+
|                     |
|  []     []     []   |
|        _____        |
|       |_____|       |
|      (_______)      |
+---------------------+`,

  "библиотека": `
+---------------------+
|        _____  +---+ |
| +-+   |_____| |---| |
| |  |  |_____| |   | |
| |  |   _____  |---| |
| |  |  |     | |___| |
+---------------------+`,

  "кухня": `
+--------------------+
|        []     ___  |
|        []    |   | |
|              |___| |
|   _________  |   | |
|  |         | |___| |
+--------------------+`,

  "столовая": `
+---------------------+
|                     |
| |                 | |
| |    |---|---|    | |
| +--+ |   |   | +--+ |
| |  | |---|---| |  | |
+---------------------+`,

  "запасное_помещение": `
+---------------------+
|       .-----.       |
|      /       \\     |
|     /         \\    |
|    /___________\\   |
|                     |
+---------------------+`,

  "комната_тестирования": `
+---------------------+
|  .-----..-----..   |
|  |     | |     |   |
|  |_____| |_____|   |
|  |     | |     |   |
|  |_____| |_____|   |
+---------------------+`,

  "психологический_кабинет": `
+--------------------+
|        [|]         |
| |     [___]        |
| |                  |
| +--+ +-----+  +--+ |
| |  | [_____]  |  | |
+--------------------+`,

  "смотровая": `
+---------------------+
|                     |
|--+     +---+     +--|
|  |     |   |     |  |
|--+     +---+     +--|
|                     |
+---------------------+`,

  "передача": `
+---------------------+
|                     |
|  ___        __      |
| |   |      |  |     |
| |   |  +---|__|--+  |
| |___|  |   |  |  |  |
+---------------------+`,

  "операционная": `
+---------------------+
|   .---. .---.       |
|   |___| |___|       |
|              |      |
|   .---. .---.|__+---|
|   |___| |___||  |   |
+---------------------+`,

  "улица": `
+---------------------+
|~~  ~~~  / \\    | ~~~|
|~~~~ |  /   \\    ~~~~|
|~~~~   /     \\   ~~~~|
|~~~   /       \\   ~~~|
||    /         \\    ||
+---------------------+`
};

const entities = [
  {
    name: "Существо",
    ascii: `
      .------.
     /  ~ ~  \\
    |  /  _  \\ |
    | |  / \\  | |
     \\ \\___/  /
      '-------'`,
    dialogue: [
      "Вы не понимаете, что оно говорит.",
      "Ваши сны и реальность пересекаются.",
      "Скрытые записи о вас..."
    ]
  },
  {
    name: "Тень",
    ascii: `
      .--.
  .--'    '---.
  .'                '.
 /                    \\
:                      :
|                      |
:                      :
 \\                    /
  '.__              _.'
       '---._____.---'`,
    dialogue: [
      "Тени обманывают ваш разум.",
      "Никто не знает, кто вы на самом деле.",
      "У вас есть секреты, которые должны быть раскрыты."
    ]
  },
  {
    name: "Призрак",
    ascii: `
      .-.
     (   )
    .-'-'-.
  .-         -.
.'             '.
|    О     О    |
|     -     -    |
|      '._.'     |
|               |
 '._         _.'
    '-.....-'`,
    dialogue: [
      "Вы заблудились в своих мыслях.",
      "Сколько людей прошло мимо вас?",
      "Все ваши страхи становятся реальностью."
    ]
  }
];

// Основные переменные
let currentLocation = "лаборатория";
let inventory = [];
let currentEntity = null;

// Доступные команды
const commands = `
Доступные команды:
- осмотреть [объект/локацию]: осмотреть локацию или объект.
- переместиться [локация]: переместиться в другую локацию.
- взять [предмет]: взять предмет.
- инвентарь: показать ваш инвентарь.
- поговорить: поговорить с сущностью (если есть).
- спрятаться: спрятаться от сущности (если есть).
`;

const descriptions = {
  "лаборатория": "Здесь исследуют человеческий разум. Стены окутаны стерильным светом, а приборы мерцают загадочными огнями.",
  "лаборатория_детализированное": "Лаборатория полна странных и таинственных приборов. Стены покрыты зеркальными панелями, а на столах лежат полупрозрачные бутылочки с неизвестными жидкостями. Это место когда-то было центром ужасных экспериментов, и воздух до сих пор пропитан их последствиями.",
  "коридор": "Тёмный и узкий, с едва видимыми дверями, ведущими в неизвестность.",
  "комната отдыха": "Старое, покосившееся место для отдыха. Столы и стулья покрыты пылью.",
  "библиотека": "Тишина, нарушаемая лишь шорохом страниц. Множество старых книг, некоторые из которых явно не из этого мира.",
  "кухня": "Узкое помещение, заполненное жёлтыми огоньками. Запах остался в воздухе, но ничего не видно.",
  "столовая": "Грязные столы и стулья. На полу лежат обрывки бумаги.",
  "запасное_помещение": "Склад с различными устройствами, которые больше не работают.",
  "комната_тестирования": "Место для проведения страшных экспериментов, с разнообразными устройствами и мониторами.",
  "психологический_кабинет": "Это место, где пытались исследовать психику людей, воздействуя на их сознание.",
  "смотровая": "Ужасное место, где проводились эксперименты на животных и людях.",
  "передача": "Старое оборудование для передачи данных. Тут вы что-то теряете.",
  "операционная": "Место для операций, оставившее следы ужаса на множестве людей.",
  "улица": "Всё окутано густым туманом, дома выглядят заброшенными."
};

// Функция начала игры
function startGame() {
  displayMessage("Игра началась!");
  displayMessage("Вы находитесь в " + currentLocation + ".");
  displayMessage("Описание локации: " + descriptions[currentLocation]);
  displayMessage(commands);
  displayAsciiArt(currentLocation);
  maybeEntityAppears();
}

// Отображение ASCII-арта
function displayAsciiArt(locationOrEntity) {
  const asciiContainer = document.getElementById('ascii-art-container');
  const ascii = art[locationOrEntity] || '';
  asciiContainer.textContent = ascii;
}

// Отображение ASCII-арта сущности
function displayEntityAscii(entityName) {
  const entityAsciiContainer = document.getElementById('entity-ascii-container');
  const entity = entities.find(e => e.name === entityName);
  if (entity) {
    entityAsciiContainer.textContent = entity.ascii;
  }
}

// Обработка введённой команды
function processCommand() {
  const commandInput = document.getElementById('command-input').value.toLowerCase().trim();
  document.getElementById('command-input').value = '';

  if (commandInput.startsWith('осмотреть')) {
    const target = commandInput.slice(9).trim();
    if (target === "лаборатория") {
      displayMessage(descriptions["лаборатория_детализированное"]);
    } else if (descriptions[target]) {
      displayMessage(descriptions[target]);
    } else {
      displayMessage("Является ли это действительным объектом или локацией?");
    }
  }
  else if (commandInput === "инвентарь") {
    viewInventory();
  } 
  else if (commandInput === "поговорить" && currentEntity) {
    talkToEntity();
  } 
  else if (commandInput === "спрятаться" && currentEntity) {
    hideFromEntity();
  } 
  else {
    displayMessage("Неизвестная команда.");
  }
}

// Отображение сообщения
function displayMessage(message) {
  const infoWindow = document.getElementById('info-window');
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  infoWindow.appendChild(messageElement);
  infoWindow.scrollTop = infoWindow.scrollHeight;
}

// Функция случайного появления сущности
function maybeEntityAppears() {
  if (Math.random() < 0.1) { // 10% шанс появления сущности
    currentEntity = entities[Math.floor(Math.random() * entities.length)];
    displayMessage(`Появилось существо: ${currentEntity.name}`);
    displayEntityAscii(currentEntity.name);
  }
}

startGame();
