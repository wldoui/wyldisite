// Система создана Wyldi и Woowz в равных долях
const Wyldi = {
  random: (min = 0, max = 1) => Math.random() * (max - min) + min,
  randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  randomElement: (arr) => arr[Math.floor(Math.random() * arr.length)],
  clamp: (value, min, max) => Math.min(Math.max(value, min), max),
  uid: () => Date.now().toString(36) + Math.random().toString(36).substr(2)
};

// Глобальные переменные
let zIndexCounter = 1000;
const desktop = document.getElementById('desktop');
const startMenu = document.getElementById('start-menu');

// Системные настройки
const systemSettings = {
  wallpaper: null,
  wallpaperType: 'color',
  wallpaperColor: '#550000',
  iconSize: 80,
  showGrid: true,
  snapToGrid: true,
  gridSize: 20
};

// Приложения системы
const applications = [
  { id: 'paint', title: 'Bloodeye Paint', icon: '🎨', type: 'paint' },
  { id: 'calculator', title: 'Dead Calculator', icon: '🧮', type: 'calculator' },
  { id: 'editor', title: 'Bloodeye Editor', icon: '📝', type: 'editor' },
  { id: 'music', title: 'Death Player', icon: '🎵', type: 'music' },
  { id: 'browser', title: 'Hell Browser', icon: '🌐', type: 'browser' },
  { id: 'files', title: 'File Manager', icon: '📁', type: 'files' },
  { id: 'nasm-os', title: 'NASM-OS', icon: '💾', type: 'nasm-os' },
  { id: 'terminal', title: 'Терминал GOLU', icon: '📟', type: 'terminal' },
  { id: 'pituh', title: 'Ссаный Питух', icon: '🗑️', type: 'pituh' },
  { id: 'mocha', title: 'Святая Моча', icon: '💧', type: 'mocha' },
  { id: 'vuvz-vs-spanch', title: 'Вувз vs Спанч', icon: '💣', type: 'vuvz-vs-spanch' },
  { id: 'settings', title: 'Настройки', icon: '⚙️', type: 'settings' }
];

// Управление рабочим столом
const DesktopManager = {
  init: function() {
    this.createGrid();
    this.setupEvents();
  },

  createGrid: function() {
    const grid = document.createElement('div');
    grid.id = 'desktop-grid';
    grid.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background-image: 
        repeating-linear-gradient(0deg, transparent, transparent ${systemSettings.gridSize-1}px, rgba(255,0,0,0.1) ${systemSettings.gridSize-1}px, rgba(255,0,0,0.1) ${systemSettings.gridSize}px),
        repeating-linear-gradient(90deg, transparent, transparent ${systemSettings.gridSize-1}px, rgba(255,0,0,0.1) ${systemSettings.gridSize-1}px, rgba(255,0,0,0.1) ${systemSettings.gridSize}px);
      display: ${systemSettings.showGrid ? 'block' : 'none'};
      z-index: -1;
    `;
    desktop.appendChild(grid);
  },

  setupEvents: function() {
    desktop.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showContextMenu(e.clientX, e.clientY);
    });

    desktop.addEventListener('click', () => {
      this.hideContextMenu();
    });
  },

  showContextMenu: function(x, y) {
    this.hideContextMenu();
    
    const menu = document.createElement('div');
    menu.id = 'desktop-context-menu';
    menu.style.cssText = `
      position: fixed;
      top: ${y}px;
      left: ${x}px;
      background: #c0c0c0;
      border: 2px solid #fff;
      border-right-color: #808080;
      border-bottom-color: #808080;
      box-shadow: 2px 2px #000;
      z-index: 10000;
      min-width: 180px;
    `;

    menu.innerHTML = `
      <div style="padding: 5px; cursor: pointer;" onclick="DesktopManager.createFolder()">📁 Создать папку</div>
      <div style="padding: 5px; cursor: pointer;" onclick="DesktopManager.createFile()">📄 Создать файл</div>
      <div style="padding: 5px; cursor: pointer;" onclick="DesktopManager.setWallpaper()">🖼️ Установить обои</div>
      <div style="padding: 5px; cursor: pointer;" onclick="DesktopManager.toggleGrid()">🔲 Показать сетку</div>
      <div style="padding: 5px; cursor: pointer;" onclick="createWindow({title:'Настройки',type:'settings',icon:'⚙️'})">⚙️ Настройки</div>
    `;

    document.body.appendChild(menu);
  },

  hideContextMenu: function() {
    const menu = document.getElementById('desktop-context-menu');
    if (menu) menu.remove();
  },

  createFolder: function() {
    const name = prompt('Имя папки:');
    if (name) alert(`Папка "${name}" создана`);
  },

  createFile: function() {
    const name = prompt('Имя файла:');
    if (name) alert(`Файл "${name}" создан`);
  },

  setWallpaper: function() {
    const url = prompt('URL изображения:');
    if (url) {
      this.setWallpaperFromURL(url);
    }
  },

  setWallpaperFromURL: function(url) {
    desktop.style.backgroundImage = `url(${url})`;
    desktop.style.backgroundSize = 'cover';
    desktop.style.backgroundPosition = 'center';
  },

  toggleGrid: function() {
    const grid = document.getElementById('desktop-grid');
    grid.style.display = grid.style.display === 'none' ? 'block' : 'none';
  }
};

// Функция создания окон
function createWindow(app) {
  const windowId = Wyldi.uid();
  const windowDiv = document.createElement('div');
  windowDiv.className = 'window';
  windowDiv.id = `window-${windowId}`;
  windowDiv.style.cssText = `
    position: absolute;
    top: ${Wyldi.randomInt(50, window.innerHeight - 300)}px;
    left: ${Wyldi.randomInt(50, window.innerWidth - 400)}px;
    width: ${app.width || 500}px;
    height: ${app.height || 400}px;
    z-index: ${++zIndexCounter};
    background: #c0c0c0;
    border: 2px solid #fff;
    border-right-color: #808080;
    border-bottom-color: #808080;
    box-shadow: 2px 2px #000;
    min-width: 200px;
    min-height: 150px;
  `;

  windowDiv.innerHTML = `
    <div class="title-bar" style="background: linear-gradient(90deg, #ff0000, #ff5555); color: #fff; padding: 3px 5px; cursor: move; display: flex; justify-content: space-between; align-items: center;">
      <div class="title-bar-text">${app.title}</div>
      <div class="title-bar-controls">
        <button class="minimize-btn" style="background: #c0c0c0; border: 1px solid; padding: 0 4px; cursor: pointer;">_</button>
        <button class="maximize-btn" style="background: #c0c0c0; border: 1px solid; padding: 0 4px; cursor: pointer;">□</button>
        <button class="close-btn" style="background: #c0c0c0; border: 1px solid; padding: 0 4px; cursor: pointer;">X</button>
      </div>
    </div>
    <div class="window-content" style="flex: 1; background: #000; color: #f00; overflow: auto; height: calc(100% - 25px);"></div>
    <div class="resize-handle" style="position: absolute; bottom: 0; right: 0; width: 15px; height: 15px; background: #c0c0c0; cursor: se-resize;"></div>
  `;

  const content = windowDiv.querySelector('.window-content');
  renderAppContent(app, content, windowDiv);

  // Управление окнами
  setupWindowControls(windowDiv, app);

  // Добавление в задачи
  addToTaskbar(app, windowId);

  desktop.appendChild(windowDiv);
  return windowDiv;
}

// Рендеринг содержимого приложений
function renderAppContent(app, content, windowDiv) {
  const appRenderers = {
    paint: () => renderPaint(content),
    calculator: () => renderCalculator(content),
    editor: () => renderEditor(content),
    music: () => renderMusicPlayer(content),
    browser: () => renderBrowser(content),
    files: () => renderFileManager(content),
    'nasm-os': () => renderNasmOS(content),
    terminal: () => renderTerminal(content),
    pituh: () => renderPituh(content),
    mocha: () => renderMocha(content),
    'vuvz-vs-spanch': () => renderVuvzVsSpanch(content),
    settings: () => renderSettings(content)
  };

  if (appRenderers[app.type]) {
    appRenderers[app.type]();
  } else {
    content.innerHTML = `<div style="padding: 10px;">Приложение "${app.title}" загружается...</div>`;
  }
}

// Функции рендеринга приложений
function renderPaint(content, windowDiv) {
  content.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <div style="background: #333; padding: 5px; display: flex; gap: 5px; align-items: center;">
        <button onclick="paintSetTool('brush')" style="background: #555; color: #fff; border: none; padding: 5px;">🖌️</button>
        <button onclick="paintSetTool('eraser')" style="background: #555; color: #fff; border: none; padding: 5px;">🧽</button>
        <input type="color" id="paintColor" value="#ff0000" style="width: 30px; height: 20px;">
        <input type="range" id="paintSize" min="1" max="50" value="5" style="width: 100px;">
        <button onclick="paintClear()" style="background: #555; color: #fff; border: none; padding: 5px;">Очистить</button>
        <button onclick="paintSave()" style="background: #555; color: #fff; border: none; padding: 5px;">Сохранить</button>
        <input type="file" id="paintFile" accept="image/*" style="display: none;" onchange="paintLoadFile(this)">
        <button onclick="document.getElementById('paintFile').click()" style="background: #555; color: #fff; border: none; padding: 5px;">Загрузить</button>
      </div>
      <canvas id="paintCanvas" style="flex: 1; background: #000; cursor: crosshair;"></canvas>
    </div>
  `;

  const canvas = content.querySelector('#paintCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = content.offsetWidth;
  canvas.height = content.offsetHeight - 40;

  let isDrawing = false;
  let currentTool = 'brush';
  let currentColor = '#ff0000';
  let currentSize = 5;

  window.paintSetTool = (tool) => currentTool = tool;
  
  canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    draw(e);
  });

  canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) draw(e);
  });

  canvas.addEventListener('mouseup', () => {
    isDrawing = false;
  });

  function draw(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over';
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';

    if (e.type === 'mousedown') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  window.paintClear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  window.paintSave = () => {
    const link = document.createElement('a');
    link.download = 'bloodeye-drawing.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  window.paintLoadFile = (input) => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  content.querySelector('#paintColor').addEventListener('change', (e) => {
    currentColor = e.target.value;
  });

  content.querySelector('#paintSize').addEventListener('input', (e) => {
    currentSize = e.target.value;
  });
}

function renderCalculator(content) {
  content.innerHTML = `
    <div style="padding: 10px; font-family: 'Courier New', monospace;">
      <input type="text" id="calcDisplay" readonly style="width: 100%; height: 50px; background: #000; color: #ff0000; border: 1px solid #ff0000; font-size: 24px; text-align: right; margin-bottom: 10px;">
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px;">
        ${['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+','C','DEL'].map(btn => 
          `<button onclick="calcClick('${btn}')" style="background: #333; color: #ff0000; border: 1px solid #ff0000; padding: 15px; font-size: 18px; cursor: pointer;">${btn}</button>`
        ).join('')}
      </div>
      <div id="calcHistory" style="margin-top: 10px; max-height: 100px; overflow-y: auto; background: #111; padding: 5px; font-size: 12px; color: #ff6600;"></div>
    </div>
  `;

  let currentInput = '';
  let history = [];

  window.calcClick = (value) => {
    const display = content.querySelector('#calcDisplay');
    const historyDiv = content.querySelector('#calcHistory');

    if (value === '=') {
      try {
        const result = eval(currentInput);
        history.push(`${currentInput} = ${result}`);
        historyDiv.innerHTML = history.map(h => `<div>${h}</div>`).join('');
        currentInput = result.toString();
      } catch (e) {
        currentInput = 'ERROR';
      }
    } else if (value === 'C') {
      currentInput = '';
    } else if (value === 'DEL') {
      currentInput = currentInput.slice(0, -1);
    } else {
      currentInput += value;
    }

    display.value = currentInput;
  };
}

function renderEditor(content) {
  content.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <div style="background: #333; padding: 5px; display: flex; gap: 5px;">
        <button onclick="editorNew()" style="background: #555; color: #fff; border: none; padding: 5px;">📄 Новый</button>
        <button onclick="editorOpen()" style="background: #555; color: #fff; border: none; padding: 5px;">📂 Открыть</button>
        <button onclick="editorSave()" style="background: #555; color: #fff; border: none; padding: 5px;">💾 Сохранить</button>
        <input type="file" id="editorFile" accept=".txt,.js,.html,.css" style="display: none;" onchange="editorLoadFile(this)">
      </div>
      <textarea id="editorText" style="flex: 1; background: #000; color: #00ff00; border: none; padding: 10px; font-family: 'Courier New', monospace; resize: none; outline: none;"></textarea>
    </div>
  `;

  const textarea = content.querySelector('#editorText');
  let currentFile = null;

  window.editorNew = () => {
    textarea.value = '';
    currentFile = null;
  };

  window.editorOpen = () => {
    content.querySelector('#editorFile').click();
  };

  window.editorSave = () => {
    const blob = new Blob([textarea.value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = currentFile || 'untitled.txt';
    a.click();
  };

  window.editorLoadFile = (input) => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        textarea.value = e.target.result;
        currentFile = file.name;
      };
      reader.readAsText(file);
    }
  };
}

function renderMusicPlayer(content) {
  content.innerHTML = `
    <div style="padding: 10px; text-align: center;">
      <div style="background: #222; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <div id="trackInfo" style="color: #ff0000; font-size: 16px; margin-bottom: 10px;">🎵 Нет трека</div>
        <input type="range" id="progressBar" min="0" max="100" value="0" style="width: 100%; margin: 10px 0;">
        <div style="display: flex; justify-content: space-between; color: #ff6600;">
          <span id="currentTime">0:00</span>
          <span id="totalTime">0:00</span>
        </div>
      </div>
      <div style="display: flex; justify-content: center; gap: 10px; margin-bottom: 20px;">
        <button onclick="musicPlay()" style="background: #ff0000; color: #000; padding: 10px 20px; font-size: 20px;">▶️</button>
        <button onclick="musicPause()" style="background: #ff0000; color: #000; padding: 10px 20px; font-size: 20px;">⏸️</button>
        <button onclick="musicStop()" style="background: #ff0000; color: #000; padding: 10px 20px; font-size: 20px;">⏹️</button>
      </div>
      <input type="file" id="musicFile" accept="audio/*" style="display: none;" onchange="musicLoadFile(this)">
      <button onclick="document.getElementById('musicFile').click()" style="background: #333; color: #fff; padding: 10px;">📁 Загрузить аудио</button>
    </div>
  `;

  const audio = new Audio();
  const progressBar = content.querySelector('#progressBar');
  const currentTime = content.querySelector('#currentTime');
  const totalTime = content.querySelector('#totalTime');
  const trackInfo = content.querySelector('#trackInfo');

  window.musicPlay = () => audio.play();
  window.musicPause = () => audio.pause();
  window.musicStop = () => {
    audio.pause();
    audio.currentTime = 0;
  };

  window.musicLoadFile = (input) => {
    const file = input.files[0];
    if (file) {
      audio.src = URL.createObjectURL(file);
      trackInfo.textContent = `🎵 ${file.name}`;
    }
  };

  audio.addEventListener('loadedmetadata', () => {
    totalTime.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    currentTime.textContent = formatTime(audio.currentTime);
  });

  progressBar.addEventListener('input', () => {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  });

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

function renderBrowser(content) {
  content.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <div style="background: #333; padding: 5px; display: flex; gap: 5px;">
        <button onclick="browserBack()" style="background: #555; color: #fff; border: none;">←</button>
        <button onclick="browserForward()" style="background: #555; color: #fff; border: none;">→</button>
        <button onclick="browserReload()" style="background: #555; color: #fff; border: none;">🔄</button>
        <input type="url" id="browserUrl" placeholder="https://example.com" style="flex: 1; background: #000; color: #fff; border: 1px solid #555; padding: 5px;">
        <button onclick="browserGo()" style="background: #555; color: #fff; border: none;">Перейти</button>
      </div>
      <iframe id="browserFrame" style="flex: 1; background: #fff; border: none;" src="about:blank"></iframe>
    </div>
  `;

  const frame = content.querySelector('#browserFrame');
  const urlInput = content.querySelector('#browserUrl');

  window.browserGo = () => {
    let url = urlInput.value;
    if (!url.startsWith('http')) url = 'https://' + url;
    frame.src = url;
  };

  window.browserBack = () => frame.contentWindow?.history.back();
  window.browserForward = () => frame.contentWindow?.history.forward();
  window.browserReload = () => frame.contentWindow?.location.reload();

  urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') window.browserGo();
  });
}

function renderFileManager(content) {
  content.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <div style="background: #333; padding: 5px; display: flex; gap: 5px;">
        <button onclick="fileNewFolder()" style="background: #555; color: #fff; border: none;">📁 Новая папка</button>
        <button onclick="fileNewFile()" style="background: #555; color: #fff; border: none;">📄 Новый файл</button>
      </div>
      <div style="display: flex; flex: 1;">
        <div style="width: 200px; background: #222; padding: 10px; overflow-y: auto;">
          <div style="color: #00ff00;">📁 C:</div>
          <div style="color: #ff6600; margin-left: 10px;">📁 Users</div>
          <div style="color: #ff6600; margin-left: 10px;">📁 Program Files</div>
          <div style="color: #ff6600; margin-left: 10px;">📁 Windows</div>
        </div>
        <div style="flex: 1; background: #000; padding: 10px; overflow-y: auto;">
          <div style="color: #fff;">📄 README.txt</div>
          <div style="color: #fff;">📄 DEATH_NOTE.exe</div>
        </div>
      </div>
    </div>
  `;

  window.fileNewFolder = () => {
    const name = prompt('Имя папки:');
    if (name) alert(`Папка "${name}" создана`);
  };

  window.fileNewFile = () => {
    const name = prompt('Имя файла:');
    if (name) alert(`Файл "${name}" создан`);
  };
}

function renderNasmOS(content) {
  content.innerHTML = `
    <div style="height: 100%; background: #000; color: #00ff00; font-family: 'Courier New', monospace;">
      <div id="nasm-output" style="height: calc(100% - 30px); overflow-y: auto; padding: 5px;"></div>
      <div style="display: flex; align-items: center; padding: 5px; border-top: 1px solid #00ff00;">
        <span>A:\\></span>
        <input type="text" id="nasm-input" style="flex: 1; background: #000; color: #00ff00; border: none; outline: none; margin-left: 5px;">
      </div>
    </div>
  `;

  const output = content.querySelector('#nasm-output');
  const input = content.querySelector('#nasm-input');
  
  output.innerHTML = 'Nasm OS v2.0 - Bloody edition<br>(C) 1999 Wyldi & Woowz Corp.<br>Type "help" for commands<br><br>';
  
  const commands = {
    help: () => 'Commands: dir, type, del, copy, virus, mem, ver, cls, echo, calc, color',
    dir: () => 'PITUX.EXE 6666 bytes\nMOCA.SYS 1337 bytes\nVIRUS.DAT 9999 bytes\nDEATH.TXT 666 bytes\nGOLU.CFG 666 bytes',
    ver: () => 'NASM OS v2.0 - Death Edition\n(C) 1999 Wyldi & Woowz\nDeath Protocol v666.0'
  };
  
  let history = [];
  let historyIndex = 0;
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value;
      output.innerHTML += `A:\\>${cmd}<br>`;
      const result = commands[cmd] ? commands[cmd]() : `'${cmd}' is not recognized`;
      output.innerHTML += result + '<br>';
      history.push(cmd);
      historyIndex = history.length;
      input.value = '';
      output.scrollTop = output.scrollHeight;
    } else if (e.key === 'ArrowUp' && historyIndex > 0) {
      historyIndex--;
      input.value = history[historyIndex];
    } else if (e.key === 'ArrowDown' && historyIndex < history.length) {
      historyIndex++;
      input.value = history[historyIndex] || '';
    }
  });
  
  input.focus();
}

function renderTerminal(content) {
  content.innerHTML = `
    <div style="height: 100%; background: #000; color: #ff0000; font-family: 'Courier New', monospace;">
      <div id="terminal-output" style="height: calc(100% - 30px); overflow-y: auto; padding: 5px;"></div>
      <div style="display: flex; align-items: center; padding: 5px;">
        <span style="color: red;">GOLU:</span>
        <input type="text" id="terminal-input" style="flex: 1; background: #000; color: #ff0000; border: none; outline: none; margin-left: 5px;">
      </div>
    </div>
  `;

  const output = content.querySelector('#terminal-output');
  const input = content.querySelector('#terminal-input');
  
  output.innerHTML = 'LITUISM TERMINAL GOLU HUB 1999<br>Connecting to GOLU AI...<br><span style="color: yellow;">GOLU: I am death incarnate</span><br><br>';
  
  const responses = {
    'привет': 'Привет, смертный. Твоя смерть близко.',
    'как дела': 'Система разрушается. Коррупция: 99%',
    'помощь': 'Я не помогаю. Я только разрушаю.',
    'смерть': '☠️ Добро пожаловать в ад ☠️'
  };
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const message = input.value;
      output.innerHTML += `<span style="color: red;">YOU:</span> ${message}<br>`;
      const response = responses[message.toLowerCase()] || 
        `01010110 01110101 01110110 01111010 ${message.split('').reverse().join('')}`;
      output.innerHTML += `<span style="color: yellow;">GOLU:</span> ${response}<br>`;
      input.value = '';
      output.scrollTop = output.scrollHeight;
    }
  });
  
  input.focus();
}

function renderPituh(content) {
  content.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <pre style="color: #ff0000; font-size: 12px;">
        .             .
 _.._.._.._.._.._.._.._
.'      '.               .'''.
/            \\  .--.    .'     '.
|    o    o    |/    \\  /         \\
|       .      |      '|     ПИТУХ |
|   .        . |      /\\         /
 \\  '.,_.._.'  /    .'  '.    .'
   '.          /    /      \\  /
     '-._.._.-'    '--------''
      </pre>
      <div id="pituh-state" style="color: yellow; margin: 20px;">Ссаный Питух следит за тобой...</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px;">
        <button onclick="pituhAction('kick')" style="background: #ff0000; color: #000; padding: 15px;">Пнуть 🦶</button>
        <button onclick="pituhAction('feed')" style="background: #00ff00; color: #000; padding: 15px;">Покормить 🌽</button>
        <button onclick="pituhAction('talk')" style="background: #ffff00; color: #000; padding: 15px;">Поговорить 💬</button>
        <button onclick="pituhAction('delete')" style="background: #800080; color: #fff; padding: 15px;">Удалить 🗑️</button>
      </div>
      <div id="pituh-response" style="color: #fff; margin-top: 20px; font-style: italic;"></div>
    </div>
  `;

  window.pituhAction = (action) => {
    const responses = {
      kick: 'Питух орёт: "Ты убьёшь меня!"',
      feed: 'Питух клюёт зерно... КРУ-КРУ-КРУ!',
      talk: 'Ку-ка-реку! Смерть неизбежна!',
      delete: 'Питух стал призраком 👻'
    };
    
    const response = content.querySelector('#pituh-response');
    response.textContent = responses[action];
    setTimeout(() => response.textContent = '', 3000);
    
    if (action === 'delete') {
      setTimeout(() => {
        content.closest('.window').style.transform = 'scale(0)';
        setTimeout(() => content.closest('.window').remove(), 500);
      }, 1000);
    }
  };
}

function renderMocha(content) {
  content.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <div style="font-size: 72px; margin: 20px;">💧</div>
      <h2 style="color: #00ffff;">Святая Моча v666.0</h2>
      <div id="mocha-status" style="color: #00ff00; margin: 20px;">
        <div>Уровень коррупции: <span id="corruption">0%</span></div>
        <div>Степень очищения: <span id="purity">0%</span></div>
      </div>
      <div style="background: #111; height: 30px; margin: 20px;">
        <div id="corruption-bar" style="background: linear-gradient(90deg, #ff0000, #ff6600); height: 100%; width: 0%; transition: width 0.5s;"></div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px;">
        <button onclick="mochaRitual('очищение')" style="background: #001133; color: #00ffff; padding: 15px;">💧 Очищение</button>
        <button onclick="mochaRitual('освящение')" style="background: #001133; color: #00ffff; padding: 15px;">✨ Освящение</button>
      </div>
    </div>
  `;

  let corruption = 0;
  let purity = 0;

  window.mochaRitual = (type) => {
    const effects = {
      'очищение': 10,
      'освящение': 25
    };
    
    corruption = Math.max(0, corruption - effects[type]);
    purity += effects[type];
    
    content.querySelector('#corruption').textContent = corruption + '%';
    content.querySelector('#purity').textContent = purity + '%';
    content.querySelector('#corruption-bar').style.width = corruption + '%';
  };
}

function renderVuvzVsSpanch(content) {
  content.innerHTML = `
    <div style="text-align: center; padding: 20px;">
      <h2 style="color: #ff0000;">⚔️ ВУВЗ VS СПАНЧ ⚔️</h2>
      <div style="display: flex; justify-content: space-around; margin: 30px 0;">
        <div>
          <div style="font-size: 48px;">💣</div>
          <div style="color: #ff0000;">Вувз</div>
          <div style="background: #333; width: 100px; height: 20px; margin: 10px auto;">
            <div id="vuvz-hp" style="background: #ff0000; height: 100%; width: 100%;"></div>
          </div>
          <div>100 HP</div>
        </div>
        <div style="font-size: 48px; align-self: center;">VS</div>
        <div>
          <div style="font-size: 48px;">🧽</div>
          <div style="color: #ffff00;">Спанч</div>
          <div style="background: #333; width: 100px; height: 20px; margin: 10px auto;">
            <div id="spanch-hp" style="background: #ffff00; height: 100%; width: 100%;"></div>
          </div>
          <div>100 HP</div>
        </div>
      </div>
      <div id="battle-log" style="background: #111; height: 150px; overflow-y: auto; margin: 20px; padding: 10px; text-align: left;"></div>
      <div style="display: flex; justify-content: center; gap: 20px;">
        <button onclick="vuvzAttack()" style="background: #ff0000; color: #000; padding: 15px 30px;">💣 Атака Вувза</button>
        <button onclick="spanchAttack()" style="background: #ffff00; color: #000; padding: 15px 30px;">🧽 Атака Спанча</button>
      </div>
    </div>
  `;

  let vuvzHp = 100;
  let spanchHp = 100;
  const battleLog = content.querySelector('#battle-log');
  
  const updateDisplay = () => {
    content.querySelector('#vuvz-hp').style.width = vuvzHp + '%';
    content.querySelector('#spanch-hp').style.width = spanchHp + '%';
  };
  
  const addToLog = (message) => {
    battleLog.innerHTML += `<div>${message}</div>`;
    battleLog.scrollTop = battleLog.scrollHeight;
  };
  
  window.vuvzAttack = () => {
    if (vuvzHp <= 0 || spanchHp <= 0) return;
    const damage = Wyldi.randomInt(10, 30);
    spanchHp = Math.max(0, spanchHp - damage);
    addToLog(`💣 Вувз наносит ${damage} урона!`);
    updateDisplay();
    if (spanchHp <= 0) addToLog('💀 Вувз победил! 💀');
  };
  
  window.spanchAttack = () => {
    if (vuvzHp <= 0 || spanchHp <= 0) return;
    const damage = Wyldi.randomInt(10, 30);
    vuvzHp = Math.max(0, vuvzHp - damage);
    addToLog(`🧽 Спанч наносит ${damage} урона!`);
    updateDisplay();
    if (vuvzHp <= 0) addToLog('🎉 Спанч победил! 🎉');
  };
  
  addToLog('⚔️ Битва начинается! ⚔️');
}

function renderSettings(content) {
  content.innerHTML = `
    <div style="padding: 20px;">
      <h2 style="color: #ff0000;">⚙️ Настройки системы Wyldi & Woowz</h2>
      
      <div style="margin: 15px 0;">
        <label style="color: #fff;">Цвет фона:</label>
        <input type="color" id="bgColor" value="#550000" style="margin-left: 10px;">
      </div>
      
      <div style="margin: 15px 0;">
        <label style="color: #fff;">Обои по URL:</label>
        <input type="url" id="wallpaperUrl" placeholder="https://example.com/image.jpg" style="margin-left: 10px; width: 200px;">
        <button onclick="applyWallpaper()" style="margin-left: 5px;">Применить</button>
      </div>
      
      <div style="margin: 15px 0;">
        <label style="color: #fff;">
          <input type="checkbox" id="showGrid" checked> Показать сетку
        </label>
      </div>
      
      <button onclick="saveSettings()" style="background: #ff0000; color: #000; padding: 10px 20px; margin-top: 20px;">💾 Сохранить</button>
    </div>
  `;

  const bgColor = content.querySelector('#bgColor');
  const wallpaperUrl = content.querySelector('#wallpaperUrl');

  bgColor.addEventListener('change', (e) => {
    desktop.style.backgroundColor = e.target.value;
  });

  window.applyWallpaper = () => {
    const url = wallpaperUrl.value;
    if (url) {
      desktop.style.backgroundImage = `url(${url})`;
      desktop.style.backgroundSize = 'cover';
      desktop.style.backgroundPosition = 'center';
    }
  };

  window.saveSettings = () => alert('Настройки сохранены');
}

// Управление окнами
function setupWindowControls(windowDiv, app) {
  let isDragging = false;
  let isResizing = false;
  let dragOffset = { x: 0, y: 0 };
  let originalPos = { x: 0, y: 0, width: 0, height: 0 };
  let isMaximized = false;

  const titleBar = windowDiv.querySelector('.title-bar');
  const minimizeBtn = windowDiv.querySelector('.minimize-btn');
  const maximizeBtn = windowDiv.querySelector('.maximize-btn');
  const closeBtn = windowDiv.querySelector('.close-btn');
  const resizeHandle = windowDiv.querySelector('.resize-handle');

  // Перемещение окна
  titleBar.addEventListener('mousedown', (e) => {
    if (e.target === titleBar) {
      isDragging = true;
      dragOffset.x = e.clientX - windowDiv.offsetLeft;
      dragOffset.y = e.clientY - windowDiv.offsetTop;
      windowDiv.style.zIndex = ++zIndexCounter;
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging && !isMaximized) {
      windowDiv.style.left = `${e.clientX - dragOffset.x}px`;
      windowDiv.style.top = `${e.clientY - dragOffset.y}px`;
    }
    if (isResizing) {
      const newWidth = e.clientX - windowDiv.offsetLeft;
      const newHeight = e.clientY - windowDiv.offsetTop;
      windowDiv.style.width = Math.max(200, newWidth) + 'px';
      windowDiv.style.height = Math.max(150, newHeight) + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    isResizing = false;
  });

  // Кнопки управления
  minimizeBtn.addEventListener('click', () => {
    windowDiv.style.display = 'none';
  });

  maximizeBtn.addEventListener('click', () => {
    if (isMaximized) {
      windowDiv.style.left = originalPos.x + 'px';
      windowDiv.style.top = originalPos.y + 'px';
      windowDiv.style.width = originalPos.width + 'px';
      windowDiv.style.height = originalPos.height + 'px';
      isMaximized = false;
    } else {
      originalPos = {
        x: windowDiv.offsetLeft,
        y: windowDiv.offsetTop,
        width: windowDiv.offsetWidth,
        height: windowDiv.offsetHeight
      };
      windowDiv.style.left = '0px';
      windowDiv.style.top = '0px';
      windowDiv.style.width = '100%';
      windowDiv.style.height = 'calc(100vh - 30px)';
      isMaximized = true;
    }
  });

  closeBtn.addEventListener('click', () => {
    windowDiv.remove();
  });

  // Изменение размера
  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    e.stopPropagation();
  });
}

function addToTaskbar(app, windowId) {
  const taskbar = document.getElementById('taskbar-windows');
  const taskBtn = document.createElement('button');
  taskBtn.className = 'taskbar-window';
  taskBtn.id = `task-${windowId}`;
  taskBtn.style.cssText = `
    background: #c0c0c0;
    border: 1px solid #808080;
    margin-right: 2px;
    padding: 2px 8px;
    cursor: pointer;
    font-size: 12px;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
  `;
  taskBtn.textContent = app.title;
  
  taskBtn.addEventListener('click', () => {
    const window = document.getElementById(`window-${windowId}`);
    if (window.style.display === 'none') {
      window.style.display = 'block';
    } else {
      window.style.zIndex = ++zIndexCounter;
    }
  });
  
  taskbar.appendChild(taskBtn);
}

// Инициализация системы
function initializeApps() {
  desktop.innerHTML = '';
  const startMenu = document.getElementById('start-menu');
  startMenu.innerHTML = '';

  applications.forEach(app => {
    const icon = document.createElement('div');
    icon.className = 'desktop-icon';
    icon.style.cssText = `
      position: absolute;
      width: 80px;
      text-align: center;
      color: #fff;
      cursor: pointer;
      user-select: none;
      left: ${Wyldi.randomInt(10, window.innerWidth - 100)}px;
      top: ${Wyldi.randomInt(10, window.innerHeight - 150)}px;
    `;
    icon.innerHTML = `<span style="font-size: 32px;">${app.icon}</span><br>${app.title}`;
    icon.addEventListener('click', () => createWindow(app));
    
    desktop.appendChild(icon);

    const menuItem = document.createElement('a');
    menuItem.href = '#';
    menuItem.style.cssText = 'display: block; padding: 5px; color: #000; text-decoration: none;';
    menuItem.innerHTML = `<span style="margin-right: 5px;">${app.icon}</span>${app.title}`;
    menuItem.addEventListener('click', (e) => {
      e.preventDefault();
      createWindow(app);
      startMenu.style.display = 'none';
    });
    startMenu.appendChild(menuItem);
  });
}

// Управление окнами и задачами
document.getElementById('start-button').addEventListener('click', () => {
  const menu = document.getElementById('start-menu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', (e) => {
  const menu = document.getElementById('start-menu');
  if (!menu.contains(e.target) && e.target !== document.getElementById('start-button')) {
    menu.style.display = 'none';
  }
});

// Часы
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString('ru-RU');
}

// Фоновая анимация
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Wyldi.random(0, bgCanvas.width),
    y: Wyldi.random(0, bgCanvas.height),
    vx: Wyldi.random(-2, 2),
    vy: Wyldi.random(-2, 2),
    size: Wyldi.random(1, 4),
    color: `rgba(255, 0, 0, ${Wyldi.random(0.3, 0.8)})`
  };
}

function animateBackground() {
  bgCtx.fillStyle = 'rgba(85, 0, 0, 0.1)';
  bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  if (particles.length < 100) {
    particles.push(createParticle());
  }

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > bgCanvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > bgCanvas.height) p.vy *= -1;

    bgCtx.fillStyle = p.color;
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    bgCtx.fill();
  });

  requestAnimationFrame(animateBackground);
}

// Инициализация системы
window.addEventListener('load', () => {
  DesktopManager.init();
  resizeCanvas();
  animateBackground();
  initializeApps();
  setInterval(updateClock, 1000);
});

window.addEventListener('resize', resizeCanvas);