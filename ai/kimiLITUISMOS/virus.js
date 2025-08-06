class VirusSimulator {
  constructor() {
    this.isActive = false;
    this.glitchIntensity = 0;
    this.audioContext = null;
    this.corruptionLevel = 0;
  }

  async initAudio() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Audio not supported');
    }
  }

  playGlitchSound() {
    if (!this.audioContext) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(
      Woowz.random(100, 2000), 
      this.audioContext.currentTime
    );
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  applyGlitchEffect() {
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      if (Math.random() < this.glitchIntensity) {
        el.classList.add('glitch-effect');
        setTimeout(() => el.classList.remove('glitch-effect'), 100);
      }
    });
  }

  corruptSystem() {
    this.corruptionLevel += 2;
    
    // Изменение цветов
    if (Math.random() < 0.3) {
      document.body.style.filter = `hue-rotate(${Woowz.random(0, 360)}deg) saturate(${Woowz.random(1, 5)})`;
    }
    
    // Рандомное перемещение окон
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
      if (Math.random() < 0.1) {
        win.style.left = `${Woowz.random(0, window.innerWidth - 400)}px`;
        win.style.top = `${Woowz.random(0, window.innerHeight - 300)}px`;
        win.style.transform = `rotate(${Woowz.random(-10, 10)}deg)`;
      }
    });
    
    // Случайные надписи
    if (Math.random() < 0.2) {
      const deathText = document.createElement('div');
      deathText.style.position = 'fixed';
      deathText.style.top = `${Woowz.random(0, window.innerHeight)}px`;
      deathText.style.left = `${Woowz.random(0, window.innerWidth)}px`;
      deathText.style.color = '#ff0000';
      deathText.style.fontSize = '24px';
      deathText.style.fontFamily = 'monospace';
      deathText.style.zIndex = '10000';
      deathText.textContent = ['DEATH', 'CORRUPTED', 'GOLU', 'PITUХ', '⚠️'][Woowz.randomInt(0, 4)];
      deathText.style.animation = 'glitch 0.1s infinite';
      document.body.appendChild(deathText);
      
      setTimeout(() => deathText.remove(), 2000);
    }
    
    if (this.corruptionLevel >= 100) {
      this.showDeathScreen();
    }
  }

  showDeathScreen() {
    const deathScreen = document.getElementById('deathScreen');
    deathScreen.style.display = 'flex';
    
    // Разные сообщения смерти
    const messages = [
      'SYSTEM CORRUPTED',
      'GOLU DEATH PROTOCOL',
      'PITUХ DESTROYED YOUR PC',
      'YOU ARE DEAD',
      '☠️ DEATH ☠️'
    ];
    
    let messageIndex = 0;
    const messageInterval = setInterval(() => {
      deathScreen.textContent = messages[messageIndex % messages.length];
      messageIndex++;
    }, 500);
    
    // Сброс через 10 секунд
    setTimeout(() => {
      clearInterval(messageInterval);
      this.resetSystem();
    }, 10000);
  }

  resetSystem() {
    this.isActive = false;
    this.glitchIntensity = 0;
    this.corruptionLevel = 0;
    document.body.style.filter = '';
    document.getElementById('deathScreen').style.display = 'none';
    
    // Удаление всех окон
    document.querySelectorAll('.window').forEach(win => win.remove());
    initializeApps();
  }

  start() {
    this.isActive = true;
    this.initAudio();
    
    const virusInterval = setInterval(() => {
      if (!this.isActive) {
        clearInterval(virusInterval);
        return;
      }
      
      this.glitchIntensity = Math.min(this.corruptionLevel / 100, 0.8);
      this.playGlitchSound();
      this.applyGlitchEffect();
      this.corruptSystem();
    }, 500);
  }
}

// Глобальная функция для запуска вируса
window.startVirus = () => {
  if (window.virus) window.virus.resetSystem();
  window.virus = new VirusSimulator();
  window.virus.start();
};