// Bloodeye System API
window.BloodeyeAPI = {
  // Создание нового приложения
  createApp: function(config) {
    const app = {
      id: config.id || `app-${Date.now()}`,
      title: config.title || 'Untitled App',
      icon: config.icon || '📱',
      type: config.type || 'custom',
      
      // Методы приложения
      init: config.init || function() {},
      render: config.render || function() { return '<div>Empty App</div>'; },
      update: config.update || function() {},
      destroy: config.destroy || function() {},
      
      // Системные методы
      createWindow: function() {
        const windowDiv = document.createElement('div');
        windowDiv.className = 'window';
        windowDiv.style.top = `${Woowz.randomInt(50, window.innerHeight - 300)}px`;
        windowDiv.style.left = `${Woowz.randomInt(50, window.innerWidth - 400)}px`;
        windowDiv.style.width = `${config.width || 400}px`;
        windowDiv.style.height = `${config.height || 300}px`;
        windowDiv.style.zIndex = ++zIndexCounter;

        windowDiv.innerHTML = `
          <div class="title-bar">
            <div class="title-bar-text">${this.title}</div>
            <div class="title-bar-controls">
              <button class="close-button" aria-label="Close">X</button>
              <button class="minimize-button" aria-label="Minimize">_</button>
              <button class="maximize-button" aria-label="Maximize">□</button>
            </div>
          </div>
          <div class="content"></div>
        `;

        const contentDiv = windowDiv.querySelector('.content');
        contentDiv.innerHTML = this.render();
        
        // Добавление обработчиков событий
        const titleBar = windowDiv.querySelector('.title-bar');
        titleBar.addEventListener('mousedown', (e) => {
          const offsetX = e.clientX - windowDiv.offsetLeft;
          const offsetY = e.clientY - windowDiv.offsetTop;
          windowDiv.style.zIndex = ++zIndexCounter;

          function moveWindow(e) {
            windowDiv.style.left = `${e.clientX - offsetX}px`;
            windowDiv.style.top = `${e.clientY - offsetY}px`;
          }

          function stopMove() {
            window.removeEventListener('mousemove', moveWindow);
            window.removeEventListener('mouseup', stopMove);
          }

          window.addEventListener('mousemove', moveWindow);
          window.addEventListener('mouseup', stopMove);
        });

        const closeButton = windowDiv.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
          this.destroy();
          windowDiv.remove();
        });

        desktop.appendChild(windowDiv);
        this.init(contentDiv);
        
        return windowDiv;
      },
      
      // Утилиты
      log: function(message) {
        console.log(`[${this.title}] ${message}`);
      },
      
      alert: function(message) {
        const alertDiv = document.createElement('div');
        alertDiv.style.position = 'fixed';
        alertDiv.style.top = '50%';
        alertDiv.style.left = '50%';
        alertDiv.style.transform = 'translate(-50%, -50%)';
        alertDiv.style.background = '#000';
        alertDiv.style.color = '#ff0000';
        alertDiv.style.padding = '20px';
        alertDiv.style.border = '2px solid #ff0000';
        alertDiv.style.zIndex = '10000';
        alertDiv.innerHTML = `
          <h3>${this.title}</h3>
          <p>${message}</p>
          <button onclick="this.parentElement.remove()">OK</button>
        `;
        document.body.appendChild(alertDiv);
      }
    };
    
    // Добавление в список приложений
    applications.push(app);
    initializeApps();
    
    return app;
  },
  
  // Создание простого текстового редактора
  createTextEditor: function() {
    return this.createApp({
      id: 'text-editor',
      title: 'Bloodeye Editor',
      icon: '📝',
      width: 600,
      height: 400,
      
      render: function() {
        return `
          <div style="height: 100%; display: flex; flex-direction: column;">
            <div style="background: #333; padding: 5px;">
              <button onclick="saveText()">Save</button>
              <button onclick="loadText()">Load</button>
            </div>
            <textarea id="editor" style="flex: 1; background: #000; color: #ff0000; border: none; padding: 10px; font-family: monospace;"></textarea>
          </div>
        `;
      },
      
      init: function(content) {
        const textarea = content.querySelector('#editor');
        textarea.value = 'Welcome to Bloodeye Editor!\nType your death notes here...';
      }
    });
  },
  
  // Создание калькулятора
  createCalculator: function() {
    return this.createApp({
      id: 'calculator',
      title: 'Death Calculator',
      icon: '🧮',
      width: 300,
      height: 400,
      
      render: function() {
        return `
          <div style="padding: 10px;">
            <input type="text" id="calc-display" style="width: 100%; background: #000; color: #ff0000; border: 1px solid #ff0000; padding: 10px; font-size: 20px; text-align: right;" readonly>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-top: 10px;">
              ${['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+'].map(btn => 
                `<button onclick="calcClick('${btn}')" style="background: #333; color: #ff0000; border: 1px solid #ff0000; padding: 15px; font-size: 18px;">${btn}</button>`
              ).join('')}
              <button onclick="calcClear()" style="grid-column: span 4; background: #ff0000; color: #000;">CLEAR</button>
            </div>
          </div>
        `;
      },
      
      init: function(content) {
        window.calcValue = '';
        window.calcDisplay = content.querySelector('#calc-display');
        window.calcDisplay.value = '0';
        
        window.calcClick = function(val) {
          if (val === '=') {
            try {
              window.calcValue = eval(window.calcValue).toString();
            } catch (e) {
              window.calcValue = 'ERROR';
            }
          } else {
            window.calcValue += val;
          }
          window.calcDisplay.value = window.calcValue || '0';
        };
        
        window.calcClear = function() {
          window.calcValue = '';
          window.calcDisplay.value = '0';
        };
      }
    });
  },
  
  // Системная информация
  getSystemInfo: function() {
    return {
      os: 'Bloodeye System LITUISM RED EDITION',
      version: '666.0',
      user: 'GOLU',
      memory: navigator.deviceMemory || 'unknown',
      cores: navigator.hardwareConcurrency || 'unknown',
      virusLevel: window.virus ? window.virus.corruptionLevel : 0
    };
  },
  
  // Создание системных уведомлений
  notify: function(message, type = 'info') {
    const colors = {
      info: '#00ff00',
      warning: '#ffff00',
      error: '#ff0000'
    };
    
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.background = '#000';
    notification.style.color = colors[type];
    notification.style.padding = '15px';
    notification.style.border = `2px solid ${colors[type]}`;
    notification.style.zIndex = '10000';
    notification.style.animation = 'slideIn 0.3s';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
};

// Добавление CSS анимаций
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
  }
`;
document.head.appendChild(style);

// Примеры использования API
window.addEventListener('load', () => {
  // Создание дополнительных приложений через API
  BloodeyeAPI.createTextEditor();
  BloodeyeAPI.createCalculator();
  
  // Системное уведомление
  setTimeout(() => {
    BloodeyeAPI.notify('Bloodeye System загружен', 'info');
  }, 1000);
});