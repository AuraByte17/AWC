/**
 * app.js
 * This is the main application module. It orchestrates everything:
 * - Manages application state (user profile, timers, etc.).
 * - Contains the core logic (XP calculation, achievement checks, etc.).
 * - Adds event listeners for user interactions.
 * - Uses the UI module to render updates to the page.
 * - Uses the config module to access static data.
 */

import { appData } from './config.js';
import { UI } from './ui.js';

const WingChunApp = {
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

    // --- STATIC DATA & CONFIG ---
    config: {},
    onboardingData: [
        { title: "Navegação Principal", text: "Usa este menu à esquerda para navegar entre as diferentes secções da aplicação, como os teus Planos de Treino, os treinos de Skill e a progressão de Cinturões." },
        { title: "O Teu Perfil", text: "A secção 'Perfil' é o teu centro de comando. Usa as abas para ver o teu Passaporte, as tuas Estatísticas de treino e o teu Desafio Diário." },
        { title: "Planos de Treino", text: "É aqui que ganhas XP! Escolhe um plano recomendado por categoria e dificuldade, ou cria um manual. Cada plano recomendado é uma sessão de 20 minutos." }
    ],

    // --- INITIALIZATION ---
    init() {
        const elements = this.queryElements();
        UI.init(elements);
        
        this.config = appData;
        this.config.ALL_TRAINING_ITEMS = [
            ...Object.values(this.config.WING_CHUN_TRAINING).flat(),
            ...Object.values(this.config.CONDITIONING_TRAINING).flatMap(cat => cat.items)
        ];
        this.state.selectedAvatar = this.config.AVATAR_LIST[0].id;

        this.setupAudio();
        this.addEventListeners();
        
        UI.renderStaticContent(() => this.initMasterCardAnimations());

        this.loadProfile();
    },

    queryElements() {
        const ids = [
            'app-sidebar', 'navigation-hub', 'mobile-header', 'current-section-title', 'open-menu-btn', 'close-menu-btn', 'mobile-menu-overlay',
            'user-status-display', 'user-status-avatar', 'user-status-name', 'user-status-belt', 'user-progress-bar-text', 'user-progress-bar-fill',
            'stamina-bar-text', 'stamina-bar-fill', 'main-content-area',
            'seccao-perfil', 'seccao-planos', 'seccao-cinturoes', 'seccao-skill', 'seccao-condicionamento',
            'seccao-teoria', 'seccao-mestres', 'seccao-glossario', 'seccao-achievements',
            'video-modal', 'modal-title', 'modal-video-container',
            'plan-execution-modal', 'plan-execution-title', 'plan-execution-timer-display', 'plan-execution-progress-bar',
            'plan-execution-phase-info', 'plan-execution-current-exercise', 'stop-plan-btn',
            'onboarding-modal', 'onboarding-title', 'onboarding-text', 'onboarding-prev-btn', 'onboarding-next-btn', 'onboarding-dots',
            'notification', 'notification-icon', 'notification-text', 'import-file-input', 'theme-picker-container'
        ];
        const elements = {};
        ids.forEach(id => elements[id.replace(/-(\w)/g, (match, letter) => letter.toUpperCase())] = document.getElementById(id));
        elements.seccoes = document.querySelectorAll('.seccao');
        elements.closeModalBtn = document.querySelector('.close-modal');
        return elements;
    },
    
    setupAudio() {
        const startAudio = () => {
            if (Tone.context.state !== 'running') {
                Tone.start();
            }
            if (!this.state.audioSynth) {
                this.state.audioSynth = new Tone.Synth().toDestination();
            }
            document.body.removeEventListener('click', startAudio);
            document.body.removeEventListener('touchend', startAudio);
        };
        document.body.addEventListener('click', startAudio);
        document.body.addEventListener('touchend', startAudio);
    },

    addEventListeners() {
        UI.elements.closeModalBtn.addEventListener('click', () => UI.closeModal());
        UI.elements.videoModal.addEventListener('click', (e) => { if (e.target === UI.elements.videoModal) UI.closeModal(); });
        UI.elements.openMenuBtn.addEventListener('click', () => UI.toggleMobileMenu(true));
        UI.elements.closeMenuBtn.addEventListener('click', () => UI.toggleMobileMenu(false));
        UI.elements.mobileMenuOverlay.addEventListener('click', () => UI.toggleMobileMenu(false));
        UI.elements.onboardingNextBtn.addEventListener('click', () => this.handleOnboardingNext());
        UI.elements.onboardingPrevBtn.addEventListener('click', () => this.handleOnboardingPrev());
        UI.elements.stopPlanBtn.addEventListener('click', () => this.stopTrainingPlan(true));
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
                this.state.userProfile = null;
            }
        }
        this.updateUI();
        
        if (isNewUser) {
            this.startOnboarding();
            this.state.userProfile.isNew = false;
            this.saveProfile();
        }
    },

    saveProfile() {
        if (!this.state.userProfile) return;
        localStorage.setItem('wingChunProfile', JSON.stringify(this.state.userProfile));
        this.updateUI();
    },
    
    ensureProfileIntegrity() {
        const p = this.state.userProfile;
        p.unlockedBeltLevel = p.unlockedBeltLevel ?? 0;
        p.achievements = p.achievements ?? [];
        p.daily = p.daily ?? {};
        p.streak = p.streak ?? 0;
        p.history = p.history ?? [];
        p.trainingStats = p.trainingStats ?? {};
        p.customPlans = p.customPlans ?? [];
        p.studentId = p.studentId ?? `WC-${new Date(p.createdAt || Date.now()).getTime().toString(36).toUpperCase()}`;
        p.newContent = p.newContent ?? { skill: false, belts: false };
        p.theme = p.theme ?? 'default';
        p.stamina = p.stamina ?? 100;
        p.maxStamina = p.maxStamina ?? 100;
        p.lastStaminaUpdate = p.lastStaminaUpdate ?? new Date().toISOString();
    },

    // --- UI RENDERING ORCHESTRATION ---
    updateUI() {
        UI.renderNavigation(this.state.userProfile, this.state.activeSection, (id) => this.handleNavigate(id));

        if (!this.state.userProfile) {
            UI.updateUserStatus(null);
            if (this.state.staminaInterval) clearInterval(this.state.staminaInterval);
            this.renderSectionContent();
            return;
        } 
        
        this.updateStamina();
        if (!this.state.staminaInterval) {
            this.state.staminaInterval = setInterval(() => this.updateStamina(), 60000);
        }
        
        UI.applyTheme(this.state.userProfile.theme);
        UI.renderThemePicker(this.state.userProfile.theme, (themeKey) => {
            this.state.userProfile.theme = themeKey;
            this.saveProfile();
        });
        
        UI.updateUserStatus(this.state.userProfile, (level) => this.getBeltByLevel(level));
        this.checkDailyChallenge();
        this.renderSectionContent();
    },

    renderSectionContent() {
        // This function dynamically renders the content of the currently active section.
        // This is a more scalable approach than a giant if/else block.
        const sectionRenderers = {
            'seccao-perfil': () => this.renderProfileSection(),
            'seccao-planos': () => this.renderPlansSection(),
            'seccao-cinturoes': () => this.renderBeltProgression(),
            'seccao-skill': () => this.renderLibrary('skill'),
            'seccao-condicionamento': () => this.renderLibrary('conditioning'),
            'seccao-achievements': () => this.renderAchievements(),
            'seccao-glossario': () => this.renderGlossary(),
            // Static sections are rendered once at init
            'seccao-mestres': () => {}, 
            'seccao-teoria': () => {},
        };

        const renderFunction = sectionRenderers[this.state.activeSection];
        if (renderFunction) {
            renderFunction();
        }
    },

    handleNavigate(sectionId) {
        this.state.activeSection = sectionId;
        UI.showSection(sectionId);
        
        if (this.state.userProfile?.newContent) {
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
        
        this.renderSectionContent();
    },
    
    // --- SPECIFIC SECTION RENDERERS ---
    
    renderProfileSection() {
        const container = UI.elements.seccaoPerfil;
        if (!this.state.userProfile) {
            // Render profile creation form
            container.innerHTML = `... HTML for profile creation form ...`;
            // Add event listeners for the form
        } else {
            // Render profile dashboard with tabs
            container.innerHTML = `... HTML for profile dashboard ...`;
            // Add event listeners for tabs, buttons, etc.
        }
    },

    // ... other render functions like renderPlansSection, renderBeltProgression, etc.
    // Each function will be responsible for populating its section's innerHTML
    // and setting up the necessary event listeners for that section.
    
    // --- ANIMATIONS ---
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

    // --- GAME LOGIC (XP, STAMINA, TIMERS, etc.) ---
    getBeltByLevel(level) {
        return this.config.BELT_SYSTEM.find(b => b.level === level) || this.config.BELT_SYSTEM[0];
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
            UI.updateStaminaBar(this.state.userProfile.stamina, this.state.userProfile.maxStamina);
        }
    },

    // ... All other logic functions from the original file would go here:
    // addXp, checkAchievements, checkDailyChallenge, startTimer, stopTimer,
    // startTrainingPlan, stopTrainingPlan, handlePromotion, etc.
};

// Start the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    WingChunApp.init();
});
