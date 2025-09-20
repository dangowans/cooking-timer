class BarbecueTimer {
    constructor() {
        this.totalSeconds = 0;
        this.remainingSeconds = 0;
        this.originalTime = 0;
        this.addedSeconds = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.timerInterval = null;
        this.alarmAudio = null;
        this.alarmInterval = null;
        
        // Program-related variables
        this.programs = [];
        this.currentProgram = null;
        this.currentProgramStep = 0;
        this.isRunningProgram = false;
        this.isProgramPaused = false;
        this.originalTimerComplete = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.createAlarmSound();
        this.loadPrograms();
    }
    
    initializeElements() {
        this.elements = {
            originalTime: document.getElementById('originalTime'),
            addedTime: document.getElementById('addedTime'),
            countdown: document.getElementById('countdown'),
            quickTimers: document.getElementById('quickTimers'),
            customTimer: document.getElementById('customTimer'),
            timerControls: document.getElementById('timerControls'),
            alarmSection: document.getElementById('alarmSection'),
            tempModal: document.getElementById('tempModal'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            setCustomTimer: document.getElementById('setCustomTimer'),
            addTime: document.getElementById('addTime'),
            pauseTimer: document.getElementById('pauseTimer'),
            stopTimer: document.getElementById('stopTimer'),
            dismissAlarm: document.getElementById('dismissAlarm'),
            tempGuideBtn: document.getElementById('tempGuideBtn'),
            closeTempModal: document.getElementById('closeTempModal'),
            // Programs elements
            programsSection: document.getElementById('programsSection'),
            programsList: document.getElementById('programsList'),
            createProgram: document.getElementById('createProgram'),
            programModal: document.getElementById('programModal'),
            closeProgramModal: document.getElementById('closeProgramModal'),
            programName: document.getElementById('programName'),
            programSteps: document.getElementById('programSteps'),
            addStep: document.getElementById('addStep'),
            saveProgram: document.getElementById('saveProgram'),
            cancelProgram: document.getElementById('cancelProgram'),
            programExecution: document.getElementById('programExecution'),
            programExecutionTitle: document.getElementById('programExecutionTitle'),
            currentStep: document.getElementById('currentStep'),
            stepDescription: document.getElementById('stepDescription'),
            // Program step completion elements
            programStepAlarmSection: document.getElementById('programStepAlarmSection'),
            programStepTitle: document.getElementById('programStepTitle'),
            programStepMessage: document.getElementById('programStepMessage'),
            programNextStepInfo: document.getElementById('programNextStepInfo'),
            nextStepDescription: document.getElementById('nextStepDescription'),
            pauseProgram: document.getElementById('pauseProgram'),
            continueToNextStep: document.getElementById('continueToNextStep')
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
        
        // Temperature guide modal
        this.elements.tempGuideBtn.addEventListener('click', () => {
            this.showTempModal();
        });
        
        this.elements.closeTempModal.addEventListener('click', () => {
            this.hideTempModal();
        });
        
        // Close modal when clicking outside
        this.elements.tempModal.addEventListener('click', (e) => {
            if (e.target === this.elements.tempModal) {
                this.hideTempModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.tempModal.style.display === 'flex') {
                this.hideTempModal();
            }
        });
        
        // Enter key for custom timer
        [this.elements.minutes, this.elements.seconds].forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.setCustomTimer();
                }
            });
        });
        
        // Programs event listeners
        this.elements.createProgram.addEventListener('click', () => {
            this.showProgramModal();
        });
        
        this.elements.closeProgramModal.addEventListener('click', () => {
            this.hideProgramModal();
        });
        
        this.elements.cancelProgram.addEventListener('click', () => {
            this.hideProgramModal();
        });
        
        this.elements.saveProgram.addEventListener('click', () => {
            this.saveProgram();
        });
        
        this.elements.addStep.addEventListener('click', () => {
            this.addProgramStep();
        });
        
        // Close program modal when clicking outside
        this.elements.programModal.addEventListener('click', (e) => {
            if (e.target === this.elements.programModal) {
                this.hideProgramModal();
            }
        });
        
        // Handle Escape key for program modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.programModal.style.display === 'flex') {
                this.hideProgramModal();
            }
        });
        
        // Program step completion event listeners
        this.elements.pauseProgram.addEventListener('click', () => {
            this.pauseProgramExecution();
        });
        
        this.elements.continueToNextStep.addEventListener('click', () => {
            this.continueToNextProgramStep();
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
        this.addedSeconds = 0;
        
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
        this.elements.addedTime.style.display = 'none'; // Hide initially
        
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
        this.addedSeconds += seconds; // Track added time separately
        this.updateDisplay();
        
        // Keep original time display unchanged, show added time below
        if (this.addedSeconds > 0) {
            this.elements.addedTime.textContent = `Plus ${this.formatTime(this.addedSeconds)} added`;
            this.elements.addedTime.style.display = 'block';
        }
        
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
        
        // If a program is running, stop it completely
        if (this.isRunningProgram) {
            this.isRunningProgram = false;
            this.currentProgram = null;
            this.currentProgramStep = 0;
            if (this.originalTimerComplete) {
                this.timerComplete = this.originalTimerComplete; // Restore original
            }
            
            // Show regular sections again
            this.elements.quickTimers.style.display = 'block';
            this.elements.customTimer.style.display = 'block';
            this.elements.programsSection.style.display = 'block';
            this.elements.programExecution.style.display = 'none';
        }
        
        // Reset display
        this.elements.originalTime.textContent = 'Set a timer';
        this.elements.addedTime.style.display = 'none'; // Hide added time
        this.elements.countdown.textContent = '00:00';
        this.elements.pauseTimer.textContent = 'Pause';
        
        // Hide controls, show setup
        this.elements.timerControls.style.display = 'none';
        document.body.classList.remove('timer-running', 'low-time');
        
        this.remainingSeconds = 0;
        this.totalSeconds = 0;
        this.originalTime = 0;
        this.addedSeconds = 0; // Reset added time
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
    
    showTempModal() {
        this.elements.tempModal.style.display = 'flex';
    }
    
    hideTempModal() {
        this.elements.tempModal.style.display = 'none';
    }

    // Program Management Methods
    loadPrograms() {
        try {
            const saved = localStorage.getItem('barbecue-programs');
            this.programs = saved ? JSON.parse(saved) : [];
            this.displayPrograms();
        } catch (error) {
            console.error('Error loading programs:', error);
            this.programs = [];
        }
    }

    savePrograms() {
        try {
            localStorage.setItem('barbecue-programs', JSON.stringify(this.programs));
        } catch (error) {
            console.error('Error saving programs:', error);
        }
    }

    displayPrograms() {
        const container = this.elements.programsList;
        container.innerHTML = '';
        
        // Show resume option if a program is paused
        if (this.isProgramPaused && this.currentProgram) {
            const resumeElement = document.createElement('div');
            resumeElement.className = 'program-item paused-program';
            resumeElement.innerHTML = `
                <div class="program-info">
                    <h4>⏸️ ${this.currentProgram.name} (Paused)</h4>
                    <p>Step ${this.currentProgramStep + 1} of ${this.currentProgram.steps.length} • Paused</p>
                </div>
                <div class="program-actions">
                    <button class="program-btn resume-program">Resume</button>
                    <button class="program-btn stop-program">Stop Program</button>
                </div>
            `;
            container.appendChild(resumeElement);
            
            // Add event listeners for resume and stop
            resumeElement.querySelector('.resume-program').addEventListener('click', () => {
                this.resumeProgramExecution();
            });
            
            resumeElement.querySelector('.stop-program').addEventListener('click', () => {
                this.completeProgramExecution();
            });
        }

        if (this.programs.length === 0 && !this.isProgramPaused) {
            container.innerHTML = '<p style="color: #666; font-style: italic;">No programs saved yet. Create your first program!</p>';
            return;
        }

        this.programs.forEach((program, index) => {
            const programElement = document.createElement('div');
            programElement.className = 'program-item';
            
            const totalTime = program.steps.reduce((total, step) => {
                return total + (step.minutes * 60) + step.seconds;
            }, 0);
            
            programElement.innerHTML = `
                <div class="program-info">
                    <h4>${program.name}</h4>
                    <p>${program.steps.length} steps • Total: ${this.formatTime(totalTime)}</p>
                </div>
                <div class="program-actions">
                    <button class="program-btn run-program" data-index="${index}">Run</button>
                    <button class="program-btn delete-program" data-index="${index}">Delete</button>
                </div>
            `;
            
            container.appendChild(programElement);
        });

        // Add event listeners for run and delete buttons
        container.querySelectorAll('.run-program').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.runProgram(index);
            });
        });

        container.querySelectorAll('.delete-program').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.deleteProgram(index);
            });
        });
    }

    showProgramModal() {
        this.elements.programModal.style.display = 'flex';
        this.elements.programName.value = '';
        this.resetProgramSteps();
    }

    hideProgramModal() {
        this.elements.programModal.style.display = 'none';
    }

    resetProgramSteps() {
        this.elements.programSteps.innerHTML = `
            <div class="step-input">
                <input type="number" min="0" max="59" placeholder="0" class="step-minutes">
                <span>minutes</span>
                <input type="number" min="0" max="59" placeholder="0" class="step-seconds">
                <span>seconds</span>
                <input type="text" placeholder="Step description (optional)" class="step-description">
                <button type="button" class="remove-step" style="display: none;">&times;</button>
            </div>
        `;
    }

    addProgramStep() {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-input';
        stepDiv.innerHTML = `
            <input type="number" min="0" max="59" placeholder="0" class="step-minutes">
            <span>minutes</span>
            <input type="number" min="0" max="59" placeholder="0" class="step-seconds">
            <span>seconds</span>
            <input type="text" placeholder="Step description (optional)" class="step-description">
            <button type="button" class="remove-step">&times;</button>
        `;
        
        this.elements.programSteps.appendChild(stepDiv);
        
        // Add event listener for remove button
        stepDiv.querySelector('.remove-step').addEventListener('click', () => {
            stepDiv.remove();
            this.updateRemoveButtons();
        });
        
        this.updateRemoveButtons();
    }

    updateRemoveButtons() {
        const steps = this.elements.programSteps.querySelectorAll('.step-input');
        steps.forEach((step, index) => {
            const removeBtn = step.querySelector('.remove-step');
            removeBtn.style.display = steps.length > 1 ? 'flex' : 'none';
        });
    }

    saveProgram() {
        const name = this.elements.programName.value.trim();
        if (!name) {
            alert('Please enter a program name');
            return;
        }

        const stepInputs = this.elements.programSteps.querySelectorAll('.step-input');
        const steps = [];
        
        for (let stepInput of stepInputs) {
            const minutes = parseInt(stepInput.querySelector('.step-minutes').value) || 0;
            const seconds = parseInt(stepInput.querySelector('.step-seconds').value) || 0;
            const description = stepInput.querySelector('.step-description').value.trim();
            
            if (minutes === 0 && seconds === 0) {
                alert('Each step must have at least 1 second');
                return;
            }
            
            steps.push({
                minutes,
                seconds,
                description: description || `${minutes}m ${seconds}s`
            });
        }

        if (steps.length === 0) {
            alert('Please add at least one step');
            return;
        }

        const program = { name, steps };
        this.programs.push(program);
        this.savePrograms();
        this.displayPrograms();
        this.hideProgramModal();
    }

    deleteProgram(index) {
        const program = this.programs[index];
        if (confirm(`Delete program "${program.name}"?`)) {
            this.programs.splice(index, 1);
            this.savePrograms();
            this.displayPrograms();
        }
    }

    runProgram(index) {
        if (this.isRunning || this.isRunningProgram) {
            alert('A timer is already running. Stop it first.');
            return;
        }

        this.currentProgram = this.programs[index];
        this.currentProgramStep = 0;
        this.isRunningProgram = true;
        
        // Hide other sections and show program execution
        this.elements.quickTimers.style.display = 'none';
        this.elements.customTimer.style.display = 'none';
        this.elements.programsSection.style.display = 'none';
        this.elements.programExecution.style.display = 'block';
        
        this.elements.programExecutionTitle.textContent = `Running: ${this.currentProgram.name}`;
        
        this.runNextProgramStep();
    }

    runNextProgramStep() {
        if (this.currentProgramStep >= this.currentProgram.steps.length) {
            this.completeProgramExecution();
            return;
        }

        const step = this.currentProgram.steps[this.currentProgramStep];
        const stepTime = (step.minutes * 60) + step.seconds;
        
        // Update program progress display
        this.elements.currentStep.textContent = `Step ${this.currentProgramStep + 1} of ${this.currentProgram.steps.length}`;
        this.elements.stepDescription.textContent = step.description;
        
        // Start the timer for this step
        this.setTimer(stepTime);
        
        // Override the timer complete method to handle program flow
        this.originalTimerComplete = this.timerComplete.bind(this);
        this.timerComplete = () => {
            this.stopAlarm();
            this.showProgramStepComplete();
        };
    }

    showProgramStepComplete() {
        // Check if this was the last step before incrementing
        if (this.currentProgramStep + 1 >= this.currentProgram.steps.length) {
            this.currentProgramStep++;
            this.completeProgramExecution();
        } else {
            // Show enhanced alarm modal for step completion
            const nextStep = this.currentProgram.steps[this.currentProgramStep + 1];
            
            // Update modal content
            this.elements.programStepTitle.textContent = `🍖 Step ${this.currentProgramStep + 1} Complete!`;
            this.elements.programStepMessage.textContent = `Great progress! You've completed another step.`;
            this.elements.nextStepDescription.textContent = nextStep.description || `Step ${this.currentProgramStep + 2}`;
            
            // Show the program step completion modal
            this.elements.programStepAlarmSection.style.display = 'flex';
            
            // Change the page title to draw attention
            document.title = '🔥 STEP COMPLETE! - Barbecue Timer';
            
            // Play alarm sound and vibrate
            this.playAlarm();
        }
    }

    completeProgramExecution() {
        alert(`Program "${this.currentProgram.name}" completed! 🎉`);
        
        // Reset program state
        this.isRunningProgram = false;
        this.isProgramPaused = false;
        this.currentProgram = null;
        this.currentProgramStep = 0;
        this.timerComplete = this.originalTimerComplete; // Restore original
        
        // Show regular sections again
        this.elements.quickTimers.style.display = 'block';
        this.elements.customTimer.style.display = 'block';
        this.elements.programsSection.style.display = 'block';
        this.elements.programExecution.style.display = 'none';
        
        // Reset timer display
        this.stopTimer();
    }
    
    pauseProgramExecution() {
        // Hide the step completion modal
        this.elements.programStepAlarmSection.style.display = 'none';
        this.stopAlarm();
        document.title = 'Barbecue Timer';
        
        // Increment step counter since we completed the current step
        this.currentProgramStep++;
        
        // Set program as paused
        this.isProgramPaused = true;
        
        // Show regular sections for user to interact with other features
        this.elements.quickTimers.style.display = 'block';
        this.elements.customTimer.style.display = 'block';
        this.elements.programsSection.style.display = 'block';
        this.elements.programExecution.style.display = 'none';
        
        // Reset timer display
        this.stopTimer();
        
        // Add resume button to programs section (we'll need to update displayPrograms for this)
        this.displayPrograms();
    }
    
    continueToNextProgramStep() {
        // Hide the step completion modal
        this.elements.programStepAlarmSection.style.display = 'none';
        this.stopAlarm();
        document.title = 'Barbecue Timer';
        
        // Increment step counter and continue to next step
        this.currentProgramStep++;
        this.runNextProgramStep();
    }
    
    resumeProgramExecution() {
        // Resume the paused program
        this.isProgramPaused = false;
        
        // Hide regular sections and show program execution
        this.elements.quickTimers.style.display = 'none';
        this.elements.customTimer.style.display = 'none';
        this.elements.programsSection.style.display = 'none';
        this.elements.programExecution.style.display = 'block';
        
        // Continue from where we left off
        this.runNextProgramStep();
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