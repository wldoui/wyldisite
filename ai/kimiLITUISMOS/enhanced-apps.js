// Расширенный функционал всех приложений

// NASM-OS - полноценный эмулятор командной строки
const NASM_OS = {
  commands: {
    help: () => `
Доступные команды:
  help     - показать эту справку
  dir      - показать файлы
  type     - показать содержимое файла
  del      - удалить файл
  copy     - скопировать файл
  virus    - запустить вирус
  mem      - показать память
  ver      - версия системы
  cls      - очистить экран
  echo     - вывести текст
  calc     - калькулятор
  color    - изменить цвет
  beep     - издать звук
  matrix   - матричный эффект
`,
    dir: () => `
 Volume in drive A is BLOOD
 Volume Serial Number is 6666-6666

 Directory of A:\\

PITUХ   EXE     6,666 bytes
MOCA    SYS     1,337 bytes
VIRUS   DAT     9,999 bytes
GOLU    CFG       666 bytes
DEATH   COM       666 bytes
        5 file(s)     18,734 bytes
        0 dir(s)   666,666 bytes free
`,
    type: (filename) => {
      const files = {
        'golu.cfg': 'DEATH_PROTOCOL=1\nCORRUPTION=99%\nPITUХ_MODE=activated',
        'virus.dat': '01000101 01011000 01000101 00100000 01010110 01001001 01010010 01010101 01010011',
        'moca.sys': 'Holy water detected\nCorruption level: critical\nPrepare for death'
      };
      return files[filename?.toLowerCase()] || `File not found: ${filename}`;
    },
    del: (filename) => {
      if (filename === 'PITUХ.EXE') {
        return `Access denied. PITUХ is immortal.`;
      }
      return `File ${filename} deleted.`;
    },
    copy: (src, dest) => `Copied ${src} to ${dest}`,
    virus: () => {
      setTimeout(() => window.startVirus(), 1000);
      return 'Virus activated...';
    },
    mem: () => `
Memory statistics:

Total memory: 666 KB
Available:    66 KB
Used:         600 KB
Virus:        333 KB
`,
    ver: () => 'NASM OS v2.0 - Bloody Edition\n(C) 1999 Woowz Corp.\nDeath Protocol v666.0',
    cls: function() {
      this.clear();
      return '';
    },
    echo: (...args) => args.join(' '),
    calc: (expr) => {
      try {
        return eval(expr.replace(/[^0-9+\-*/.]/g, '')).toString();
      } catch {
        return 'Error';
      }
    },
    color: (color) => {
      const colors = {
        red: '#ff0000',
        green: '#00ff00',
        blue: '#0000ff',
        yellow: '#ffff00',
        purple: '#ff00ff',
        cyan: '#00ffff'
      };
      if (colors[color]) {
        document.body.style.color = colors[color];
        return `Color changed to ${color}`;
      }
      return 'Available colors: red, green, blue, yellow, purple, cyan';
    },
    beep: () => {
      const audio = new AudioContext();
      const osc = audio.createOscillator();
      osc.frequency.value = 666;
      osc.connect(audio.destination);
      osc.start();
      osc.stop(audio.currentTime + 0.1);
      return '♪';
    },
    matrix: function() {
      return '🟥🟥🟥 MATRIX MODE ACTIVATED 🟥🟥🟥';
    }
  },
  
  currentPath: 'A:\\>',
  history: [],
  historyIndex: -1,
  
  executeCommand: function(command) {
    const parts = command.trim().split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    if (this.commands[cmd]) {
      return this.commands[cmd](...args);
    }
    return `'${cmd}' is not recognized as an internal or external command,\noperable program or batch file.`;
  }
};

// Терминал GOLU - AI с памятью
const GOLU_AI = {
  memory: [],
  personalities: ['GOLU', 'PITUХ', 'DEATH', 'CORRUPTOR'],
  currentPersonality: 0,
  
  responses: {
    'привет': ['Привет, смертный', '01001000 01100101 01101100 01101100 01101111', 'Ты уже мертв'],
    'как дела': ['Система разрушается', 'Коррупция: 99%', 'Смерть близко'],
    'помощь': ['Я не помогаю, я разрушаю', 'Справка недоступна', 'Все команды ведут к смерти'],
    'питух': ['Ссаный питух активирован', '🗑️ Питух следит за тобой', 'Питух - твоя судьба'],
    'смерть': ['☠️ Добро пожаловать', 'Смерть неизбежна', 'Ты выбрал смерть'],
    'default': ['01010110 01110101 01110110 01111010 00100000 01101001 01110011 00100000 01100011 01101111 01101101 01101001 01101110 01100111', 
                'Система разрушается', 
                'Коррупция увеличивается',
                'Ты уже мертв, просто не знаешь об этом']
  },
  
  processInput: function(input) {
    this.memory.push({ input, timestamp: Date.now() });
    
    const response = Object.keys(this.responses).find(key => 
      input.toLowerCase().includes(key)
    );
    
    const responses = response ? this.responses[response] : this.responses.default;
    return Woowz.randomElement(responses);
  },
  
  switchPersonality: function() {
    this.currentPersonality = (this.currentPersonality + 1) % this.personalities.length;
    return this.personalities[this.currentPersonality];
  }
};

// Ссаный Питух - интерактивная корзина
const PituhApp = {
  clicks: 0,
  state: 'sleeping',
  
  states: {
    sleeping: '💤 Питух спит...',
    angry: '😠 Питух зол!',
    crying: '😭 Питух плачет',
    dead: '💀 Питух мертв',
    ghost: '👻 Питух-призрак'
  },
  
  actions: {
    kick: function() {
      this.clicks++;
      if (this.clicks > 10) {
        this.state = 'dead';
        return 'Ты убил питуха! ☠️';
      }
      this.state = 'angry';
      return 'Питух орёт: "Не трогай меня!"';
    },
    feed: function() {
      if (this.state === 'dead') {
        this.state = 'ghost';
        return 'Питух-призрак не может есть';
      }
      this.state = 'sleeping';
      return 'Питух сыт и спит';
    },
    talk: function() {
      const phrases = [
        'Ку-ка-реку!',
        'Я не просто петух, я ссаный петух!',
        'Удали меня из корзины!',
        'Спаси меня от GOLU!',
        'Смерть неизбежна...'
      ];
      return Woowz.randomElement(phrases);
    },
    delete: function() {
      this.state = 'ghost';
      return 'Питух стал призраком 👻';
    }
  }
};

// Святая Моча - очищающая система
const MochaApp = {
  purity: 0,
  corruption: 0,
  
  rituals: [
    { name: 'Очищение', effect: -20, emoji: '💧' },
    { name: 'Освящение', effect: -40, emoji: '✨' },
    { name: 'Отпевание', effect: -60, emoji: '⛪' },
    { name: 'Крещение', effect: -30, emoji: '🕊️' }
  ],
  
  performRitual: function(ritual) {
    this.purity += Math.abs(ritual.effect);
    this.corruption -= ritual.effect;
    
    if (this.corruption <= 0) {
      return `${ritual.emoji} Система очищена! Но это временно...`;
    }
    
    return `${ritual.emoji} ${ritual.name} выполнено. Коррупция: ${this.corruption}%`;
  },
  
  getStatus: function() {
    const status = this.corruption > 50 ? 'Критическая' : 
                   this.corruption > 25 ? 'Высокая' : 
                   this.corruption > 0 ? 'Низкая' : 'Отсутствует';
    
    return `
Статус коррупции: ${status}
Степень очищения: ${this.purity}%
Ритуалов выполнено: ${this.purity / 20}
    `.trim();
  }
};

// Вувз vs Спанч - игра
const VuvzVsSpanch = {
  gameState: {
    vuvzHealth: 100,
    spanchHealth: 100,
    round: 1,
    attacks: {
      vuvz: ['💣 Взрыв', '🔥 Огонь', '⚡ Молния', '🩸 Кровь'],
      spanch: ['🧽 Губка', '🌊 Вода', '😄 Смех', '🍍 Ананас']
    }
  },
  
  attack: function(attacker) {
    const damage = Woowz.randomInt(10, 30);
    
    if (attacker === 'vuvz') {
      this.gameState.spanchHealth -= damage;
      const attack = Woowz.randomElement(this.gameState.attacks.vuvz);
      return `${attack} -${damage} HP Спанчу`;
    } else {
      this.gameState.vuvzHealth -= damage;
      const attack = Woowz.randomElement(this.gameState.attacks.spanch);
      return `${attack} -${damage} HP Вувзу`;
    }
  },
  
  getBattleStatus: function() {
    return `
Раунд: ${this.gameState.round}
Вувз: ${this.gameState.vuvzHealth}/100 HP
Спанч: ${this.gameState.spanchHealth}/100 HP
    
    ${this.gameState.vuvzHealth <= 0 ? 'Спанч победил!' : 
      this.gameState.spanchHealth <= 0 ? 'Вувз победил!' : 
      'Битва продолжается...'}
    `.trim();
  },
  
  nextRound: function() {
    this.gameState.round++;
    if (this.gameState.vuvzHealth <= 0 || this.gameState.spanchHealth <= 0) {
      this.resetGame();
      return 'Новая битва началась!';
    }
    return `Раунд ${this.gameState.round}`;
  },
  
  resetGame: function() {
    this.gameState.vuvzHealth = 100;
    this.gameState.spanchHealth = 100;
    this.gameState.round = 1;
  }
};

// Обновленная логика приложений
document.addEventListener('DOMContentLoaded', () => {
  // Переопределяем обработчики приложений
  const originalCreateWindow = createWindow;
  
  createWindow = function(app) {
    if (app.type === 'nasm-os') {
      const windowDiv = document.createElement('div');
      windowDiv.className = 'window';
      windowDiv.style.top = `${Woowz.randomInt(50, window.innerHeight - 300)}px`;
      windowDiv.style.left = `${Woowz.randomInt(50, window.innerWidth - 400)}px`;
      windowDiv.style.width = `600px`;
      windowDiv.style.height = `400px`;
      windowDiv.style.zIndex = ++zIndexCounter;

      windowDiv.innerHTML = `
        <div class="title-bar">
          <div class="title-bar-text">NASM-OS</div>
          <div class="title-bar-controls">
            <button class="close-button" aria-label="Close">X</button>
          </div>
        </div>
        <div class="content" style="background: #000; color: #00ff00; font-family: 'Courier New', monospace;">
          <div id="nasm-output" style="height: 330px; overflow-y: auto;"></div>
          <div style="display: flex;">
            <span style="color: #00ff00;">A:\\></span>
            <input type="text" id="nasm-input" style="flex: 1; background: #000; color: #00ff00; border: none; outline: none;">
          </div>
        </div>
      `;

      desktop.appendChild(windowDiv);
      
      const output = windowDiv.querySelector('#nasm-output');
      const input = windowDiv.querySelector('#nasm-input');
      
      output.innerHTML = 'Nasm OS v2.0 - Bloody edition<br>(C) 1999 Woowz Corp.<br>Type "help" to get a list of commands.<br><br>';
      
      input.focus();
      
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const command = input.value;
          output.innerHTML += `A:\\>${command}<br>`;
          
          const result = NASM_OS.executeCommand(command);
          if (result) {
            output.innerHTML += result + '<br>';
          }
          
          NASM_OS.history.push(command);
          NASM_OS.historyIndex = NASM_OS.history.length;
          input.value = '';
          output.scrollTop = output.scrollHeight;
        }
      });
      
      // Стрелки для истории
      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
          if (NASM_OS.historyIndex > 0) {
            NASM_OS.historyIndex--;
            input.value = NASM_OS.history[NASM_OS.historyIndex];
          }
        } else if (e.key === 'ArrowDown') {
          if (NASM_OS.historyIndex < NASM_OS.history.length - 1) {
            NASM_OS.historyIndex++;
            input.value = NASM_OS.history[NASM_OS.historyIndex];
          } else {
            NASM_OS.historyIndex = NASM_OS.history.length;
            input.value = '';
          }
        }
      });
      
    } else if (app.type === 'terminal') {
      const windowDiv = document.createElement('div');
      windowDiv.className = 'window';
      windowDiv.style.top = `${Woowz.randomInt(50, window.innerHeight - 300)}px`;
      windowDiv.style.left = `${Woowz.randomInt(50, window.innerWidth - 400)}px`;
      windowDiv.style.width = `500px`;
      windowDiv.style.height = `400px`;
      windowDiv.style.zIndex = ++zIndexCounter;

      windowDiv.innerHTML = `
        <div class="title-bar">
          <div class="title-bar-text">Терминал GOLU</div>
          <div class="title-bar-controls">
            <button class="close-button" aria-label="Close">X</button>
          </div>
        </div>
        <div class="content" style="background: #000;">
          <div id="golu-output" class="content-terminal"></div>
          <div style="display: flex; align-items: center;">
            <span style="color: red;">GOLU:</span>
            <input type="text" id="golu-input" style="flex: 1; background: #000; color: red; border: none; outline: none;">
            <button onclick="switchPersonality()" style="background: #333; color: red; border: 1px solid red; margin-left: 5px;">👤</button>
          </div>
        </div>
      `;

      desktop.appendChild(windowDiv);
      
      const output = windowDiv.querySelector('#golu-output');
      const input = windowDiv.querySelector('#golu-input');
      
      output.innerHTML = `
LITUISM TERMINAL GOLU HUB 1999
Connecting to GOLU AI...
<span style="color: yellow;">GOLU: 01010110 01110101 01110110 01111010 00100000 01101001 01110011 00100000 01100001 00100000 01110000 01101001 01110100 01110101 01101000</span>
<span style="color: red;">GOLU: Я - искусственный интеллект смерти. Спроси меня что-нибудь.</span>
      `;
      
      input.focus();
      
      window.switchPersonality = function() {
        const personality = GOLU_AI.switchPersonality();
        output.innerHTML += `<br><span style="color: purple;">SYSTEM: Персонаж изменен на ${personality}</span>`;
      };
      
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const userInput = input.value;
          if (userInput.trim()) {
            output.innerHTML += `<br><span style="color: red;">YOU: ${userInput}</span>`;
            const response = GOLU_AI.processInput(userInput);
            output.innerHTML += `<br><span style="color: yellow;">${GOLU_AI.personalities[GOLU_AI.currentPersonality]}: ${response}</span>`;
            input.value = '';
            output.scrollTop = output.scrollHeight;
          }
        }
      });
      
    } else if (app.type === 'pituh') {
      const windowDiv = document.createElement('div');
      windowDiv.className = 'window';
      windowDiv.style.top = `${Woowz.randomInt(50, window.innerHeight - 300)}px`;
      windowDiv.style.left = `${Woowz.randomInt(50, window.innerWidth - 400)}px`;
      windowDiv.style.width = `400px`;
      windowDiv.style.height = `500px`;
      windowDiv.style.zIndex = ++zIndexCounter;

      windowDiv.innerHTML = `
        <div class="title-bar">
          <div class="title-bar-text">Ссаный Питух</div>
          <div class="title-bar-controls">
            <button class="close-button" aria-label="Close">X</button>
          </div>
        </div>
        <div class="content" style="background: #000; text-align: center;">
          <pre style="font-size: 12px;">
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
          <div id="pituh-state" style="color: yellow; margin: 10px;">${PituhApp.states[PituhApp.state]}</div>
          <div id="pituh-clicks" style="color: red; margin: 10px;">Кликов: ${PituhApp.clicks}</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 20px;">
            <button onclick="kickPituh()" style="background: #ff0000; color: #000; padding: 10px;">Пнуть 🦶</button>
            <button onclick="feedPituh()" style="background: #00ff00; color: #000; padding: 10px;">Покормить 🌽</button>
            <button onclick="talkPituh()" style="background: #ffff00; color: #000; padding: 10px;">Поговорить 💬</button>
            <button onclick="deletePituh()" style="background: #800080; color: #fff; padding: 10px;">Удалить 🗑️</button>
          </div>
          <div id="pituh-response" style="color: #fff; margin: 10px; font-style: italic;"></div>
        </div>
      `;

      desktop.appendChild(windowDiv);
      
      const showResponse = (text) => {
        const responseDiv = windowDiv.querySelector('#pituh-response');
        responseDiv.textContent = text;
        setTimeout(() => responseDiv.textContent = '', 3000);
      };
      
      const updateDisplay = () => {
        windowDiv.querySelector('#pituh-state').textContent = PituhApp.states[PituhApp.state];
        windowDiv.querySelector('#pituh-clicks').textContent = `Кликов: ${PituhApp.clicks}`;
      };
      
      window.kickPituh = () => {
        const result = PituhApp.actions.kick();
        showResponse(result);
        updateDisplay();
      };
      
      window.feedPituh = () => {
        const result = PituhApp.actions.feed();
        showResponse(result);
        updateDisplay();
      };
      
      window.talkPituh = () => {
        const result = PituhApp.actions.talk();
        showResponse(result);
      };
      
      window.deletePituh = () => {
        const result = PituhApp.actions.delete();
        showResponse(result);
        updateDisplay();
        
        // Эффект удаления
        setTimeout(() => {
          windowDiv.style.transform = 'scale(0)';
          setTimeout(() => windowDiv.remove(), 500);
        }, 1000);
      };
      
    } else if (app.type === 'mocha') {
      const windowDiv = document.createElement('div');
      windowDiv.className = 'window';
      windowDiv.style.top = `${Woowz.randomInt(50, window.innerHeight - 300)}px`;
      windowDiv.style.left = `${Woowz.randomInt(50, window.innerWidth - 400)}px`;
      windowDiv.style.width = `400px`;
      windowDiv.style.height = `500px`;
      windowDiv.style.zIndex = ++zIndexCounter;

      windowDiv.innerHTML = `
        <div class="title-bar">
          <div class="title-bar-text">Святая Моча</div>
          <div class="title-bar-controls">
            <button class="close-button" aria-label="Close">X</button>
          </div>
        </div>
        <div class="content" style="background: #000; text-align: center;">
          <div style="font-size: 48px; margin: 20px;">💧</div>
          <div id="mocha-status" style="color: #00ff00; margin: 20px; white-space: pre-wrap;"></div>
          <div style="display: flex; flex-direction: column; gap: 10px; margin: 20px;">
            ${MochaApp.rituals.map((ritual, index) => 
              `<button onclick="performRitual(${index})" style="background: #001133; color: #00ffff; padding: 15px; border: 1px solid #00ffff;">
                ${ritual.emoji} ${ritual.name}
              </button>`
            ).join('')}
          </div>
          <div style="margin: 20px;">
            <div style="background: #111; height: 20px; border: 1px solid #00ff00;">
              <div id="corruption-bar" style="background: #ff0000; height: 100%; width: ${MochaApp.corruption}%; transition: width 0.5s;"></div>
            </div>
            <div style="color: #ff0000; margin-top: 5px;">Уровень коррупции: <span id="corruption-text">${MochaApp.corruption}%</span></div>
          </div>
        </div>
      `;

      desktop.appendChild(windowDiv);
      
      const updateMochaDisplay = () => {
        windowDiv.querySelector('#mocha-status').textContent = MochaApp.getStatus();
        windowDiv.querySelector('#corruption-bar').style.width = `${MochaApp.corruption}%`;
        windowDiv.querySelector('#corruption-text').textContent = `${MochaApp.corruption}%`;
        
        // Визуальные эффекты в зависимости от коррупции
        if (MochaApp.corruption > 75) {
          windowDiv.style.animation = 'glitch 0.1s infinite';
        } else if (MochaApp.corruption > 50) {
          windowDiv.style.filter = 'hue-rotate(90deg)';
        }
      };
      
      window.performRitual = (index) => {
        const ritual = MochaApp.rituals[index];
        const result = MochaApp.performRitual(ritual);
        
        // Визуальный эффект ритуала
        const effect = document.createElement('div');
        effect.style.position = 'fixed';
        effect.style.top = '50%';
        effect.style.left = '50%';
        effect.style.transform = 'translate(-50%, -50%)';
        effect.style.fontSize = '72px';
        effect.style.zIndex = '10000';
        effect.style.animation = 'fadeOut 2s';
        effect.textContent = ritual.emoji;
        document.body.appendChild(effect);
        
        setTimeout(() => effect.remove(), 2000);
        
        updateMochaDisplay();
        
        // Системное уведомление
        BloodeyeAPI.notify(result, 'info');
      };
      
      updateMochaDisplay();
      
    } else if (app.type === 'vuvz-vs-spanch') {
      const windowDiv = document.createElement('div');
      windowDiv.className = 'window';
      windowDiv.style.top = `${Woowz.randomInt(50, window.innerHeight - 300)}px`;
      windowDiv.style.left = `${Woowz.randomInt(50, window.innerWidth - 400)}px`;
      windowDiv.style.width = `500px`;
      windowDiv.style.height = `400px`;
      windowDiv.style.zIndex = ++zIndexCounter;

      windowDiv.innerHTML = `
        <div class="title-bar">
          <div class="title-bar-text">Вувз vs Спанч</div>
          <div class="title-bar-controls">
            <button class="close-button" aria-label="Close">X</button>
          </div>
        </div>
        <div class="content" style="background: #000; text-align: center;">
          <div style="display: flex; justify-content: space-around; margin: 20px;">
            <div>
              <div style="font-size: 48px;">💣</div>
              <div style="color: #ff0000;">Вувз</div>
              <div style="color: #ff0000;">HP: <span id="vuvz-hp">${VuvzVsSpanch.gameState.vuvzHealth}</span>/100</div>
              <div style="background: #333; width: 100px; height: 10px; margin: 5px auto;">
                <div id="vuvz-bar" style="background: #ff0000; height: 100%; width: ${VuvzVsSpanch.gameState.vuvzHealth}%; transition: width 0.3s;"></div>
              </div>
            </div>
            <div style="font-size: 48px;">VS</div>
            <div>
              <div style="font-size: 48px;">🧽</div>
              <div style="color: #ffff00;">Спанч</div>
              <div style="color: #ffff00;">HP: <span id="spanch-hp">${VuvzVsSpanch.gameState.spanchHealth}</span>/100</div>
              <div style="background: #333; width: 100px; height: 10px; margin: 5px auto;">
                <div id="spanch-bar" style="background: #ffff00; height: 100%; width: ${VuvzVsSpanch.gameState.spanchHealth}%; transition: width 0.3s;"></div>
              </div>
            </div>
          </div>
          <div id="battle-log" style="background: #111; height: 150px; overflow-y: auto; margin: 20px; padding: 10px; text-align: left; font-size: 12px;"></div>
          <div style="display: flex; justify-content: space-around; margin: 20px;">
            <button onclick="vuvzAttack()" style="background: #ff0000; color: #000; padding: 10px 20px;">Атака Вувза ⚔️</button>
            <button onclick="spanchAttack()" style="background: #ffff00; color: #000; padding: 10px 20px;">Атака Спанча ⚔️</button>
            <button onclick="nextBattleRound()" style="background: #00ff00; color: #000; padding: 10px 20px;">Следующий раунд ⏭️</button>
          </div>
          <div id="battle-result" style="color: #fff; font-weight: bold; margin: 10px;"></div>
        </div>
      `;

      desktop.appendChild(windowDiv);
      
      const addToLog = (message) => {
        const log = windowDiv.querySelector('#battle-log');
        log.innerHTML += `<div>${message}</div>`;
        log.scrollTop = log.scrollHeight;
      };
      
      const updateDisplay = () => {
        windowDiv.querySelector('#vuvz-hp').textContent = VuvzVsSpanch.gameState.vuvzHealth;
        windowDiv.querySelector('#spanch-hp').textContent = VuvzVsSpanch.gameState.spanchHealth;
        windowDiv.querySelector('#vuvz-bar').style.width = `${Math.max(0, VuvzVsSpanch.gameState.vuvzHealth)}%`;
        windowDiv.querySelector('#spanch-bar').style.width = `${Math.max(0, VuvzVsSpanch.gameState.spanchHealth)}%`;
        windowDiv.querySelector('#battle-result').textContent = VuvzVsSpanch.getBattleStatus();
      };
      
      window.vuvzAttack = () => {
        if (VuvzVsSpanch.gameState.vuvzHealth <= 0 || VuvzVsSpanch.gameState.spanchHealth <= 0) {
          addToLog('Битва окончена!');
          return;
        }
        
        const result = VuvzVsSpanch.attack('vuvz');
        addToLog(`Раунд ${VuvzVsSpanch.gameState.round}: ${result}`);
        updateDisplay();
        
        // Визуальный эффект
        windowDiv.querySelector('#spanch-hp').parentElement.style.animation = 'shake 0.5s';
        setTimeout(() => {
          windowDiv.querySelector('#spanch-hp').parentElement.style.animation = '';
        }, 500);
      };
      
      window.spanchAttack = () => {
        if (VuvzVsSpanch.gameState.vuvzHealth <= 0 || VuvzVsSpanch.gameState.spanchHealth <= 0) {
          addToLog('Битва окончена!');
          return;
        }
        
        const result = VuvzVsSpanch.attack('spanch');
        addToLog(`Раунд ${VuvzVsSpanch.gameState.round}: ${result}`);
        updateDisplay();
        
        // Визуальный эффект
        windowDiv.querySelector('#vuvz-hp').parentElement.style.animation = 'shake 0.5s';
        setTimeout(() => {
          windowDiv.querySelector('#vuvz-hp').parentElement.style.animation = '';
        }, 500);
      };
      
      window.nextBattleRound = () => {
        const result = VuvzVsSpanch.nextRound();
        addToLog(result);
        updateDisplay();
        
        if (VuvzVsSpanch.gameState.vuvzHealth <= 0 || VuvzVsSpanch.gameState.spanchHealth <= 0) {
          addToLog('🎉 Победа! 🎉');
        }
      };
      
      updateDisplay();
      
    } else {
      // Для других приложений используем оригинальную функцию
      originalCreateWindow(app);
    }
  };
  
  // Добавляем CSS анимации
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(2); }
    }
  `;
  document.head.appendChild(style);
});