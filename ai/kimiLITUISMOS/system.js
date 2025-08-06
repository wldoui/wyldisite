const Wyldi = {
  random: (min = 0, max = 1) => Math.random() * (max - min) + min,
  randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  randomElement: (arr) => arr[Math.floor(Math.random() * arr.length)],
  clamp: (value, min, max) => Math.min(Math.max(value, min), max),
  lerp: (a, b, t) => a + (b - a) * t
};

// Глобальные переменные системы
let zIndexCounter = 1000;
const desktop = document.getElementById('desktop');
const startMenu = document.getElementById('start-menu');

// Системные настройки
const systemSettings = {
  wallpaper: null,
  wallpaperType: 'color', // color, image, gradient
  wallpaperColor: '#550000',
  iconSize: 80,
  showGrid: true,
  snapToGrid: true,
  gridSize: 20,
  contextMenuEnabled: true,
  desktopLocked: false
};

// Приложения системы
const applications = [
  { id: 'nasm-os', title: 'NASM-OS', icon: '💾', type: 'nasm-os' },
  { id: 'terminal', title: 'Терминал GOLU', icon: '📟', type: 'terminal' },
  { id: 'pituh', title: 'Ссаный Питух', icon: '🗑️', type: 'pituh' },
  { id: 'mocha', title: 'Святая Моча', icon: '💧', type: 'mocha' },
  { id: 'vuvz-vs-spanch', title: 'Вувз vs Спанч', icon: '💣', type: 'vuvz-vs-spanch' },
  { id: 'settings', title: 'Настройки', icon: '⚙️', type: 'settings' },
  { id: 'file-explorer', title: 'Проводник', icon: '📁', type: 'file-explorer' }
];

// Управление рабочим столом
const DesktopManager = {
  elements: [],
  selectedElement: null,
  isDragging: false,
  dragOffset: { x: 0, y: 0 },
  
  init: function() {
    this.createGrid();
    this.setupDesktopEvents();
    this.loadSettings();
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
  
  setupDesktopEvents: function() {
    // Правый клик по рабочему столу
    desktop.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.showContextMenu(e.clientX, e.clientY);
    });
    
    // Левый клик для закрытия контекстного меню
    desktop.addEventListener('click', () => {
      this.hideContextMenu();
    });
    
    // Перетаскивание иконок
    desktop.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('desktop-icon') && !systemSettings.desktopLocked) {
        this.selectElement(e.target);
        this.startDrag(e);
      }
    });
    
    document.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        this.drag(e);
      }
    });
    
    document.addEventListener('mouseup', () => {
      this.stopDrag();
    });
  },
  
  selectElement: function(element) {
    if (this.selectedElement) {
      this.selectedElement.style.border = 'none';
    }
    this.selectedElement = element;
    element.style.border = '2px dashed #ff0000';
  },
  
  startDrag: function(e) {
    this.isDragging = true;
    const rect = this.selectedElement.getBoundingClientRect();
    this.dragOffset.x = e.clientX - rect.left;
    this.dragOffset.y = e.clientY - rect.top;
    this.selectedElement.style.cursor = 'grabbing';
  },
  
  drag: function(e) {
    if (!this.selectedElement || !this.isDragging) return;
    
    let x = e.clientX - this.dragOffset.x;
    let y = e.clientY - this.dragOffset.y;
    
    if (systemSettings.snapToGrid) {
      x = Math.round(x / systemSettings.gridSize) * systemSettings.gridSize;
      y = Math.round(y / systemSettings.gridSize) * systemSettings.gridSize;
    }
    
    x = Wyldi.clamp(x, 0, desktop.clientWidth - this.selectedElement.offsetWidth);
    y = Wyldi.clamp(y, 0, desktop.clientHeight - this.selectedElement.offsetHeight);
    
    this.selectedElement.style.left = x + 'px';
    this.selectedElement.style.top = y + 'px';
    this.selectedElement.style.position = 'absolute';
  },
  
  stopDrag: function() {
    if (this.selectedElement) {
      this.selectedElement.style.cursor = 'pointer';
    }
    this.isDragging = false;
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
      min-width: 150px;
    `;
    
    menu.innerHTML = `
      <div style="padding: 5px; cursor: pointer; border-bottom: 1px solid #808080;" onclick="DesktopManager.setWallpaper()">📷 Установить обои</div>
      <div style="padding: 5px; cursor: pointer; border-bottom: 1px solid #808080;" onclick="DesktopManager.toggleGrid()">🔲 ${systemSettings.showGrid ? 'Скрыть' : 'Показать'} сетку</div>
      <div style="padding: 5px; cursor: pointer; border-bottom: 1px solid #808080;" onclick="DesktopManager.toggleLock()">🔒 ${systemSettings.desktopLocked ? 'Разблокировать' : 'Заблокировать'} рабочий стол</div>
      <div style="padding: 5px; cursor: pointer;" onclick="createWindow({title:'Настройки',type:'settings',icon:'⚙️'})">⚙️ Настройки</div>
    `;
    
    document.body.appendChild(menu);
  },
  
  hideContextMenu: function() {
    const menu = document.getElementById('desktop-context-menu');
    if (menu) menu.remove();
  },
  
  setWallpaper: function() {
    const url = prompt('Введите URL изображения для обоев:');
    if (url) {
      this.setWallpaperFromURL(url);
    }
  },
  
  setWallpaperFromURL: function(url) {
    const img = new Image();
    img.onload = () => {
      desktop.style.backgroundImage = `url(${url})`;
      desktop.style.backgroundSize = 'cover';
      desktop.style.backgroundPosition = 'center';
      systemSettings.wallpaper = url;
      systemSettings.wallpaperType = 'image';
      this.saveSettings();
    };
    img.onerror = () => {
      alert('Не удалось загрузить изображение');
    };
    img.src = url;
  },
  
  setWallpaperColor: function(color) {
    desktop.style.backgroundImage = 'none';
    desktop.style.backgroundColor = color;
    systemSettings.wallpaperColor = color;
    systemSettings.wallpaperType = 'color';
    this.saveSettings();
  },
  
  toggleGrid: function() {
    systemSettings.showGrid = !systemSettings.showGrid;
    const grid = document.getElementById('desktop-grid');
    if (grid) grid.style.display = systemSettings.showGrid ? 'block' : 'none';
    this.saveSettings();
  },
  
  toggleLock: function() {
    systemSettings.desktopLocked = !systemSettings.desktopLocked;
    this.saveSettings();
  },
  
  saveSettings: function() {
    localStorage.setItem('bloodeye-settings', JSON.stringify(systemSettings));
  },
  
  loadSettings: function() {
    const saved = localStorage.getItem('bloodeye-settings');
    if (saved) {
      Object.assign(systemSettings, JSON.parse(saved));
    }
    this.applySettings();
  },
  
  applySettings: function() {
    if (systemSettings.wallpaper) {
      this.setWallpaperFromURL(systemSettings.wallpaper);
    } else {
      this.setWallpaperColor(systemSettings.wallpaperColor);
    }
    
    document.documentElement.style.setProperty('--icon-size', systemSettings.iconSize + 'px');
  }
};

// Улучшенное создание окон
function createWindow(app) {
  const windowDiv = document.createElement('div');
  windowDiv.className = 'window';
  windowDiv.style.top = `${Wyldi.randomInt(50, window.innerHeight - 300)}px`;
  windowDiv.style.left = `${Wyldi.randomInt(50, window.innerWidth - 400)}px`;
  windowDiv.style.width = `${app.width || 400}px`;
  windowDiv.style.height = `${app.height || 300}px`;
  windowDiv.style.zIndex = ++zIndexCounter;
  windowDiv.dataset.windowId = app.id;

  windowDiv.innerHTML = `
    <div class="title-bar">
      <div class="title-bar-text">${app.title}</div>
      <div class="title-bar-controls">
        <button class="minimize-button" aria-label="Minimize">_</button>
        <button class="maximize-button" aria-label="Maximize">□</button>
        <button class="close-button" aria-label="Close">X</button>
      </div>
    </div>
    <div class="content"></div>
  `;

  const contentDiv = windowDiv.querySelector('.content');
  const titleBar = windowDiv.querySelector('.title-bar');
  const closeButton = windowDiv.querySelector('.close-button');
  const minimizeButton = windowDiv.querySelector('.minimize-button');
  const maximizeButton = windowDiv.querySelector('.maximize-button');

  // Обработка перемещения окна
  let isDragging = false;
  let dragOffset = { x: 0, y: 0 };
  let isMaximized = false;
  let originalPos = { x: 0, y: 0, width: 0, height: 0 };

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
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Обработка кнопок управления
  closeButton.addEventListener('click', () => {
    windowDiv.remove();
  });

  minimizeButton.addEventListener('click', () => {
    windowDiv.style.display = windowDiv.style.display === 'none' ? 'block' : 'none';
  });

  maximizeButton.addEventListener('click', () => {
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

  // Обработка изменения размера
  const resizeHandle = document.createElement('div');
  resizeHandle.style.cssText = `
    position: absolute;
    bottom: 0;
    right: 0;
    width: 15px;
    height: 15px;
    background: #c0c0c0;
    cursor: se-resize;
    border-top: 1px solid #fff;
    border-left: 1px solid #fff;
  `;
  windowDiv.appendChild(resizeHandle);

  let isResizing = false;
  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    e.stopPropagation();
  });

  document.addEventListener('mousemove', (e) => {
    if (isResizing) {
      const newWidth = e.clientX - windowDiv.offsetLeft;
      const newHeight = e.clientY - windowDiv.offsetTop;
      windowDiv.style.width = Math.max(300, newWidth) + 'px';
      windowDiv.style.height = Math.max(200, newHeight) + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    isResizing = false;
  });

  // Контент приложений
  switch (app.type) {
    case 'settings':
      contentDiv.innerHTML = `
        <div style="padding: 10px;">
          <h2 style="color: #ff0000;">⚙️ Настройки системы</h2>
          
          <div style="margin: 15px 0;">
            <label style="color: #fff;">Цвет фона:</label>
            <input type="color" id="bgColorPicker" value="${systemSettings.wallpaperColor}" 
                   style="margin-left: 10px;">
          </div>
          
          <div style="margin: 15px 0;">
            <label style="color: #fff;">Обои по URL:</label>
            <input type="url" id="wallpaperUrl" placeholder="http://example.com/image.jpg" 
                   style="margin-left: 10px; width: 200px;">
            <button onclick="DesktopManager.setWallpaperFromURL(document.getElementById('wallpaperUrl').value)" 
                    style="margin-left: 5px;">Применить</button>
          </div>
          
          <div style="margin: 15px 0;">
            <label style="color: #fff;">
              <input type="checkbox" id="showGrid" ${systemSettings.showGrid ? 'checked' : ''}>
              Показать сетку
            </label>
          </div>
          
          <div style="margin: 15px 0;">
            <label style="color: #fff;">
              <input type="checkbox" id="snapToGrid" ${systemSettings.snapToGrid ? 'checked' : ''}>
              Прилипание к сетке
            </label>
          </div>
          
          <div style="margin: 15px 0;">
            <label style="color: #fff;">Размер иконок:</label>
            <input type="range" id="iconSizeSlider" min="40" max="120" value="${systemSettings.iconSize}" 
                   style="margin-left: 10px; width: 150px;">
            <span id="iconSizeValue">${systemSettings.iconSize}px</span>
          </div>
          
          <div style="margin: 15px 0;">
            <label style="color: #fff;">
              <input type="checkbox" id="lockDesktop" ${systemSettings.desktopLocked ? 'checked' : ''}>
              Заблокировать рабочий стол
            </label>
          </div>
          
          <button onclick="DesktopManager.saveSettings()" 
                  style="background: #ff0000; color: #000; padding: 10px; margin-top: 20px;">
            Сохранить настройки
          </button>
        </div>
      `;

      // Обработчики настроек
      const bgColorPicker = contentDiv.querySelector('#bgColorPicker');
      const showGrid = contentDiv.querySelector('#showGrid');
      const snapToGrid = contentDiv.querySelector('#snapToGrid');
      const lockDesktop = contentDiv.querySelector('#lockDesktop');
      const iconSizeSlider = contentDiv.querySelector('#iconSizeSlider');
      const iconSizeValue = contentDiv.querySelector('#iconSizeValue');

      bgColorPicker.addEventListener('change', (e) => {
        DesktopManager.setWallpaperColor(e.target.value);
      });

      showGrid.addEventListener('change', (e) => {
        systemSettings.showGrid = e.target.checked;
        DesktopManager.toggleGrid();
      });

      snapToGrid.addEventListener('change', (e) => {
        systemSettings.snapToGrid = e.target.checked;
      });

      lockDesktop.addEventListener('change', (e) => {
        systemSettings.desktopLocked = e.target.checked;
      });

      iconSizeSlider.addEventListener('input', (e) => {
        systemSettings.iconSize = parseInt(e.target.value);
        iconSizeValue.textContent = systemSettings.iconSize + 'px';
        document.querySelectorAll('.desktop-icon').forEach(icon => {
          icon.style.width = systemSettings.iconSize + 'px';
        });
      });

      break;

    case 'file-explorer':
      contentDiv.innerHTML = `
        <div style="padding: 10px;">
          <h3 style="color: #ff0000;">📁 Проводник</h3>
          <div style="display: flex; gap: 10px; margin: 10px 0;">
            <button onclick="createFolder()" style="background: #333; color: #fff;">📁 Новая папка</button>
            <button onclick="createFile()" style="background: #333; color: #fff;">📄 Новый файл</button>
          </div>
          <div id="file-list" style="margin-top: 20px;">
            <div style="padding: 5px; cursor: pointer;">📁 Система</div>
            <div style="padding: 5px; cursor: pointer;">📁 Пользователи</div>
            <div style="padding: 5px; cursor: pointer;">📄 README.txt</div>
            <div style="padding: 5px; cursor: pointer;">📄 DEATH_NOTE.exe</div>
          </div>
        </div>
      `;
      break;

    default:
      contentDiv.innerHTML = `<div style="padding: 10px;">Приложение "${app.title}" загружается...</div>`;
  }

  desktop.appendChild(windowDiv);
  return windowDiv;
}

// Улучшенная инициализация рабочего стола
function initializeApps() {
  const startMenuDiv = document.getElementById('start-menu');
  startMenuDiv.innerHTML = '';
  desktop.innerHTML = '';

  applications.forEach(app => {
    const iconDiv = document.createElement('div');
    iconDiv.className = 'desktop-icon';
    iconDiv.onclick = () => createWindow(app);
    iconDiv.innerHTML = `
      <span class="icon-img">${app.icon}</span>
      <br>${app.title}
    `;
    iconDiv.style.width = systemSettings.iconSize + 'px';
    desktop.appendChild(iconDiv);

    const startMenuItem = document.createElement('a');
    startMenuItem.href = '#';
    startMenuItem.onclick = (e) => {
      e.preventDefault();
      createWindow(app);
      startMenuDiv.style.display = 'none';
    };
    startMenuItem.innerHTML = `<span class="icon-img" style="margin-right: 5px;">${app.icon}</span>${app.title}`;
    startMenuDiv.appendChild(startMenuItem);
  });
}

// Обработка меню пуск
document.getElementById('start-button').addEventListener('click', () => {
  const sm = document.getElementById('start-menu');
  sm.style.display = sm.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', (e) => {
  const startMenu = document.getElementById('start-menu');
  const startButton = document.getElementById('start-button');
  if (!startMenu.contains(e.target) && e.target !== startButton && startMenu.style.display === 'block') {
    startMenu.style.display = 'none';
  }
});

// Часы
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('ru-RU', { hour12: false });
  document.getElementById('clock').textContent = timeString;
}

// Фоновая анимация
const bgCanvas = document.getElementById('bgCanvas');
const ctx = bgCanvas.getContext('2d');
let particles = [];
const particleCount = 100;

function resizeCanvas() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Wyldi.random(0, bgCanvas.width),
    y: Wyldi.random(0, bgCanvas.height),
    size: Wyldi.random(1, 3),
    speedX: Wyldi.random(-1, 1),
    speedY: Wyldi.random(-1, 1),
    color: `rgba(255, 0, 0, ${Wyldi.random(0.3, 0.7)})`
  };
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(createParticle());
  }
}

function animateBg() {
  ctx.fillStyle = 'rgba(85, 0, 0, 0.1)';
  ctx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0 || p.x > bgCanvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > bgCanvas.height) p.speedY *= -1;

    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(animateBg);
}

// Инициализация системы
window.addEventListener('load', () => {
  DesktopManager.init();
  resizeCanvas();
  initParticles();
  animateBg();
  initializeApps();
  setInterval(updateClock, 1000);
});

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

// Глобальные функции для контекстного меню
window.createFolder = () => alert('Создание папок пока не реализовано');
window.createFile = () => alert('Создание файлов пока не реализовано');