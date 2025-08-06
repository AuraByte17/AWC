/**
 * ui.js
 * * This module is responsible for all direct DOM manipulation and rendering.
 * It takes data and state from app.js and uses it to build and update the HTML.
 * It contains functions for creating components (like cards), showing/hiding elements,
 * and managing the overall visual representation of the application state.
 */

import { appData } from './config.js';

// --- ELEMENT QUERYING ---

/**
 * Caches all necessary DOM elements for the application.
 * @returns {Object} An object containing all cached DOM elements.
 */
export function queryElements() {
    return {
        navHub: document.getElementById('navigation-hub'),
        appSidebar: document.getElementById('app-sidebar'),
        seccoes: document.querySelectorAll('.seccao'),
        mobileHeaderTitle: document.getElementById('current-section-title'),
        openMenuBtn: document.getElementById('open-menu-btn'),
        closeMenuBtn: document.getElementById('close-menu-btn'),
        mobileMenuOverlay: document.getElementById('mobile-menu-overlay'),
        mainContentArea: document.getElementById('main-content-area'),
        notificationEl: document.getElementById('notification'),
        notificationIcon: document.getElementById('notification-icon'),
        notificationText: document.getElementById('notification-text'),
        perfilFormView: document.getElementById('perfil-form-view'),
        perfilDashboardView: document.getElementById('perfil-dashboard-view'),
        perfilNomeInput: document.getElementById('perfil-nome'),
        perfilAlturaInput: document.getElementById('perfil-altura'),
        perfilPesoInput: document.getElementById('perfil-peso'),
        avatarChoicesGrid: document.getElementById('avatar-choices-grid'),
        formAvatarPreview: document.getElementById('form-avatar-preview'),
        passaporteNomeSpan: document.getElementById('passaporte-nome'),
        passaporteBeltSpan: document.getElementById('passaporte-belt'),
        passaportePontosSpan: document.getElementById('passaporte-pontos'),
        studentIdDisplay: document.getElementById('student-id-display'),
        passaporteAlturaSpan: document.getElementById('passaporte-altura'),
        passaportePesoSpan: document.getElementById('passaporte-peso'),
        passaporteImcSpan: document.getElementById('passaporte-imc'),
        passaporteStreakSpan: document.getElementById('passaporte-streak'),
        passaporteAchievementsSpan: document.getElementById('passaporte-achievements'),
        passaporteAvatarDisplay: document.getElementById('passaporte-avatar-display'),
        userStatusDisplay: document.getElementById('user-status-display'),
        userStatusName: document.getElementById('user-status-name'),
        userStatusBelt: document.getElementById('user-status-belt'),
        userStatusAvatar: document.getElementById('user-status-avatar'),
        userProgressBarFill: document.getElementById('user-progress-bar-fill'),
        userProgressBarText: document.getElementById('user-progress-bar-text'),
        staminaBarFill: document.getElementById('stamina-bar-fill'),
        staminaBarText: document.getElementById('stamina-bar-text'),
        skillContainer: document.getElementById('container-skill'),
        conditioningContainer: document.getElementById('container-condicionamento'),
        plansContainer: document.getElementById('saved-plans-container'),
        recommendedPlansContainer: document.getElementById('recommended-plans-container'),
        recommendedPlanCategories: document.getElementById('recommended-plan-categories'),
        planNameInput: document.getElementById('plan-name-input'),
        planExerciseSelection: document.getElementById('plan-exercise-selection'),
        achievementsGrid: document.getElementById('achievements-grid'),
        beltProgressionContainer: document.getElementById('belt-progression-container'),
        mastersContainer: document.getElementById('container-mestres'),
        theoryContainer: document.getElementById('container-teoria'),
        glossaryContainerCinto: document.getElementById('container-glossario-cinto'),
        glossaryContainerGlobal: document.getElementById('container-glossario-global'),
        dailyChallengeCard: document.getElementById('daily-challenge-card'),
        modal: document.getElementById('video-modal'),
        modalTitle: document.getElementById('modal-title'),
        modalVideoContainer: document.getElementById('modal-video-container'),
        statTotalXp: document.getElementById('stat-total-xp'),
        statTotalTime: document.getElementById('stat-total-time'),
        statFavExercise: document.getElementById('stat-fav-exercise'),
        xpChartCanvas: document.getElementById('xp-chart'),
        onboardingModal: document.getElementById('onboarding-modal'),
        onboardingTitle: document.getElementById('onboarding-title'),
        onboardingText: document.getElementById('onboarding-text'),
        onboardingPrevBtn: document.getElementById('onboarding-prev-btn'),
        onboardingNextBtn: document.getElementById('onboarding-next-btn'),
        onboardingDots: document.getElementById('onboarding-dots'),
        profileTabBtns: document.querySelectorAll('#seccao-perfil .profile-tab-btn'),
        profileTabPanes: document.querySelectorAll('#seccao-perfil .profile-tab-pane'),
        planosTabBtns: document.querySelectorAll('#seccao-planos .profile-tab-btn'),
        planosTabPanes: document.querySelectorAll('#seccao-planos .profile-tab-pane'),
        glossarioTabBtns: document.querySelectorAll('#seccao-glossario .profile-tab-btn'),
        glossarioTabPanes: document.querySelectorAll('#seccao-glossario .profile-tab-pane'),
        themePickerContainer: document.getElementById('theme-picker-container'),
        planExecutionModal: document.getElementById('plan-execution-modal'),
        planExecutionTitle: document.getElementById('plan-execution-title'),
        planExecutionTimerDisplay: document.getElementById('plan-execution-timer-display'),
        planExecutionProgressBar: document.getElementById('plan-execution-progress-bar'),
        planExecutionCurrentExercise: document.getElementById('plan-execution-current-exercise'),
        planExecutionPhaseInfo: document.getElementById('plan-execution-phase-info'),
    };
}


// --- CORE UI UPDATES ---

/**
 * Updates the entire UI based on the current user profile state.
 * @param {Object} elements - The cached DOM elements.
 * @param {Object} userProfile - The current user's profile data.
 * @param {Function} getBeltByLevel - Function to get belt details by level.
 */
export function updateUserUI(elements, userProfile, getBeltByLevel) {
    if (!userProfile) {
        elements.userStatusDisplay.style.display = 'none';
        elements.perfilFormView.style.display = 'block';
        elements.perfilDashboardView.style.display = 'none';
        return;
    }

    elements.perfilFormView.style.display = 'none';
    elements.perfilDashboardView.style.display = 'block';
    
    applyTheme(userProfile.theme);

    const currentBelt = getBeltByLevel(userProfile.unlockedBeltLevel);
    const nextBelt = getBeltByLevel(currentBelt.level + 1);

    // Update user status bar
    elements.userStatusDisplay.style.display = 'flex';
    elements.userStatusName.textContent = userProfile.name;
    elements.userStatusBelt.textContent = currentBelt.name;
    
    const avatar = appData.AVATAR_LIST.find(a => a.id === userProfile.avatar);
    const avatarId = avatar ? avatar.id.substring(6, 7) : "?";
    elements.userStatusAvatar.src = `https://placehold.co/60x60/2c2c2c/ecf0f1?text=${avatarId}`;
    elements.passaporteAvatarDisplay.src = `https://placehold.co/150x150/2c2c2c/ecf0f1?text=${avatarId}`;

    // Update progress bar
    if (nextBelt) {
        const progressPercentage = Math.min(100, (userProfile.xp / nextBelt.minXp) * 100);
        elements.userProgressBarFill.style.width = `${progressPercentage}%`;
        elements.userProgressBarText.textContent = `${userProfile.xp} / ${nextBelt.minXp} XP`;
    } else {
        elements.userProgressBarFill.style.width = '100%';
        elements.userProgressBarText.textContent = 'Mestria Alcançada';
    }

    // Update passport details
    elements.passaporteNomeSpan.textContent = userProfile.name;
    elements.passaporteBeltSpan.textContent = currentBelt.name;
    elements.passaportePontosSpan.textContent = userProfile.xp;
    elements.studentIdDisplay.textContent = userProfile.studentId;
    elements.passaporteAlturaSpan.textContent = userProfile.altura || 'N/A';
    elements.passaportePesoSpan.textContent = userProfile.peso || 'N/A';
    elements.passaporteImcSpan.textContent = userProfile.imc || 'N/A';
    elements.passaporteStreakSpan.textContent = userProfile.streak;
    elements.passaporteAchievementsSpan.textContent = `${userProfile.achievements.length} / ${Object.keys(appData.ACHIEVEMENTS).length}`;
}

/**
 * Updates the stamina bar in the UI.
 * @param {Object} elements - The cached DOM elements.
 * @param {number} stamina - Current stamina value.
 * @param {number} maxStamina - Maximum stamina value.
 */
export function updateStaminaUI(elements, stamina, maxStamina) {
    elements.staminaBarText.textContent = `⚡ ${stamina} / ${maxStamina}`;
    elements.staminaBarFill.style.width = `${(stamina / maxStamina) * 100}%`;
}


// --- NAVIGATION & SECTION VISIBILITY ---

/**
 * Shows a specific section and hides others.
 * @param {Object} elements - The cached DOM elements.
 * @param {string} activeSectionId - The ID of the section to show.
 */
export function showSection(elements, activeSectionId) {
    elements.seccoes.forEach(seccao => seccao.classList.toggle('visivel', seccao.id === activeSectionId));

    elements.navHub.querySelectorAll('.nav-button').forEach(button => {
        button.classList.toggle('active', button.dataset.seccao === activeSectionId);
    });

    const navItem = appData.NAV_ITEMS.find(item => item.id === activeSectionId);
    if (navItem) {
        elements.mobileHeaderTitle.textContent = navItem.text;
    }

    elements.mainContentArea.scrollTop = 0;
    toggleMobileMenu(elements, false);
}

/**
 * Toggles the mobile menu visibility.
 * @param {Object} elements - The cached DOM elements.
 * @param {boolean} show - Whether to show or hide the menu.
 */
export function toggleMobileMenu(elements, show) {
    elements.appSidebar.classList.toggle('open', show);
    elements.mobileMenuOverlay.classList.toggle('visible', show);
}

/**
 * Renders the main navigation menu.
 * @param {Object} elements - The cached DOM elements.
 * @param {Object} userProfile - The current user's profile data.
 * @param {Function} onNavClick - Callback function for when a nav item is clicked.
 */
export function renderNavigation(elements, userProfile, onNavClick) {
    const navContainer = elements.navHub;
    navContainer.innerHTML = '';
    
    const hasNewSkill = userProfile?.newContent?.skill ?? false;
    const hasNewBelts = userProfile?.newContent?.belts ?? false;

    appData.NAV_ITEMS.forEach(item => {
        const button = document.createElement('button');
        button.className = 'nav-button';
        button.dataset.seccao = item.id;
        
        let buttonHTML = `<span class="icon">${item.icon}</span> ${item.text}`;
        
        if ((item.id === 'seccao-skill' && hasNewSkill) || (item.id === 'seccao-cinturoes' && hasNewBelts)) {
            buttonHTML += '<span class="nav-badge"></span>';
        }
        
        button.innerHTML = buttonHTML;
        button.addEventListener('click', () => onNavClick(item.id));
        navContainer.appendChild(button);
    });
}


// --- COMPONENT & CONTENT RENDERING ---

/**
 * Renders the list of avatars for selection.
 * @param {Object} elements - The cached DOM elements.
 * @param {Object} userProfile - The current user's profile data.
 * @param {string} selectedAvatar - The ID of the currently selected avatar.
 * @param {Function} onAvatarSelect - Callback for when an avatar is clicked.
 */
export function renderAvatarChoices(elements, userProfile, selectedAvatar, onAvatarSelect) {
    elements.avatarChoicesGrid.innerHTML = '';
    const currentBeltLevel = userProfile ? userProfile.unlockedBeltLevel : 0;

    appData.AVATAR_LIST.forEach(avatar => {
        const isUnlocked = currentBeltLevel >= avatar.requiredBelt;
        const img = document.createElement('img');
        const avatarId = avatar.id.substring(6, 7);
        img.src = `https://placehold.co/60x60/2c2c2c/ecf0f1?text=${avatarId}`;
        img.alt = `Avatar ${avatar.id}`;
        img.className = `avatar-choice ${isUnlocked ? '' : 'locked'}`;
        img.dataset.avatar = avatar.id;
        
        if (avatar.id === selectedAvatar) {
            img.classList.add('selected');
        }

        if (isUnlocked) {
            img.addEventListener('click', () => onAvatarSelect(avatar.id));
        }
        elements.avatarChoicesGrid.appendChild(img);
    });
    
    const currentAvatar = appData.AVATAR_LIST.find(a => a.id === selectedAvatar);
    if(currentAvatar) {
        const avatarId = currentAvatar.id.substring(6, 7);
        elements.formAvatarPreview.src = `https://placehold.co/150x150/2c2c2c/ecf0f1?text=${avatarId}`;
    }
}

/**
 * Creates and returns a timer card element.
 * @param {Object} item - The training item data.
 * @param {Function} onStart - Callback for the start button.
 * @param {Function} onStop - Callback for the stop button.
 * @param {Function} onVideoClick - Callback for when the video area is clicked.
 * @returns {HTMLElement} The created timer card element.
 */
export function createTimerCard(item, onStart, onStop, onVideoClick) {
    const cardEl = document.createElement('div');
    cardEl.className = 'timer-card zoom-on-hover';
    const timerId = item.id;
    cardEl.id = `timer-card-${timerId}`;
    
    let xpInfoText = `<span>⭐ ${item.xp} XP</span> <span style="margin-left: 1rem;">⚡ ${item.staminaCost} Energia</span>`;

    cardEl.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="timer-visual-container">
            <svg class="timer-progress-ring" width="160" height="160">
                <circle class="timer-progress-ring__background" r="70" cx="80" cy="80" />
                <circle class="timer-progress-ring__circle" r="70" cx="80" cy="80" />
            </svg>
            <div class="timer-display">00:00</div>
        </div>
        <div class="timer-controls">
            <button class="action-button start-timer-btn" data-stamina-cost="${item.staminaCost}">Iniciar</button>
            <button class="action-button stop-timer-btn" style="display:none;">Parar</button>
        </div>
        <div class="timer-xp-info">${xpInfoText}</div>
        <div class="timer-limit-warning">Limite de 2 min. para o teu nível</div>
    `;
    
    const progressCircle = cardEl.querySelector('.timer-progress-ring__circle');
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    progressCircle.style.strokeDashoffset = circumference;

    cardEl.querySelector('.start-timer-btn').addEventListener('click', () => onStart(item, item.duration));
    cardEl.querySelector('.stop-timer-btn').addEventListener('click', () => onStop(item, true, item.duration));
    
    if (item.videoUrl) {
        const clickableArea = cardEl.querySelector('.timer-visual-container');
        clickableArea.style.cursor = 'pointer';
        clickableArea.addEventListener('click', () => onVideoClick(item.title, item.videoUrl));
    }
    return cardEl;
}

/**
 * Renders the belt progression accordion.
 * @param {Object} elements - The cached DOM elements.
 * @param {Object} userProfile - The user's profile data.
 * @param {Function} getBeltByLevel - Function to get belt details.
 * @param {Function} onPromote - Callback for promotion button click.
 */
export function renderBeltProgression(elements, userProfile, getBeltByLevel, onPromote) {
    const container = elements.beltProgressionContainer;
    container.innerHTML = '';
    if (!userProfile) return;

    appData.BELT_SYSTEM.forEach(belt => {
        const isUnlocked = userProfile.unlockedBeltLevel >= belt.level;
        const itemEl = document.createElement('div');
        itemEl.className = `belt-accordion-item ${isUnlocked ? 'unlocked' : 'locked'}`;
        if (isUnlocked) itemEl.style.borderLeftColor = belt.color;

        let requirementHTML = isUnlocked 
            ? `<span class="belt-requirement" style="color: ${belt.color};">DESBLOQUEADO</span>`
            : `<span class="belt-requirement">Requer ${belt.minXp} XP</span>`;

        let contentHTML = '';
        const itemsInBelt = appData.ALL_TRAINING_ITEMS.filter(item => item.requiredBelt === belt.level);
        if (itemsInBelt.length > 0) {
            contentHTML += `<div class="belt-content-title">Conteúdo Desbloqueado:</div><div class="belt-content-grid">`;
            itemsInBelt.forEach(item => {
                contentHTML += `<div>${item.title}</div>`;
            });
            contentHTML += `</div>`;
        } else if (belt.level > 0) {
            contentHTML = `<p>Nenhum item novo neste nível.</p>`;
        }

        const nextBelt = getBeltByLevel(userProfile.unlockedBeltLevel + 1);
        if (nextBelt && nextBelt.level === belt.level && userProfile.xp >= nextBelt.minXp) {
             contentHTML += `
                <div class="promotion-area">
                    <p>Tens XP suficiente para o teste!</p>
                    <button class="action-button promote-btn" data-belt-level="${belt.level}">Realizar Teste de Graduação</button>
                    <div class="promotion-input-area" style="display:none;">
                        <input type="text" placeholder="Código do Mestre" class="promotion-code-input">
                        <button class="action-button submit-code-btn">Confirmar</button>
                    </div>
                </div>
             `;
        }

        itemEl.innerHTML = `
            <div class="belt-accordion-header">
                <h3 style="color: ${belt.color};">${belt.name}</h3>
                ${requirementHTML}
            </div>
            <div class="belt-accordion-content">
                ${contentHTML}
            </div>
        `;

        const header = itemEl.querySelector('.belt-accordion-header');
        header.addEventListener('click', () => {
            container.querySelectorAll('.belt-accordion-item.active').forEach(otherItem => {
                if (otherItem !== itemEl) otherItem.classList.remove('active');
            });
            itemEl.classList.toggle('active');
        });
        
        const promoteBtn = itemEl.querySelector('.promote-btn');
        if (promoteBtn) {
            promoteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                promoteBtn.style.display = 'none';
                itemEl.querySelector('.promotion-input-area').style.display = 'flex';
            });
            
            const submitBtn = itemEl.querySelector('.submit-code-btn');
            const inputEl = itemEl.querySelector('.promotion-code-input');
            submitBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                await onPromote(belt.level, inputEl.value);
            });
        }

        container.appendChild(itemEl);
    });
}

/**
 * Renders all static content sections like Masters and Theory.
 * @param {Object} elements - The cached DOM elements.
 */
export function renderStaticContent(elements) {
    // Render Masters
    const mastersContainer = elements.mastersContainer;
    mastersContainer.innerHTML = '';
    appData.GREAT_MASTERS_DATA.forEach(master => {
        const cardEl = document.createElement('div');
        cardEl.className = 'master-flip-card';
        cardEl.innerHTML = `
            <div class="master-flip-card-inner">
                <div class="master-flip-card-front">
                    <div class="master-image-placeholder">
                        <img src="${master.image_placeholder}" alt="Retrato de ${master.name}">
                    </div>
                    <div class="master-front-info">
                        <h3>${master.name}</h3>
                        <p>${master.dynasty}</p>
                    </div>
                </div>
                <div class="master-flip-card-back">
                    ${master.content}
                </div>
            </div>
        `;
        mastersContainer.appendChild(cardEl);
    });

    // Render Theory
    const theoryContainer = elements.theoryContainer;
    theoryContainer.innerHTML = '';
    appData.THEORY_DATA.forEach(theory => {
        const cardEl = document.createElement('div');
        cardEl.className = 'floating-card';
        cardEl.innerHTML = `
            <div class="card-header">
                <h2 class="subtitulo-seccao" style="margin:0; border:0;">${theory.title}</h2>
            </div>
            <div class="card-content">
                ${theory.content}
            </div>
        `;
        theoryContainer.appendChild(cardEl);
    });
}


// --- MODALS & NOTIFICATIONS ---

/**
 * Shows a notification message.
 * @param {Object} elements - The cached DOM elements.
 * @param {string} text - The message to display.
 * @param {string} icon - The icon to display.
 */
export function showNotification(elements, text, icon = 'ℹ️') {
    const notification = elements.notificationEl;
    elements.notificationIcon.textContent = icon;
    elements.notificationText.textContent = text;
    
    notification.classList.remove('hidden');
    notification.style.animation = 'none';
    void notification.offsetWidth; 
    notification.style.animation = 'slideInDown 0.5s forwards, fadeOut 0.5s 3.5s forwards';
    
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 4000);
}

/**
 * Opens the video modal.
 * @param {Object} elements - The cached DOM elements.
 * @param {string} title - The title for the modal.
 * @param {string} videoUrl - The URL of the video to embed.
 */
export function openModal(elements, title, videoUrl) {
    if (!videoUrl) {
        showNotification(elements, "Vídeo não disponível para este item.", "⚠️");
        return;
    }
    elements.modalTitle.textContent = title;
    elements.modalVideoContainer.innerHTML = `
        <iframe
            src="${videoUrl}?autoplay=1&modestbranding=1&rel=0"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen>
        </iframe>`;
    elements.modal.style.display = 'flex';
}

/**
 * Closes any open modal.
 * @param {Object} elements - The cached DOM elements.
 */
export function closeModal(elements) {
    elements.modal.style.display = 'none';
    elements.modalVideoContainer.innerHTML = '';
}


// --- THEME ---

/**
 * Applies a color theme to the application.
 * @param {string} themeKey - The key of the theme to apply.
 */
export function applyTheme(themeKey) {
    const theme = appData.COLOR_THEMES[themeKey] || appData.COLOR_THEMES['default'];
    document.documentElement.style.setProperty('--cor-primaria', theme.primary);
    document.documentElement.style.setProperty('--cor-secundaria', theme.secondary);
}

/**
 * Renders the theme picker dots.
 * @param {Object} elements - The cached DOM elements.
 * @param {string} currentTheme - The key of the current theme.
 * @param {Function} onThemeSelect - Callback for when a theme is selected.
 */
export function renderThemePicker(elements, currentTheme, onThemeSelect) {
    const container = elements.themePickerContainer.querySelector('.theme-options');
    container.innerHTML = '';

    for (const key in appData.COLOR_THEMES) {
        const theme = appData.COLOR_THEMES[key];
        const dot = document.createElement('div');
        dot.className = 'theme-dot';
        dot.style.background = `linear-gradient(145deg, ${theme.primary}, ${theme.secondary})`;
        dot.title = theme.name;
        if (key === currentTheme) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => onThemeSelect(key));
        container.appendChild(dot);
    }
}

// --- TIMER UI ---

/**
 * Sets the progress of a timer's visual ring.
 * @param {HTMLElement} cardEl - The timer card element.
 * @param {number} percent - The progress percentage (0-100).
 */
export function setTimerProgress(cardEl, percent) {
    const progressCircle = cardEl.querySelector('.timer-progress-ring__circle');
    if(!progressCircle) return;
    const radius = progressCircle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
}

/**
 * Resets a timer card to its initial state.
 * @param {string} timerId - The ID of the timer to reset.
 */
export function resetTimerCard(timerId) {
    const cardEl = document.getElementById(`timer-card-${timerId}`);
    if (!cardEl) return;
    
    cardEl.querySelector('.timer-display').textContent = '00:00';
    cardEl.querySelector('.start-timer-btn').style.display = 'inline-block';
    cardEl.querySelector('.stop-timer-btn').style.display = 'none';
    cardEl.querySelector('.timer-limit-warning').style.display = 'none';
    setTimerProgress(cardEl, 0);
    
    const progressCircle = cardEl.querySelector('.timer-progress-ring__circle');
    progressCircle.classList.remove('rest-mode');
}
