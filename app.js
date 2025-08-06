/**
 * app.js
 * * Este é o módulo principal da aplicação. Ele orquestra tudo:
 * - Gerencia o estado da aplicação (perfil do utilizador, timers, etc.).
 * - Contém a lógica principal (cálculo de XP, verificação de conquistas, etc.).
 * - Adiciona os event listeners para interações do utilizador.
 * - Utiliza o módulo UI para renderizar as atualizações na página.
 * - Utiliza o módulo config para aceder aos dados estáticos.
 */

import { appData } from './config.js';
import { UI } from './ui.js';

const WingChunApp = {
    // --- ESTADO DA APLICAÇÃO ---
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

    // --- DADOS E CONFIGURAÇÃO ---
    config: {}, // Será preenchido na inicialização
    onboardingData: [
        { title: "Navegação Principal", text: "Usa este menu à esquerda para navegar entre as diferentes secções da aplicação, como os teus Planos de Treino, os treinos de Skill e a progressão de Cinturões." },
        { title: "O Teu Perfil", text: "A secção 'Perfil' é o teu centro de comando. Usa as abas para ver o teu Passaporte, as tuas Estatísticas de treino e o teu Desafio Diário." },
        { title: "Planos de Treino", text: "É aqui que ganhas XP! Escolhe um plano recomendado por categoria e dificuldade, ou cria um manual. Cada plano recomendado é uma sessão de 20 minutos." }
    ],

    // --- INICIALIZAÇÃO ---
    init() {
        // Obter referências a todos os elementos do DOM
        const elements = this.queryElements();
        // Inicializar o módulo UI com essas referências
        UI.init(elements);
        
        // Carregar a configuração
        this.config = appData;
        this.config.ALL_TRAINING_ITEMS = [
            ...Object.values(this.config.WING_CHUN_TRAINING).flat(),
            ...Object.values(this.config.CONDITIONING_TRAINING).flatMap(cat => cat.items)
        ];
        this.state.selectedAvatar = this.config.AVATAR_LIST[0].id;

        // Configurar o áudio
        this.setupAudio();

        // Adicionar todos os event listeners
        this.addEventListeners();

        // Renderizar conteúdo estático que não depende do perfil
        UI.renderMasters();
        UI.renderTheory();

        // Carregar o perfil do utilizador e atualizar a UI
        this.loadProfile();
    },

    queryElements() {
        // Esta função centraliza a obtenção de todos os elementos do DOM necessários
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
            guardarPerfilBtn: document.getElementById('guardarPerfilBtn'),
            editarPerfilBtn: document.getElementById('editarPerfilBtn'),
            exportProfileBtn: document.getElementById('exportProfileBtn'),
            importProfileBtn: document.getElementById('importProfileBtn'),
            importFileInput: document.getElementById('import-file-input'),
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
            modal: document.getElementById('video-modal'),
            modalTitle: document.getElementById('modal-title'),
            modalVideoContainer: document.getElementById('modal-video-container'),
            closeModalBtn: document.querySelector('.close-modal'),
            themePickerContainer: document.getElementById('theme-picker-container'),
            // ... adicione outros elementos aqui conforme necessário
        };
    },
    
    setupAudio() {
        const startAudio = () => {
            if (Tone.context.state !== 'running') {
                Tone.start();
            }
            if (!this.state.audioSynth) {
                this.state.audioSynth = new Tone.Synth().toDestination();
                console.log("Contexto de áudio iniciado.");
            }
            document.body.removeEventListener('click', startAudio);
            document.body.removeEventListener('touchend', startAudio);
        };
        document.body.addEventListener('click', startAudio);
        document.body.addEventListener('touchend', startAudio);
    },

    addEventListeners() {
        const elements = UI.elements; // Aceder aos elementos através do módulo UI
        elements.guardarPerfilBtn.addEventListener('click', () => this.handleSaveProfile());
        elements.editarPerfilBtn.addEventListener('click', () => this.handleEditProfile());
        elements.exportProfileBtn.addEventListener('click', () => this.handleExportProfile());
        elements.importProfileBtn.addEventListener('click', () => elements.importFileInput.click());
        elements.importFileInput.addEventListener('change', (e) => this.handleImportFile(e));
        elements.studentIdDisplay.addEventListener('click', () => this.copyStudentId());

        elements.closeModalBtn.addEventListener('click', () => UI.closeModal());
        elements.modal.addEventListener('click', (event) => {
            if (event.target === elements.modal) UI.closeModal();
        });

        elements.openMenuBtn.addEventListener('click', () => UI.toggleMobileMenu(true));
        elements.closeMenuBtn.addEventListener('click', () => UI.toggleMobileMenu(false));
        elements.mobileMenuOverlay.addEventListener('click', () => UI.toggleMobileMenu(false));
    },

    // --- LÓGICA DE GESTÃO DE PERFIL ---
    loadProfile() {
        const profileData = localStorage.getItem('wingChunProfile');
        let isNewUser = false;
        if (profileData) {
            try {
                this.state.userProfile = JSON.parse(profileData);
                isNewUser = this.state.userProfile.isNew || false;
                this.ensureProfileIntegrity();
            } catch (e) {
                console.error("Erro ao carregar perfil:", e);
                localStorage.removeItem('wingChunProfile');
                this.state.userProfile = null;
            }
        }
        this.updateUI();
        
        if (isNewUser) {
            // this.startOnboarding(); // A lógica de onboarding pode ser adicionada aqui
            this.state.userProfile.isNew = false;
            this.saveProfile();
        }
    },

    saveProfile() {
        if (!this.state.userProfile) return;
        localStorage.setItem('wingChunProfile', JSON.stringify(this.state.userProfile));
        this.updateUI(); // Atualiza a UI sempre que o perfil é guardado
    },
    
    handleSaveProfile() {
        const nome = UI.elements.perfilNomeInput.value.trim();
        const altura = parseFloat(UI.elements.perfilAlturaInput.value);
        const peso = parseFloat(UI.elements.perfilPesoInput.value);

        if (!nome || !altura || !peso) { // Validação simples
            UI.showNotification("Por favor, preenche todos os campos.", "⚠️");
            return;
        }

        const imc = (peso / ((altura / 100) ** 2)).toFixed(1);

        if (!this.state.userProfile) {
            const createdAt = new Date().toISOString();
            this.state.userProfile = {
                name: nome, altura, peso, imc,
                avatar: this.state.selectedAvatar,
                xp: 0,
                unlockedBeltLevel: 0,
                achievements: [],
                streak: 0,
                daily: {},
                history: [],
                trainingStats: {},
                customPlans: [],
                createdAt: createdAt,
                studentId: `WC-${new Date(createdAt).getTime().toString(36).toUpperCase()}`,
                isNew: true,
                newContent: { skill: false, belts: false },
                theme: 'default',
                stamina: 100,
                maxStamina: 100,
                lastStaminaUpdate: createdAt,
            };
        } else {
            this.state.userProfile.name = nome;
            this.state.userProfile.altura = altura;
            this.state.userProfile.peso = peso;
            this.state.userProfile.imc = imc;
            this.state.userProfile.avatar = this.state.selectedAvatar;
        }

        this.saveProfile();
        UI.showNotification(`Perfil de ${nome} guardado!`, "✅");
    },
    
    handleEditProfile() {
        UI.showProfileForm(this.state.userProfile);
        // A lógica de popular os avatares deve ser chamada aqui
    },

    // --- LÓGICA DE NAVEGAÇÃO E ATUALIZAÇÃO DA UI ---
    handleNavigate(sectionId) {
        this.state.activeSection = sectionId;
        UI.mostrarSeccao(sectionId);
        // Adicionar lógica de atualização de conteúdo específico da secção, se necessário
    },

    updateUI() {
        if (!this.state.userProfile) {
            UI.updateUserStatus(null);
            UI.renderNavigation(null, this.state.activeSection, (id) => this.handleNavigate(id));
            UI.showProfileForm(null);
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

        UI.renderNavigation(this.state.userProfile, this.state.activeSection, (id) => this.handleNavigate(id));
        UI.updateUserStatus(this.state.userProfile, (level) => this.getBeltByLevel(level));
        UI.updatePassportView(this.state.userProfile, (level) => this.getBeltByLevel(level));
        // Chamar outras funções de renderização do UI aqui
    },

    // --- LÓGICA DE JOGO (XP, CINTURÕES, STAMINA) ---
    addXp(xpToAdd, trainingId = 'misc') {
        if (!this.state.userProfile || xpToAdd <= 0) return;
        this.state.userProfile.xp += xpToAdd;
        UI.showNotification(`+${xpToAdd} XP!`, "⭐");
        this.updateHistory(xpToAdd, trainingId);
        // this.checkAchievements(); // Adicionar lógica de conquistas
        this.saveProfile();
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
        }

        UI.updateStaminaBar(this.state.userProfile.stamina, this.state.userProfile.maxStamina);
    },
    
    getBeltByLevel(level) {
        return this.config.BELT_SYSTEM.find(b => b.level === level) || this.config.BELT_SYSTEM[0];
    },

    // --- FUNÇÕES DE UTILIDADE ---
    ensureProfileIntegrity() {
        const p = this.state.userProfile;
        if (!p.unlockedBeltLevel) p.unlockedBeltLevel = 0;
        if (!p.achievements) p.achievements = [];
        if (!p.history) p.history = [];
        if (!p.customPlans) p.customPlans = [];
        if (!p.theme) p.theme = 'default';
        if (typeof p.stamina === 'undefined') p.stamina = 100;
        if (!p.maxStamina) p.maxStamina = 100;
        if (!p.lastStaminaUpdate) p.lastStaminaUpdate = new Date().toISOString();
    },
    
    // ... Adicione o resto da sua lógica aqui (timers, planos, etc.)
    // Lembre-se de chamar as funções do UI para atualizar a vista.
};

// Iniciar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    WingChunApp.init();
});
