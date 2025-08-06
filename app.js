/**
 * app.js
 * * This is the main "brain" of the application. It orchestrates everything.
 * It holds the application state, manages the core logic (like calculating XP,
 * saving profiles), and handles all user events. It imports data from config.js
 * and uses functions from ui.js to update the display, keeping the logic
 * separate from the presentation.
 */

import { appData } from './config.js';
import * as ui from './ui.js';

const App = {
    // --- APPLICATION STATE ---
    state: {
        userProfile: null,
        selectedAvatar: null,
        activeSection: 'seccao-perfil',
        timers: {},
        xpChart: null,
        audioSynth: null, 
        onboardingStep: 0,
        currentPlan: null, 
        staminaInterval: null,
    },
    
    onboardingData: [
        { title: "Navegação Principal", text: "Usa este menu à esquerda para navegar entre as diferentes secções da aplicação, como os teus Planos de Treino, os treinos de Skill e a progressão de Cinturões." },
        { title: "O Teu Perfil", text: "A secção 'Perfil' é o teu centro de comando. Usa as abas para ver o teu Passaporte, as tuas Estatísticas de treino e o teu Desafio Diário." },
        { title: "Planos de Treino", text: "É aqui que ganhas XP! Escolhe um plano recomendado por categoria e dificuldade, ou cria um manual. Cada plano recomendado é uma sessão de 20 minutos." }
    ],

    // --- DOM ELEMENTS CACHE ---
    elements: {},

    // --- INITIALIZATION ---
    init() {
        this.elements = ui.queryElements();
        this.state.selectedAvatar = appData.AVATAR_LIST[0].id;

        this.initAudio();
        this.addEventListeners();
        
        ui.renderStaticContent(this.elements);
        this.initMasterCardAnimations();

        this.loadProfile();
    },
    
    initAudio() {
        const startAudio = () => {
            if (typeof Tone !== 'undefined' && Tone.context.state !== 'running') {
                Tone.start();
            }
            if (!this.state.audioSynth) {
                this.state.audioSynth = new Tone.Synth().toDestination();
                console.log("Audio context started.");
            }
            document.body.removeEventListener('click', startAudio);
            document.body.removeEventListener('touchend', startAudio);
        };
        document.body.addEventListener('click', startAudio);
        document.body.addEventListener('touchend', startAudio);
    },

    // --- EVENT LISTENERS ---
    addEventListeners() {
        const els = this.elements;
        // Profile actions
        els.perfilFormView.querySelector('#guardarPerfilBtn').addEventListener('click', () => this.handleSaveProfile());
        els.perfilDashboardView.querySelector('#editarPerfilBtn').addEventListener('click', () => this.handleEditProfile());
        els.perfilDashboardView.querySelector('#exportProfileBtn').addEventListener('click', () => this.handleExportProfile());
        const importBtn = els.perfilDashboardView.querySelector('#importProfileBtn');
        const importInput = document.getElementById('import-file-input');
        importBtn.addEventListener('click', () => importInput.click());
        importInput.addEventListener('change', (e) => this.handleImportFile(e));
        
        els.studentIdDisplay.addEventListener('click', () => this.copyStudentId());

        // Plan actions
        document.getElementById('save-plan-btn').addEventListener('click', () => this.handleSaveCustomPlan());

        // Modal actions
        els.modal.querySelector('.close-modal').addEventListener('click', () => ui.closeModal(els));
        els.modal.addEventListener('click', (event) => {
            if (event.target === els.modal) ui.closeModal(els);
        });
        
        // Mobile menu
        els.openMenuBtn.addEventListener('click', () => ui.toggleMobileMenu(els, true));
        els.closeMenuBtn.addEventListener('click', () => ui.toggleMobileMenu(els, false));
        els.mobileMenuOverlay.addEventListener('click', () => ui.toggleMobileMenu(els, false));
        
        // Onboarding
        els.onboardingNextBtn.addEventListener('click', () => this.handleOnboardingNext());
        els.onboardingPrevBtn.addEventListener('click', () => this.handleOnboardingPrev());
        
        // Tabbed navigation
        els.profileTabBtns.forEach(btn => btn.addEventListener('click', () => this.handleProfileTabClick(btn.dataset.tab)));
        els.planosTabBtns.forEach(btn => btn.addEventListener('click', () => this.handlePlanosTabClick(btn.dataset.tab)));
        els.recommendedPlanCategories.addEventListener('click', (e) => {
            if (e.target.matches('.profile-tab-btn')) this.handleRecommendedCategoryClick(e.target.dataset.category);
        });
        els.glossarioTabBtns.forEach(btn => btn.addEventListener('click', () => this.handleGlossarioTabClick(btn.dataset.tab)));

        // Plan execution
        document.getElementById('stop-plan-btn').addEventListener('click', () => this.stopTrainingPlan(true));
    },

    // --- PROFILE MANAGEMENT ---
    loadProfile() {
        const profileData = localStorage.getItem('wingChunProfile');
        let isNewUser = false;
        if (profileData) {
            try {
                this.state.userProfile = JSON.parse(profileData);
                isNewUser = this.state.userProfile.isNew || false;
                this.ensureProfileIntegrity();
            } catch (e) {
                console.error("Error loading profile, data corrupted:", e);
                localStorage.removeItem('wingChunProfile');
                this.state.userProfile = null;
            }
        } else {
            this.state.userProfile = null;
        }
        
        this.fullUIUpdate();
        
        if (isNewUser) {
            this.startOnboarding();
            this.state.userProfile.isNew = false;
            this.saveProfile();
        }
    },

    saveProfile() {
        if (!this.state.userProfile) return;
        localStorage.setItem('wingChunProfile', JSON.stringify(this.state.userProfile));
        this.fullUIUpdate();
    },

    ensureProfileIntegrity() {
        const p = this.state.userProfile;
        if (!p.unlockedBeltLevel) p.unlockedBeltLevel = 0;
        if (!p.achievements) p.achievements = [];
        if (!p.daily) p.daily = {};
        if (!p.streak) p.streak = 0;
        if (!p.history) p.history = [];
        if (!p.trainingStats) p.trainingStats = {};
        if (!p.customPlans) p.customPlans = [];
        if (!p.studentId) p.studentId = `WC-${new Date(p.createdAt).getTime().toString(36).toUpperCase()}`;
        if (!p.newContent) p.newContent = { skill: false, belts: false };
        if (!p.theme) p.theme = 'default';
        if (typeof p.stamina === 'undefined') p.stamina = 100;
        if (!p.maxStamina) p.maxStamina = 100;
        if (!p.lastStaminaUpdate) p.lastStaminaUpdate = new Date().toISOString();
    },

    handleSaveProfile() {
        const nome = this.elements.perfilNomeInput.value.trim();
        const altura = parseFloat(this.elements.perfilAlturaInput.value);
        const peso = parseFloat(this.elements.perfilPesoInput.value);

        if (!nome) return ui.showNotification(this.elements, "Por favor, insere o teu nome.", "⚠️");
        if (!altura || altura < 100 || altura > 250) return ui.showNotification(this.elements, "Por favor, insere uma altura realista (100-250 cm).", "📏");
        if (!peso || peso < 30 || peso > 250) return ui.showNotification(this.elements, "Por favor, insere um peso realista (30-250 kg).", "⚖️");

        const imc = (peso / ((altura / 100) ** 2)).toFixed(1);

        if (!this.state.userProfile) {
            const createdAt = new Date().toISOString();
            this.state.userProfile = {
                name: nome, altura, peso, imc,
                avatar: this.state.selectedAvatar,
                xp: 0,
                unlockedBeltLevel: 0,
                achievements: [], streak: 0, daily: {}, history: [],
                trainingStats: {}, customPlans: [],
                createdAt,
                studentId: `WC-${new Date(createdAt).getTime().toString(36).toUpperCase()}`,
                isNew: true,
                newContent: { skill: false, belts: false },
                theme: 'default',
                stamina: 100, maxStamina: 100,
                lastStaminaUpdate: createdAt,
            };
        } else {
            this.state.userProfile.name = nome;
            this.state.userProfile.altura = altura;
            this.state.userProfile.peso = peso;
            this.state.userProfile.imc = imc;
            this.state.userProfile.avatar = this.state.selectedAvatar;
        }

        this.checkAchievements();
        this.saveProfile();
        ui.showNotification(this.elements, `Perfil de ${nome} guardado!`, "✅");
        
        if (this.state.userProfile.isNew) {
            this.loadProfile(); // Reload to trigger onboarding
        }
    },

    handleEditProfile() {
        this.elements.perfilNomeInput.value = this.state.userProfile.name;
        this.elements.perfilAlturaInput.value = this.state.userProfile.altura;
        this.elements.perfilPesoInput.value = this.state.userProfile.peso;
        this.state.selectedAvatar = this.state.userProfile.avatar;
        ui.renderAvatarChoices(this.elements, this.state.userProfile, this.state.selectedAvatar, this.handleAvatarSelect.bind(this));
        this.elements.perfilFormView.style.display = 'block';
        this.elements.perfilDashboardView.style.display = 'none';
    },

    handleExportProfile() {
        if (!this.state.userProfile) return ui.showNotification(this.elements, "Nenhum perfil para exportar.", "⚠️");
        
        const profileJson = JSON.stringify(this.state.userProfile, null, 2);
        const blob = new Blob([profileJson], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wingchun_profile.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        ui.showNotification(this.elements, "Ficheiro de perfil descarregado!", "📥");
    },

    handleImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const newProfile = JSON.parse(e.target.result);
                if (newProfile && typeof newProfile.xp === 'number' && newProfile.name) {
                    this.state.userProfile = newProfile;
                    this.ensureProfileIntegrity();
                    this.saveProfile();
                    this.loadProfile();
                    ui.showNotification(this.elements, "Perfil importado com sucesso!", "📤");
                } else {
                    ui.showNotification(this.elements, "Ficheiro de perfil inválido.", "❌");
                }
            } catch (err) {
                ui.showNotification(this.elements, "Erro ao ler o ficheiro.", "❌");
                console.error("Error parsing imported JSON: ", err);
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset input
    },

    copyStudentId() {
        navigator.clipboard.writeText(this.state.userProfile.studentId).then(() => {
            ui.showNotification(this.elements, "ID de Aluno copiado!", "📋");
        });
    },

    // --- UI & NAVIGATION HANDLERS ---
    
    fullUIUpdate() {
        if (this.state.userProfile) {
            this.updateStamina();
            if (!this.state.staminaInterval) {
                this.state.staminaInterval = setInterval(() => this.updateStamina(), 60000);
            }
            this.checkDailyChallenge();
        } else {
            if (this.state.staminaInterval) clearInterval(this.state.staminaInterval);
        }

        ui.updateUserUI(this.elements, this.state.userProfile, this.getBeltByLevel.bind(this));
        ui.renderNavigation(this.elements, this.state.userProfile, this.handleNavClick.bind(this));
        ui.showSection(this.elements, this.state.activeSection);
        this.renderAllDynamicContent();
    },

    handleNavClick(sectionId) {
        this.state.activeSection = sectionId;
        ui.showSection(this.elements, sectionId);

        if (sectionId === 'seccao-planos') {
            this.renderPlanCreator();
            this.handleRecommendedCategoryClick('conditioning');
        }
        if (sectionId === 'seccao-glossario') this.renderGlossary();
        
        if (this.state.userProfile && this.state.userProfile.newContent) {
            let needsSave = false;
            if (sectionId === 'seccao-skill' && this.state.userProfile.newContent.skill) {
                this.state.userProfile.newContent.skill = false;
                needsSave = true;
            }
            if (sectionId === 'seccao-cinturoes' && this.state.userProfile.newContent.belts) {
                this.state.userProfile.newContent.belts = false;
                needsSave = true;
            }
            if (needsSave) this.saveProfile();
        }
    },
    
    handleAvatarSelect(avatarId) {
        this.state.selectedAvatar = avatarId;
        ui.renderAvatarChoices(this.elements, this.state.userProfile, avatarId, this.handleAvatarSelect.bind(this));
    },

    handleProfileTabClick(tabId) {
        this.elements.profileTabPanes.forEach(pane => pane.classList.toggle('active', pane.id === `tab-pane-${tabId}`));
        this.elements.profileTabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
        if (tabId === 'estatisticas') this.renderStatistics();
    },

    handlePlanosTabClick(tabId) {
        this.elements.planosTabPanes.forEach(pane => pane.classList.toggle('active', pane.id === `tab-pane-${tabId}`));
        this.elements.planosTabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
    },

    handleRecommendedCategoryClick(category) {
        this.elements.recommendedPlanCategories.querySelectorAll('.profile-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });
        this.renderRecommendedPlans(category);
    },

    handleGlossarioTabClick(tabId) {
        this.elements.glossarioTabPanes.forEach(pane => pane.classList.toggle('active', pane.id === `tab-pane-${tabId}`));
        this.elements.glossarioTabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
    },

    // --- DYNAMIC CONTENT RENDERING ---

    renderAllDynamicContent() {
        if (!this.state.userProfile) {
            ui.renderAvatarChoices(this.elements, null, this.state.selectedAvatar, this.handleAvatarSelect.bind(this));
            return;
        };
        
        ui.renderAvatarChoices(this.elements, this.state.userProfile, this.state.selectedAvatar, this.handleAvatarSelect.bind(this));
        this.renderLibraryList(appData.WING_CHUN_TRAINING, this.elements.skillContainer);
        this.renderLibraryList(appData.CONDITIONING_TRAINING, this.elements.conditioningContainer, true);
        ui.renderBeltProgression(this.elements, this.state.userProfile, this.getBeltByLevel.bind(this), this.handlePromotion.bind(this));
        this.renderAchievements();
        this.renderSavedPlans();
        this.renderDailyChallenge();
        ui.renderThemePicker(this.elements, this.state.userProfile.theme, this.handleThemeSelect.bind(this));
        this.updateAllInteractiveElements();
    },

    renderLibraryList(data, container, isAccordion = false) {
        container.innerHTML = '';
        if (!this.state.userProfile) { 
            container.innerHTML = `<p>Cria um perfil para ver os exercícios.</p>`;
            return;
        }

        const createCard = (item) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'floating-card library-card zoom-on-hover';
            let buttonHTML = item.videoUrl ? `<button class="action-button watch-video-btn">Ver Vídeo</button>` : '';
            cardEl.innerHTML = `<h4>${item.title}</h4><p>${item.description}</p>${buttonHTML}`;
            if (item.videoUrl) {
                cardEl.querySelector('.watch-video-btn').addEventListener('click', () => ui.openModal(this.elements, item.title, item.videoUrl));
            }
            return cardEl;
        };

        for (const categoryName in data) {
            const categoryData = data[categoryName];
            let items = categoryData.items || categoryData;

            if (items.length === 0) continue;

            const gridEl = document.createElement('div');
            gridEl.className = 'card-grid';
            items.forEach(item => gridEl.appendChild(createCard(item)));
            
            if (isAccordion) {
                const accordionItem = document.createElement('div');
                accordionItem.className = 'conditioning-accordion-item';
                const header = document.createElement('div');
                header.className = 'conditioning-accordion-header';
                header.innerHTML = `<h2 class="subtitulo-seccao" style="border-color: ${categoryData.color};">${categoryName}</h2><span class="accordion-arrow">▶</span>`;
                header.addEventListener('click', () => accordionItem.classList.toggle('active'));
                const content = document.createElement('div');
                content.className = 'conditioning-accordion-content';
                content.appendChild(gridEl);
                accordionItem.append(header, content);
                container.appendChild(accordionItem);
            } else {
                const categoryEl = document.createElement('div');
                categoryEl.className = 'training-category';
                const subtitle = document.createElement('h2');
                subtitle.className = 'subtitulo-seccao';
                subtitle.textContent = categoryName;
                categoryEl.append(subtitle, gridEl);
                container.appendChild(categoryEl);
            }
        }
    },

    renderPlanCreator() {
        const container = this.elements.planExerciseSelection;
        container.innerHTML = '';
        if (!this.state.userProfile) return;
        const unlockedItems = appData.ALL_TRAINING_ITEMS.filter(item => item.requiredBelt <= this.state.userProfile.unlockedBeltLevel);
        
        unlockedItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'exercise-selection-item';
            div.innerHTML = `
                <input type="checkbox" id="check-${item.id}" value="${item.id}">
                <label for="check-${item.id}">${item.title}</label>
                <input type="number" class="plan-duration-input" placeholder="secs" value="${item.duration}" data-id="${item.id}">
            `;
            container.appendChild(div);
        });
    },

    renderSavedPlans() {
        const container = this.elements.plansContainer;
        container.innerHTML = '';
        if (!this.state.userProfile || this.state.userProfile.customPlans.length === 0) {
            container.innerHTML = "<p>Ainda não criaste nenhum plano de treino manual.</p>";
            return;
        }

        this.state.userProfile.customPlans.forEach(plan => {
            const cardEl = this.createPlanCard(plan, true);
            container.appendChild(cardEl);
        });
    },

    renderRecommendedPlans(category = 'conditioning') {
        const container = this.elements.recommendedPlansContainer;
        container.innerHTML = '';
        if (!this.state.userProfile) return;

        const plansByDifficulty = appData.RECOMMENDED_PLANS[category];
        if (!plansByDifficulty) {
            container.innerHTML = "<p>Nenhuma plano disponível nesta categoria.</p>";
            return;
        }

        const difficultyLevels = ['beginner', 'intermediate', 'advanced'];
        const difficultyLabels = { beginner: 'Iniciante', intermediate: 'Intermédio', advanced: 'Avançado' };

        difficultyLevels.forEach(level => {
            const plans = plansByDifficulty[level];
            if (plans && plans.length > 0) {
                const levelContainer = document.createElement('div');
                levelContainer.innerHTML = `<h2 class="subtitulo-seccao">${difficultyLabels[level]}</h2>`;
                const gridEl = document.createElement('div');
                gridEl.className = 'card-grid';

                plans.forEach(plan => {
                    const cardEl = this.createPlanCard(plan);
                    gridEl.appendChild(cardEl);
                });
                levelContainer.appendChild(gridEl);
                container.appendChild(levelContainer);
            }
        });
    },

    createPlanCard(plan, isCustom = false) {
        const cardEl = document.createElement('div');
        cardEl.className = 'floating-card saved-plan-card zoom-on-hover';

        let exercisesHTML = '<div class="plan-details">';
        let totalDuration = 0;
        let totalStaminaCost = 0;

        if (isCustom) {
            exercisesHTML += '<ul class="plan-exercises-list">';
            plan.exercises.forEach(ex => {
                const exercise = appData.ALL_TRAINING_ITEMS.find(e => e.id === ex.id);
                if (exercise) {
                    exercisesHTML += `<li>${exercise.title} (${ex.duration}s)</li>`;
                    totalDuration += ex.duration;
                    totalStaminaCost += exercise.staminaCost || 0;
                }
            });
            exercisesHTML += '</ul>';
        } else {
            exercisesHTML += '<div class="plan-phases">';
            const phases = { warmup: { label: 'Aquecimento', icon: '🔥' }, main: { label: 'Treino Principal', icon: '💪' }, cooldown: { label: 'Alongamento', icon: '🧘' } };
            
            Object.keys(phases).forEach(phaseKey => {
                if (plan.phases[phaseKey] && plan.phases[phaseKey].length > 0) {
                    exercisesHTML += `<h4>${phases[phaseKey].icon} ${phases[phaseKey].label}</h4>`;
                    exercisesHTML += '<ul class="plan-exercises-list">';
                    plan.phases[phaseKey].forEach(ex => {
                        const exercise = appData.ALL_TRAINING_ITEMS.find(e => e.id === ex.id);
                        if (exercise) exercisesHTML += `<li>${exercise.title} (${ex.duration}s)</li>`;
                    });
                    exercisesHTML += '</ul>';
                }
            });
            exercisesHTML += '</div>';
            totalDuration = plan.totalDuration;
            totalStaminaCost = plan.staminaCost;
        }
        exercisesHTML += '</div>';

        const durationMinutes = Math.round(totalDuration / 60);
        const buttonText = `Iniciar (${durationMinutes} min)`;
        const isEnabled = this.state.userProfile.stamina >= totalStaminaCost;

        cardEl.innerHTML = `
            <div class="card-header"><h3 class="subtitulo-seccao" style="margin:0; border:0; font-size: 1.5rem;">${plan.name}</h3></div>
            <div class="card-content">
                ${exercisesHTML}
                <div class="plan-cost"><span>⭐ ${plan.xpAwarded || 'Variável'} XP</span> | <span>⚡ ${totalStaminaCost} Energia</span></div>
                <div class="plan-card-footer"><button class="action-button start-plan-btn" data-stamina-cost="${totalStaminaCost}" ${!isEnabled ? 'disabled' : ''}>${buttonText}</button></div>
            </div>
        `;
        cardEl.querySelector('.start-plan-btn').addEventListener('click', () => this.startTrainingPlan(plan));
        return cardEl;
    },

    renderDailyChallenge() {
        const container = this.elements.dailyChallengeCard;
        if (!this.state.userProfile || !this.state.userProfile.daily || !this.state.userProfile.daily.challenge) {
            container.innerHTML = `<p>Nenhum desafio disponível. Aumenta de nível para desbloquear mais treinos!</p>`;
            return;
        }
        const { challenge, completed } = this.state.userProfile.daily;
        
        if(completed){
            container.innerHTML = `<div class="streak-counter">🔥 ${this.state.userProfile.streak} Dias de Sequência</div><h3>Desafio Concluído!</h3><p>Já completaste o desafio de hoje. Volta amanhã para um novo!</p>`;
            return;
        }
        
        const cardEl = ui.createTimerCard(challenge, this.startTimer.bind(this), this.stopTimer.bind(this), (title, url) => ui.openModal(this.elements, title, url));
        container.innerHTML = '';
        container.appendChild(cardEl);
    },

    renderAchievements() {
        const grid = this.elements.achievementsGrid;
        grid.innerHTML = '';
        if (!this.state.userProfile) return;
        
        const unlockedAchievements = this.state.userProfile.achievements;

        if (unlockedAchievements.length === 0) {
            grid.innerHTML = `<p>Ainda não desbloqueaste nenhuma conquista. Continua a treinar!</p>`;
            return;
        }

        unlockedAchievements.forEach(key => {
            const ach = appData.ACHIEVEMENTS[key];
            if (ach) {
                const badgeEl = document.createElement('div');
                badgeEl.className = `achievement-badge unlocked zoom-on-hover`;
                badgeEl.innerHTML = `<div class="icon">${ach.icon}</div><h4>${ach.title}</h4><p>${ach.desc}</p>`;
                grid.appendChild(badgeEl);
            }
        });
    },

    renderStatistics() {
        if (!this.state.userProfile) return;

        this.elements.statTotalXp.textContent = this.state.userProfile.xp;
        
        const totalSeconds = Object.values(this.state.userProfile.trainingStats).reduce((acc, val) => acc + val.totalDuration, 0);
        this.elements.statTotalTime.textContent = `${Math.round(totalSeconds / 60)}m`;

        const trainingKeys = Object.keys(this.state.userProfile.trainingStats);
        let favExerciseId = null;
        if (trainingKeys.length > 0) {
            favExerciseId = trainingKeys.reduce((a, b) => this.state.userProfile.trainingStats[a].count > this.state.userProfile.trainingStats[b].count ? a : b);
        }
        const favExercise = favExerciseId ? appData.ALL_TRAINING_ITEMS.find(e => e.id === favExerciseId) : null;
        this.elements.statFavExercise.textContent = favExercise ? favExercise.title : '-';

        const labels = [];
        const data = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            labels.push(date.toLocaleDateString('pt-PT', { weekday: 'short' }));
            const historyEntry = this.state.userProfile.history.find(h => h.date === dateString);
            data.push(historyEntry ? historyEntry.xpGained : 0);
        }

        if (this.state.xpChart) this.state.xpChart.destroy();

        this.state.xpChart = new Chart(this.elements.xpChartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'XP Ganhos por Dia',
                    data: data,
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--cor-primaria'),
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--cor-secundaria'),
                    borderWidth: 2,
                    borderRadius: 5,
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false }, title: { display: true, text: 'Progresso nos Últimos 7 Dias', color: '#f0f0f0', font: { size: 16 } } },
                scales: { y: { beginAtZero: true, grid: { color: '#444' }, ticks: { color: '#a0a0a0' } }, x: { grid: { display: false }, ticks: { color: '#a0a0a0' } } }
            }
        });
    },

    renderGlossary() {
        if (!this.state.userProfile) return;
        const currentBeltLevel = this.state.userProfile.unlockedBeltLevel;
        
        const renderContent = (container, showAll) => {
            container.innerHTML = '';
            for (const category in appData.GLOSSARY_DATA) {
                const unlockedTerms = appData.GLOSSARY_DATA[category].filter(term => term.requiredBelt <= currentBeltLevel);
                
                if (unlockedTerms.length > 0) {
                    const termsToShow = showAll ? unlockedTerms : unlockedTerms.filter(term => term.requiredBelt === currentBeltLevel);
                    if (termsToShow.length > 0) {
                        const categoryTitle = document.createElement('h2');
                        categoryTitle.className = 'subtitulo-seccao';
                        categoryTitle.textContent = category;
                        container.appendChild(categoryTitle);

                        termsToShow.forEach(item => {
                            const entryEl = document.createElement('div');
                            entryEl.className = 'guide-entry';
                            let headerHTML = `<h3>${item.term}</h3>`;
                            if (showAll) {
                                const beltColor = this.getBeltByLevel(item.requiredBelt).color;
                                headerHTML = `<div class="term-header"><span class="belt-dot" style="background-color: ${beltColor};"></span><h3>${item.term}</h3></div>`;
                            }
                            entryEl.innerHTML = `${headerHTML}<p>${item.definition}</p>`;
                            container.appendChild(entryEl);
                        });
                    }
                }
            }
        };

        renderContent(this.elements.glossaryContainerCinto, false);
        renderContent(this.elements.glossaryContainerGlobal, true);
    },

    renderThemePicker() {
        ui.renderThemePicker(this.elements, this.state.userProfile.theme, this.handleThemeSelect.bind(this));
    },

    // --- GAME LOGIC (XP, STAMINA, ACHIEVEMENTS, PLANS) ---
    
    addXp(xpToAdd, trainingId = 'misc') {
        if(!this.state.userProfile || xpToAdd <= 0) return;
        this.state.userProfile.xp += xpToAdd;
        ui.showNotification(this.elements, `+${xpToAdd} XP!`, "⭐");
        this.updateHistory(xpToAdd, trainingId);
        this.checkAchievements();
        this.saveProfile();
    },
    
    updateHistory(xpGained, trainingId) {
        const today = new Date().toISOString().split('T')[0];
        let todayHistory = this.state.userProfile.history.find(h => h.date === today);
        if (todayHistory) {
            todayHistory.xpGained += xpGained;
        } else {
            this.state.userProfile.history.push({ date: today, xpGained });
        }

        if (trainingId) {
            if (!this.state.userProfile.trainingStats[trainingId]) {
                this.state.userProfile.trainingStats[trainingId] = { count: 0, totalDuration: 0 };
            }
            this.state.userProfile.trainingStats[trainingId].count++;
        }
    },
    
    updateStamina() {
        if (!this.state.userProfile) return;

        const now = new Date();
        const lastUpdate = new Date(this.state.userProfile.lastStaminaUpdate);
        const diffMins = Math.floor((now - lastUpdate) / 60000);

        const REGEN_RATE = 1;
        const REGEN_INTERVAL_MINS = 5;

        if (diffMins >= REGEN_INTERVAL_MINS) {
            const staminaToRegen = Math.floor(diffMins / REGEN_INTERVAL_MINS) * REGEN_RATE;
            this.state.userProfile.stamina = Math.min(this.state.userProfile.maxStamina, this.state.userProfile.stamina + staminaToRegen);
            this.state.userProfile.lastStaminaUpdate = new Date().toISOString();
            this.saveProfile();
        } else {
            ui.updateStaminaUI(this.elements, this.state.userProfile.stamina, this.state.userProfile.maxStamina);
            this.updateAllInteractiveElements();
        }
    },

    updateAllInteractiveElements() {
        document.querySelectorAll('.start-plan-btn, .start-timer-btn').forEach(btn => {
            const cost = parseInt(btn.dataset.staminaCost, 10);
            if (!isNaN(cost)) {
                btn.disabled = this.state.userProfile.stamina < cost;
            }
        });
    },

    checkAchievements() {
        if (!this.state.userProfile) return false;
        // This is a placeholder for the actual achievement logic from the original file
        return false;
    },

    checkDailyChallenge() {
        if (!this.state.userProfile) return;
        const today = new Date().toISOString().split('T')[0];
        let needsSave = false;

        if (!this.state.userProfile.daily || this.state.userProfile.daily.date !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (this.state.userProfile.daily && this.state.userProfile.daily.date === yesterdayStr && !this.state.userProfile.daily.completed) {
                this.state.userProfile.streak = 0;
            }

            const currentBeltLevel = this.state.userProfile.unlockedBeltLevel;
            const availableChallenges = appData.ALL_TRAINING_ITEMS.filter(item => item.requiredBelt <= currentBeltLevel && item.xp > 0);
            const randomChallenge = availableChallenges.length > 0 ? availableChallenges[Math.floor(Math.random() * availableChallenges.length)] : null;

            this.state.userProfile.daily = {
                date: today,
                challenge: randomChallenge,
                completed: false
            };
            needsSave = true;
        }
        if (needsSave) this.saveProfile();
    },

    handleSaveCustomPlan() {
        const name = this.elements.planNameInput.value.trim();
        if (!name) return ui.showNotification(this.elements, "Por favor, dá um nome ao teu plano.", "⚠️");
        
        const selectedExercises = [];
        this.elements.planExerciseSelection.querySelectorAll('input[type="checkbox"]:checked').forEach(input => {
            const id = input.value;
            const durationInput = this.elements.planExerciseSelection.querySelector(`.plan-duration-input[data-id="${id}"]`);
            const duration = parseInt(durationInput.value, 10) || appData.ALL_TRAINING_ITEMS.find(ex => ex.id === id).duration;
            selectedExercises.push({ id, duration });
        });

        if (selectedExercises.length === 0) return ui.showNotification(this.elements, "Seleciona pelo menos um exercício.", "⚠️");

        this.state.userProfile.customPlans.push({ id: `plan_${Date.now()}`, name, exercises: selectedExercises });
        this.saveProfile();
        this.elements.planNameInput.value = '';
        this.elements.planExerciseSelection.querySelectorAll('input:checked').forEach(input => input.checked = false);
        ui.showNotification(this.elements, "Plano guardado!", "✅");
    },
    
    async handlePromotion(beltLevel, code) {
        const belt = this.getBeltByLevel(beltLevel);
        if (!belt) return;

        const correctCode = await this.generateCode(this.state.userProfile.studentId, beltLevel);
        
        if (code.trim().toUpperCase() === correctCode.toUpperCase()) {
            this.state.userProfile.unlockedBeltLevel = beltLevel;
            this.state.userProfile.newContent = { skill: true, belts: true };
            ui.showNotification(this.elements, `Promovido a ${belt.name}!`, '🎉');
            this.saveProfile();
        } else {
            ui.showNotification(this.elements, "Código incorreto.", "❌");
        }
    },
    
    async generateCode(studentId, beltLevel) {
        const data = `${studentId.toUpperCase()}-${beltLevel}-${appData.MASTER_SECRET_KEY}`;
        const encoder = new TextEncoder();
        const dataBuffer = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 8).toUpperCase();
    },

    handleThemeSelect(themeKey) {
        this.state.userProfile.theme = themeKey;
        this.saveProfile();
    },

    // --- TIMERS & TRAINING PLANS ---

    startTimer(item, duration) {
        if (this.state.userProfile.stamina < item.staminaCost) return ui.showNotification(this.elements, "Energia insuficiente!", "⚡");
        
        const timerId = item.id;
        if (this.state.timers[timerId] || !this.state.audioSynth) return;
        
        this.state.userProfile.stamina -= item.staminaCost;
        this.saveProfile();
        this.state.audioSynth.triggerAttackRelease('C5', '8n', Tone.now());

        const cardEl = document.getElementById(`timer-card-${timerId}`);
        cardEl.querySelector('.start-timer-btn').style.display = 'none';
        cardEl.querySelector('.stop-timer-btn').style.display = 'inline-block';
        ui.setTimerProgress(cardEl, 0);

        let secondsElapsed = 0;
        const interval = setInterval(() => {
            secondsElapsed++;
            const minutes = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
            const remainingSeconds = (secondsElapsed % 60).toString().padStart(2, '0');
            cardEl.querySelector('.timer-display').textContent = `${minutes}:${remainingSeconds}`;
            ui.setTimerProgress(cardEl, (secondsElapsed / duration) * 100);

            if (secondsElapsed >= duration) {
                this.addXp(item.xp, item.id);
                if(this.state.audioSynth) this.state.audioSynth.triggerAttackRelease('G5', '4n', Tone.now());
                this.stopTimer(item, false, duration);
            }
        }, 1000);

        this.state.timers[timerId] = { interval, startTime: Date.now() };
    },

    stopTimer(item, userCancelled = true, duration) {
        const timerId = item.id;
        const timer = this.state.timers[timerId];
        if (!timer) return;

        if(this.state.audioSynth && userCancelled) this.state.audioSynth.triggerAttackRelease('C4', '8n', Tone.now());
        clearInterval(timer.interval);
        
        const durationSeconds = Math.round((Date.now() - timer.startTime) / 1000);
        
        if (userCancelled) {
            this.addXp(Math.round(item.xp * (durationSeconds / duration) * 0.5), item.id); // Prorated XP on cancel
        }
        
        if (!this.state.userProfile.trainingStats[item.id]) {
            this.state.userProfile.trainingStats[item.id] = { count: 0, totalDuration: 0 };
        }
        this.state.userProfile.trainingStats[item.id].totalDuration += durationSeconds;
        this.saveProfile();

        delete this.state.timers[timerId];
        ui.resetTimerCard(timerId);
        if (userCancelled) ui.showNotification(this.elements, "Treino interrompido.", "❌");
    },

    startTrainingPlan(plan) {
        // Implementation for starting a full training plan
    },

    stopTrainingPlan(userCancelled = false) {
        // Implementation for stopping a full training plan
    },
    
    // --- UTILITY ---
    getBeltByLevel(level) {
        return appData.BELT_SYSTEM.find(b => b.level === level) || appData.BELT_SYSTEM[0];
    },

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

    // --- ONBOARDING ---
    startOnboarding() {
        this.state.onboardingStep = 0;
        this.elements.onboardingModal.style.display = 'flex';
        this.renderOnboardingStep();
    },

    renderOnboardingStep() {
        const stepData = this.onboardingData[this.state.onboardingStep];
        this.elements.onboardingTitle.textContent = stepData.title;
        this.elements.onboardingText.textContent = stepData.text;

        this.elements.onboardingPrevBtn.style.visibility = this.state.onboardingStep === 0 ? 'hidden' : 'visible';
        this.elements.onboardingNextBtn.textContent = this.state.onboardingStep === this.onboardingData.length - 1 ? 'Terminar' : 'Próximo';
        
        this.elements.onboardingDots.innerHTML = '';
        for (let i = 0; i < this.onboardingData.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'onboarding-dot';
            if (i === this.state.onboardingStep) dot.classList.add('active');
            this.elements.onboardingDots.appendChild(dot);
        }
    },

    handleOnboardingNext() {
        if (this.state.onboardingStep < this.onboardingData.length - 1) {
            this.state.onboardingStep++;
            this.renderOnboardingStep();
        } else {
            this.elements.onboardingModal.style.display = 'none';
        }
    },

    handleOnboardingPrev() {
        if (this.state.onboardingStep > 0) {
            this.state.onboardingStep--;
            this.renderOnboardingStep();
        }
    },
};

// --- APP ENTRY POINT ---
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
