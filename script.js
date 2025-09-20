class BarbecueTimer {
    constructor() {
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.originalTime = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.timerInterval = null;
        this.alarmAudio = null;
        this.alarmInterval = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.createAlarmSound();
    }
    
    initializeElements() {
        this.elements = {
            originalTime: document.getElementById('originalTime'),
            countdown: document.getElementById('countdown'),
            quickTimers: document.getElementById('quickTimers'),
            customTimer: document.getElementById('customTimer'),
            timerControls: document.getElementById('timerControls'),
            alarmSection: document.getElementById('alarmSection'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            setCustomTimer: document.getElementById('setCustomTimer'),
            addTime: document.getElementById('addTime'),
            pauseTimer: document.getElementById('pauseTimer'),
            stopTimer: document.getElementById('stopTimer'),
            dismissAlarm: document.getElementById('dismissAlarm')
        };
    }
    
    setupEventListeners() {
        // Quick timer buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const seconds = parseInt(e.target.dataset.seconds);
                this.setTimer(seconds);
            });
        });
        
        // Custom timer
        this.elements.setCustomTimer.addEventListener('click', () => {
            this.setCustomTimer();
        });
        
        // Timer controls
        this.elements.addTime.addEventListener('click', () => {
            this.addTime(30);
        });
        
        this.elements.pauseTimer.addEventListener('click', () => {
            this.togglePause();
        });
        
        this.elements.stopTimer.addEventListener('click', () => {
            this.stopTimer();
        });
        
        // Alarm dismissal
        this.elements.dismissAlarm.addEventListener('click', () => {
            this.dismissAlarm();
        });
        
        // Enter key for custom timer
        [this.elements.minutes, this.elements.seconds].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.setCustomTimer();
                }
            });
        });
    }
    
    createAlarmSound() {
        // Create alarm sound using Web Audio API
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.createBeepSound();
    }
    
    createBeepSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        
        this.alarmOscillator = oscillator;
        this.alarmGain = gainNode;
    }
    
    playAlarm() {
        let isPlaying = true;
        
        this.alarmInterval = setInterval(() => {
            if (isPlaying) {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
                
                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.5);
                
                // Vibrate if supported
                if ('vibrate' in navigator) {
                    navigator.vibrate([500, 200, 500, 200, 500]);
                }
            }
        }, 1000);
    }
    
    stopAlarm() {
        if (this.alarmInterval) {
            clearInterval(this.alarmInterval);
            this.alarmInterval = null;
        }
        
        if ('vibrate' in navigator) {
            navigator.vibrate(0); // Stop vibration
        }
    }
    
    setTimer(seconds) {
        if (this.isRunning) return;
        
        this.totalSeconds = seconds;
        this.remainingSeconds = seconds;
        this.originalTime = seconds;
        
        this.updateDisplay();
        this.startTimer();
    }
    
    setCustomTimer() {
        if (this.isRunning) return;
        
        const minutes = parseInt(this.elements.minutes.value) || 0;
        const seconds = parseInt(this.elements.seconds.value) || 0;
        const totalSeconds = (minutes * 60) + seconds;
        
        if (totalSeconds <= 0) {
            alert('Please enter a valid time');
            return;
        }
        
        this.setTimer(totalSeconds);
        
        // Clear inputs
        this.elements.minutes.value = '';
        this.elements.seconds.value = '';
    }
    
    startTimer() {
        this.isRunning = true;
        this.isPaused = false;
        
        // Show controls, hide setup
        this.elements.timerControls.style.display = 'flex';
        document.body.classList.add('timer-running');
        
        this.elements.originalTime.textContent = `Original: ${this.formatTime(this.originalTime)}`;
        
        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                this.remainingSeconds--;
                this.updateDisplay();
                
                // Warning for last 30 seconds
                if (this.remainingSeconds <= 30) {
                    document.body.classList.add('low-time');
                } else {
                    document.body.classList.remove('low-time');
                }
                
                if (this.remainingSeconds <= 0) {
                    this.timerComplete();
                }
            }
        }, 1000);
    }
    
    updateDisplay() {
        this.elements.countdown.textContent = this.formatTime(this.remainingSeconds);
    }
    
    formatTime(totalSeconds) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    addTime(seconds) {
        if (!this.isRunning) return;
        
        this.remainingSeconds += seconds;
        this.totalSeconds += seconds;
        this.updateDisplay();
        
        // Remove low-time warning if we're above 30 seconds
        if (this.remainingSeconds > 30) {
            document.body.classList.remove('low-time');
        }
        
        // Show feedback
        this.showAddTimeAnimation();
    }
    
    showAddTimeAnimation() {
        const addBtn = this.elements.addTime;
        const originalText = addBtn.textContent;
        addBtn.textContent = '+30s Added!';
        addBtn.style.background = '#4CAF50';
        
        setTimeout(() => {
            addBtn.textContent = originalText;
            addBtn.style.background = '#2196F3';
        }, 1000);
    }
    
    togglePause() {
        if (!this.isRunning) return;
        
        this.isPaused = !this.isPaused;
        this.elements.pauseTimer.textContent = this.isPaused ? 'Resume' : 'Pause';
        
        if (this.isPaused) {
            document.body.classList.remove('timer-running');
        } else {
            document.body.classList.add('timer-running');
        }
    }
    
    stopTimer() {
        this.isRunning = false;
        this.isPaused = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        // Reset display
        this.elements.originalTime.textContent = 'Set a timer';
        this.elements.countdown.textContent = '00:00';
        this.elements.pauseTimer.textContent = 'Pause';
        
        // Hide controls, show setup
        this.elements.timerControls.style.display = 'none';
        document.body.classList.remove('timer-running', 'low-time');
        
        this.remainingSeconds = 0;
        this.totalSeconds = 0;
        this.originalTime = 0;
    }
    
    timerComplete() {
        this.stopTimer();
        this.showAlarm();
        this.playAlarm();
    }
    
    showAlarm() {
        this.elements.alarmSection.style.display = 'flex';
        
        // Change the page title to draw attention
        document.title = '🔥 TIME TO FLIP! - Barbecue Timer';
    }
    
    dismissAlarm() {
        this.elements.alarmSection.style.display = 'none';
        this.stopAlarm();
        document.title = 'Barbecue Timer';
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Request permission for notifications
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    new BarbecueTimer();
});

// Service Worker registration for better mobile experience
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker not available, continue without it
    });
}

// Prevent page from sleeping during timer
let wakeLock = null;

async function requestWakeLock() {
    if ('wakeLock' in navigator) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
        } catch (err) {
            // Wake lock not supported or denied
        }
    }
}

// Request wake lock when timer starts
document.addEventListener('DOMContentLoaded', () => {
    const originalStartTimer = BarbecueTimer.prototype.startTimer;
    BarbecueTimer.prototype.startTimer = function() {
        originalStartTimer.call(this);
        requestWakeLock();
    };
});