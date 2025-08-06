/**
 * ui.js
 * * Este módulo é responsável por toda a manipulação do DOM e renderização da interface do utilizador.
 * Ele recebe dados e callbacks do módulo principal (app.js) e atualiza a página em conformidade.
 * Não contém lógica de estado da aplicação.
 */

import { appData } from './config.js';

export const UI = {
    elements: {}, // Será preenchido pelo app.js na inicialização
    
    // Recebe as referências dos elementos do DOM do módulo principal
    init(elements) {
        this.elements = elements;
    },

    // Alterna a visibilidade das secções principais da aplicação
    mostrarSeccao(sectionId) {
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

    // Renderiza a navegação principal na barra lateral
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
        
        this.mostrarSeccao(activeSection);
    },

    // Atualiza a barra de status superior com informações do utilizador
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

    // Atualiza a barra de stamina
    updateStaminaBar(stamina, maxStamina) {
        this.elements.staminaBarText.textContent = `⚡ ${stamina} / ${maxStamina}`;
        this.elements.staminaBarFill.style.width = `${(stamina / maxStamina) * 100}%`;
    },

    // Atualiza a vista do passaporte do utilizador
    updatePassportView(userProfile, getBeltByLevel) {
        this.elements.perfilFormView.style.display = 'none';
        this.elements.perfilDashboardView.style.display = 'block';

        const currentBelt = getBeltByLevel(userProfile.unlockedBeltLevel);
        const avatar = appData.AVATAR_LIST.find(a => a.id === userProfile.avatar);
        const avatarId = avatar ? avatar.id.substring(6, 7) : "?";
        
        this.elements.passaporteAvatarDisplay.src = `https://placehold.co/150x150/2c2c2c/ecf0f1?text=${avatarId}`;
        this.elements.passaporteNomeSpan.textContent = userProfile.name;
        this.elements.passaporteBeltSpan.textContent = currentBelt.name;
        this.elements.passaportePontosSpan.textContent = userProfile.xp;
        this.elements.studentIdDisplay.textContent = userProfile.studentId;
        this.elements.passaporteAlturaSpan.textContent = userProfile.altura || 'N/A';
        this.elements.passaportePesoSpan.textContent = userProfile.peso || 'N/A';
        this.elements.passaporteImcSpan.textContent = userProfile.imc || 'N/A';
        this.elements.passaporteStreakSpan.textContent = userProfile.streak;
        this.elements.passaporteAchievementsSpan.textContent = `${userProfile.achievements.length} / ${Object.keys(appData.ACHIEVEMENTS).length}`;
    },

    // Mostra o formulário de criação/edição de perfil
    showProfileForm(userProfile) {
        if (userProfile) {
            this.elements.perfilNomeInput.value = userProfile.name;
            this.elements.perfilAlturaInput.value = userProfile.altura;
            this.elements.perfilPesoInput.value = userProfile.peso;
        }
        this.elements.perfilFormView.style.display = 'block';
        this.elements.perfilDashboardView.style.display = 'none';
    },

    // Mostra uma notificação flutuante
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

    // Abre o modal de vídeo
    openModal(title, videoUrl) {
        if (!videoUrl) {
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

    // Fecha o modal de vídeo
    closeModal() {
        this.elements.modal.style.display = 'none';
        this.elements.modalVideoContainer.innerHTML = '';
    },

    // Alterna o menu móvel
    toggleMobileMenu(show) {
        this.elements.appSidebar.classList.toggle('open', show);
        this.elements.mobileMenuOverlay.classList.toggle('visible', show);
    },
    
    // Aplica o tema de cores selecionado
    applyTheme(themeKey) {
        const theme = appData.COLOR_THEMES[themeKey] || appData.COLOR_THEMES['default'];
        document.documentElement.style.setProperty('--cor-primaria', theme.primary);
        document.documentElement.style.setProperty('--cor-secundaria', theme.secondary);
    },

    // Renderiza o seletor de temas
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

    // Renderiza os cartões de mestres
    renderMasters() {
        const container = this.elements.mastersContainer;
        container.innerHTML = '';
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
            container.appendChild(cardEl);
        });
        this.initMasterCardAnimations();
    },

    // Inicializa as animações GSAP para os cartões de mestres
    initMasterCardAnimations() {
        document.querySelectorAll('.master-flip-card').forEach(card => {
            const innerCard = card.querySelector('.master-flip-card-inner');
            gsap.set(innerCard, { rotationY: 0 });

            card.addEventListener('mouseenter', () => {
                gsap.to(innerCard, { rotationY: 180, duration: 0.7, ease: 'power3.out' });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(innerCard, { rotationY: 0, duration: 0.7, ease: 'power3.out' });
            });
        });
    },
    
    // Renderiza a secção de teoria
    renderTheory() {
        const container = this.elements.theoryContainer;
        container.innerHTML = '';
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
            container.appendChild(cardEl);
        });
    },

    // Adicione aqui outras funções de renderização que foram movidas...
    // Ex: renderBeltProgression, renderAchievements, renderDailyChallenge, etc.
    // Lembre-se de que elas devem aceitar o estado e callbacks como parâmetros.
};
