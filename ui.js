/**
 * ui.js
 * This module is responsible for all DOM manipulation and UI rendering.
 * It receives data and callbacks from the main app module (app.js) and updates the page accordingly.
 * It contains no application state logic.
 */

import { appData } from './config.js';

export const UI = {
    elements: {}, // Will be populated by app.js on initialization
    
    // Receives DOM element references from the main module
    init(elements) {
        this.elements = elements;
    },

    // Toggles visibility of the main application sections
    showSection(sectionId) {
        this.elements.seccoes.forEach(seccao => seccao.classList.toggle('visivel', seccao.id === sectionId));
        this.elements.navHub.querySelectorAll('.nav-button').forEach(button => {
            button.classList.toggle('active', button.dataset.seccao === sectionId);
        });
        const navItem = appData.NAV_ITEMS.find(item => item.id === sectionId);
        if (navItem) {
            this.elements.mobileHeaderTitle.textContent = navItem.text;
        }
        this.elements.mainContentArea.scrollTop = 0;
        this.toggleMobileMenu(false);
    },

    // Renders the main navigation in the sidebar
    renderNavigation(userProfile, activeSection, onNavigate) {
        const navContainer = this.elements.navHub;
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
            button.addEventListener('click', () => onNavigate(item.id));
            navContainer.appendChild(button);
        });
        
        this.showSection(activeSection);
    },

    // Updates the top status bar with user information
    updateUserStatus(userProfile, getBeltByLevel) {
        if (!userProfile) {
            this.elements.userStatusDisplay.style.display = 'none';
            return;
        }

        this.elements.userStatusDisplay.style.display = 'flex';
        const currentBelt = getBeltByLevel(userProfile.unlockedBeltLevel);
        const nextBelt = getBeltByLevel(currentBelt.level + 1);

        this.elements.userStatusName.textContent = userProfile.name;
        this.elements.userStatusBelt.textContent = currentBelt.name;
        
        const avatar = appData.AVATAR_LIST.find(a => a.id === userProfile.avatar);
        const avatarId = avatar ? avatar.id.substring(6, 7) : "?";
        this.elements.userStatusAvatar.src = `https://placehold.co/60x60/2c2c2c/ecf0f1?text=${avatarId}`;

        if (nextBelt) {
            const xpForNextLevel = nextBelt.minXp;
            const progressPercentage = Math.min(100, (userProfile.xp / xpForNextLevel) * 100);
            this.elements.userProgressBarFill.style.width = `${progressPercentage}%`;
            this.elements.userProgressBarText.textContent = `${userProfile.xp} / ${xpForNextLevel} XP`;
        } else {
            this.elements.userProgressBarFill.style.width = '100%';
            this.elements.userProgressBarText.textContent = 'Mestria Alcançada';
        }
    },

    // Updates the stamina bar
    updateStaminaBar(stamina, maxStamina) {
        this.elements.staminaBarText.textContent = `⚡ ${stamina} / ${maxStamina}`;
        this.elements.staminaBarFill.style.width = `${(stamina / maxStamina) * 100}%`;
    },

    // Shows a floating notification
    showNotification(text, icon = 'ℹ️') {
        const notification = this.elements.notificationEl;
        this.elements.notificationIcon.textContent = icon;
        this.elements.notificationText.textContent = text;
        
        notification.classList.remove('hidden');
        notification.style.animation = 'none';
        void notification.offsetWidth; // Trigger reflow
        notification.style.animation = 'slideInDown 0.5s forwards, fadeOut 0.5s 3.5s forwards';
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 4000);
    },

    // Opens the video modal
    openModal(title, videoUrl) {
        if (!videoUrl || videoUrl === "https://www.youtube.com/embed/example") {
            this.showNotification("Vídeo não disponível para este item.", "⚠️");
            return;
        }
        this.elements.modalTitle.textContent = title;
        this.elements.modalVideoContainer.innerHTML = `
            <iframe
                src="${videoUrl}?autoplay=1&modestbranding=1&rel=0"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>`;
        this.elements.modal.style.display = 'flex';
    },

    // Closes the video modal
    closeModal() {
        this.elements.modal.style.display = 'none';
        this.elements.modalVideoContainer.innerHTML = '';
    },

    // Toggles the mobile menu
    toggleMobileMenu(show) {
        this.elements.appSidebar.classList.toggle('open', show);
        this.elements.mobileMenuOverlay.classList.toggle('visible', show);
    },
    
    // Applies the selected color theme
    applyTheme(themeKey) {
        const theme = appData.COLOR_THEMES[themeKey] || appData.COLOR_THEMES['default'];
        document.documentElement.style.setProperty('--cor-primaria', theme.primary);
        document.documentElement.style.setProperty('--cor-secundaria', theme.secondary);
    },

    // Renders the theme picker in the sidebar
    renderThemePicker(currentTheme, onThemeSelect) {
        const container = this.elements.themePickerContainer.querySelector('.theme-options');
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
    },
    
    // Renders all static content that doesn't depend on a user profile
    renderStaticContent(onMasterCardHover) {
        this.renderMasters(onMasterCardHover);
        this.renderTheory();
    },

    // Renders the masters section with flip cards
    renderMasters(onMasterCardHover) {
        const container = this.elements.mastersContainer;
        container.innerHTML = `<h1 class="titulo-seccao">Mestres Lendários</h1>`;
        const grid = document.createElement('div');
        grid.className = 'card-grid';

        appData.GREAT_MASTERS_DATA.forEach(master => {
            const cardEl = document.createElement('div');
            cardEl.className = 'master-flip-card';
            cardEl.innerHTML = `
                <div class="master-flip-card-inner">
                    <div class="master-flip-card-front">
                        <div class="master-image-placeholder">
                            <img src="${master.image_placeholder}" alt="Portrait of ${master.name}">
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
            grid.appendChild(cardEl);
        });
        container.appendChild(grid);
        onMasterCardHover(); // Callback to initialize GSAP animations
    },

    // Renders the theory section
    renderTheory() {
        const container = this.elements.theoryContainer;
        container.innerHTML = `<h1 class="titulo-seccao">Teoria e Filosofia</h1>`;
        appData.THEORY_DATA.forEach(theory => {
            const cardEl = document.createElement('div');
            cardEl.className = 'floating-card';
            cardEl.innerHTML = `
                <div class="card-header">
                    <h2 class="subtitulo-seccao" style="margin:0; border:0;">${theory.title}</h2>
                </div>
                <div class="card-content card-prose">
                    ${theory.content}
                </div>
            `;
            container.appendChild(cardEl);
        });
    },

    // This is just a selection of the many rendering functions. 
    // The full ui.js file would contain all functions that create or modify HTML.
    // Examples:
    // renderProfileSection(userProfile, onSave, onEdit, onExport, onImport, onCopyId)
    // renderBeltProgression(userProfile, onPromote)
    // renderSkillLibrary(userProfile, onStartTimer)
    // etc.
};
