/**
 * config.js
 * * Este módulo contém todos os dados estáticos e de configuração para a aplicação Wing Chun.
 * Separar os dados da lógica torna a aplicação mais fácil de manter e atualizar.
 */

const appData = {
    NAV_ITEMS: [
        { id: 'seccao-perfil', icon: '👤', text: 'Perfil' },
        { id: 'seccao-planos', icon: '📋', text: 'Planos de Treino' },
        { id: 'seccao-cinturoes', icon: '🏆', text: 'Cinturões' },
        { id: 'seccao-skill', icon: '🥋', text: 'Skill' },
        { id: 'seccao-condicionamento', icon: '💪', text: 'Condicionamento' },
        { id: 'seccao-teoria', icon: '📜', text: 'Teoria e Filosofia' },
        { id: 'seccao-mestres', icon: '👴', text: 'Mestres' },
        { id: 'seccao-glossario', icon: '📚', text: 'Glossário' },
        { id: 'seccao-achievements', icon: '🏅', text: 'Conquistas' },
    ],
    COLOR_THEMES: {
        'default': { name: 'Clássico', primary: '#e67e22', secondary: '#d35400' },
        'forest': { name: 'Floresta', primary: '#2ecc71', secondary: '#27ae60' },
        'ocean': { name: 'Oceano', primary: '#3498db', secondary: '#2980b9' },
        'fire': { name: 'Fogo', primary: '#e74c3c', secondary: '#c0392b' },
        'royal': { name: 'Real', primary: '#9b59b6', secondary: '#8e44ad' },
    },
    BELT_SYSTEM: [
        { level: 0, name: "Cinturão Branco", minXp: 0, color: "#ecf0f1", secondaryColor: "#bdc3c7" },
        { level: 1, name: "Cinturão Amarelo", minXp: 2000, color: "#f1c40f", secondaryColor: "#f39c12" },
        { level: 2, name: "Cinturão Laranja", minXp: 6000, color: "#e67e22", secondaryColor: "#d35400" },
        { level: 3, name: "Cinturão Vermelho", minXp: 15000, color: "#e74c3c", secondaryColor: "#c0392b" },
        { level: 4, name: "Cinturão Verde", minXp: 25000, color: "#2ecc71", secondaryColor: "#27ae60" },
        { level: 5, name: "Cinturão Castanho", minXp: 40000, color: "#a1662f", secondaryColor: "#6d4c41" },
        { level: 6, name: "Cinturão Preto", minXp: 60000, color: "#2c3e50", secondaryColor: "#000000" },
    ],
    WING_CHUN_TRAINING: {
        "Técnicas Fundamentais": [
            { id: "wc_yat_chi_kuen", title: "Soco em Cadeia (Yat Chi Kuen)", description: "Praticar o soco vertical, focando na estrutura e relaxamento.", xp: 40, duration: 60, requiredBelt: 0, staminaCost: 8, difficulty: 'Essencial', videoUrl: "https://www.youtube.com/embed/xYe-8iho2tE" },
            { id: "wc_tan_sao", title: "Tan Sao (攤手)", description: "A 'Mão que Espalha'. Uma defesa com a palma para cima para controlar o cotovelo.", xp: 50, duration: 60, requiredBelt: 1, staminaCost: 10, difficulty: 'Fundamental', videoUrl: "https://www.youtube.com/embed/YpnbA5gJgX4" },
            { id: "wc_pak_sao", title: "Pack Sao (拍手)", description: "A 'Mão Palmada'. Uma defesa de desvio rápido para limpar o caminho.", xp: 50, duration: 60, requiredBelt: 1, staminaCost: 10, difficulty: 'Fundamental', videoUrl: "https://www.youtube.com/embed/s2ECoPcsbvo" },
            { id: "wc_bong_sao", title: "Bong Sao (膀手)", description: "O 'Braço-Asa'. Uma defesa angular para redirecionar a força do oponente.", xp: 70, duration: 75, requiredBelt: 2, staminaCost: 15, difficulty: 'Intermédio', videoUrl: "https://www.youtube.com/embed/13sSj8qBF9M" },
            { id: "wc_lap_sao", title: "Lap Sao (拉手)", description: "A 'Mão que Puxa'. Uma técnica para quebrar a estrutura do oponente, puxando-o.", xp: 70, duration: 60, requiredBelt: 2, staminaCost: 15, difficulty: 'Fundamental', videoUrl: "https://www.youtube.com/embed/G6nAV-nB6-A" },
        ],
        "Siu Nim Tao - Primeira Forma": [
            { id: "wc_snt_full", title: "Siu Nim Tao (Forma Completa)", description: "A 'Pequena Ideia'. Pratique a forma completa para internalizar os movimentos.", xp: 150, duration: 180, requiredBelt: 1, staminaCost: 25, difficulty: 'Fundamental', videoUrl: "https://www.youtube.com/embed/p9sL4tM4-mY" },
            { id: "wc_wu_sao_fook_sao", title: "Wu Sao / Fook Sao", description: "Prática da Mão que Protege e da Mão que Controla, essenciais para a defesa.", xp: 40, duration: 90, requiredBelt: 1, staminaCost: 8 },
            { id: "wc_gum_sao", title: "Gum Sao (Mão que Pressiona)", description: "Prática da Mão que Pressiona, usada para controlar a linha inferior.", xp: 40, duration: 60, requiredBelt: 1, staminaCost: 8 },
            { id: "wc_lan_sao_fack_sao", title: "Lan Sao / Fack Sao", description: "Prática da Mão Barreira e da Mão Chicote, combinando bloqueio e ataque.", xp: 50, duration: 75, requiredBelt: 1, staminaCost: 10 },
            { id: "wc_jam_sao", title: "Jam Sao (Mão que Corta)", description: "Prática da Mão que Corta, uma defesa curta e descendente.", xp: 40, duration: 60, requiredBelt: 1, staminaCost: 8 },
            { id: "wc_gaun_sao", title: "Gaun Sao (Mão que Cultiva)", description: "Prática da Mão que Cultiva, um bloqueio circular para redirecionar energia.", xp: 50, duration: 75, requiredBelt: 1, staminaCost: 10 },
        ],
        "Trabalho de Pés (Bo Faat)": [
            { id: "wc_seung_ma", title: "Seung Ma (Passo a Avançar)", description: "O passo de avanço fundamental, mantendo o peso na perna de trás para mobilidade.", xp: 60, duration: 90, requiredBelt: 2, staminaCost: 12, difficulty: 'Intermédio', videoUrl: "https://www.youtube.com/embed/JFv4fQ57Guo" },
            { id: "wc_hau_ma", title: "Hau Ma (Passo a Recuar)", description: "O passo de recuo para controlar a distância e absorver a pressão do oponente.", xp: 60, duration: 90, requiredBelt: 2, staminaCost: 12, difficulty: 'Intermédio', videoUrl: "https://www.youtube.com/embed/zWBMFx-EZMk" },
        ],
        "Exercícios de Sensibilidade": [
            { id: "wc_man_sao", title: "Man Sao (Mão Inquisitiva)", description: "A 'Mão que Pergunta'. Usada para testar e controlar a distância e as reações do oponente.", xp: 80, duration: 120, requiredBelt: 2, staminaCost: 18 },
            { id: "wc_dan_chi", title: "Dan Chi Sao (單黐手)", description: "O 'Braço Colado Único'. Desenvolve a sensibilidade.", xp: 100, duration: 120, requiredBelt: 1, staminaCost: 20, difficulty: 'Iniciante', videoUrl: "https://www.youtube.com/embed/0Ie5sHNUjX4" },
            { id: "wc_look_sao", title: "Look Sao (碌手)", description: "Os 'Braços que Enrolam'. Treina a fluidez.", xp: 100, duration: 120, requiredBelt: 1, staminaCost: 20, difficulty: 'Intermédio', videoUrl: "https://www.youtube.com/embed/42N52I1e_O8" },
            { id: "wc_chi_sao", title: "Chi Sao (黐手)", description: "Os 'Braços Colados'. O coração do Wing Chun.", xp: 180, duration: 180, requiredBelt: 2, staminaCost: 35, difficulty: 'Intermédio', videoUrl: "https://www.youtube.com/embed/LAAaE6o_pI4" },
        ],
        "Formas (Avançadas)": [
            { id: "wc_ck", title: "Cham Kiu (尋橋)", description: "A 'Ponte que Procura'. Introduz o trabalho de pés e rotação.", xp: 400, duration: 300, requiredBelt: 2, staminaCost: 50, difficulty: 'Intermédio', videoUrl: "https://www.youtube.com/embed/SOes8aD2kGg" },
            { id: "wc_bj", title: "Biu Jee (鏢指)", description: "Os 'Dedos que Furam'. Técnicas de emergência.", xp: 700, duration: 300, requiredBelt: 3, staminaCost: 60, difficulty: 'Avançado', videoUrl: "https://www.youtube.com/embed/mR5p0nQG34A" },
        ],
        "Armas": [
            { id: "wc_myj", title: "Muk Yan Jong (木人樁)", description: "O 'Homem de Madeira'. Refina ângulos e posições.", xp: 500, duration: 300, requiredBelt: 4, staminaCost: 70, difficulty: 'Avançado', videoUrl: "https://www.youtube.com/embed/vYe1M0h33vA" },
            { id: "wc_ldbk", title: "Luk Dim Boon Kwan (六點半棍)", description: "O 'Bastão de Seis Pontos e Meio'. Desenvolve força e precisão.", xp: 800, duration: 300, requiredBelt: 5, staminaCost: 80, difficulty: 'Mestria', videoUrl: "https://www.youtube.com/embed/VqV-JdGzBg4" },
            { id: "wc_bjd", title: "Baat Jaam Do (八斬刀)", description: "As 'Facas de Oito Cortes'. A extensão máxima das mãos.", xp: 900, duration: 300, requiredBelt: 6, staminaCost: 90, difficulty: 'Mestria', videoUrl: "https://www.youtube.com/embed/QdYQY-F4o_Y" },
        ]
    },
    CONDITIONING_TRAINING: {
        "Aquecimento e Mobilidade": {
            color: "#f1c40f",
            items: [
                { id: "warmup_arm_circles_fwd", title: "Rotação de Braços (Frente)", description: "Gire os braços para a frente em círculos largos para aquecer os ombros.", duration: 30, xp: 0, staminaCost: 0 },
                { id: "warmup_arm_circles_back", title: "Rotação de Braços (Trás)", description: "Gire os braços para trás para melhorar a mobilidade da articulação do ombro.", duration: 30, xp: 0, staminaCost: 0 },
                { id: "warmup_arm_crosses", title: "Cruzar Braços", description: "Cruze os braços à frente do peito de forma alternada para alongar o peito e as costas.", duration: 30, xp: 0, staminaCost: 0 },
                { id: "warmup_torso_twists", title: "Rotação do Tronco", description: "Gire o tronco de um lado para o outro para aquecer o core e a zona lombar.", duration: 45, xp: 0, staminaCost: 0 },
                { id: "warmup_hip_circles", title: "Rotação da Anca", description: "Faça círculos largos com a anca para lubrificar a articulação.", duration: 45, xp: 0, staminaCost: 0 },
                { id: "warmup_knee_circles", title: "Rotação dos Joelhos", description: "Com os joelhos juntos, faça pequenos círculos para aquecer as articulações.", duration: 30, xp: 0, staminaCost: 0 },
                { id: "warmup_leg_swings_fwd", title: "Oscilação de Perna (Frente)", description: "Balance a perna para a frente e para trás para alongar dinamicamente os isquiotibiais.", duration: 30, xp: 0, staminaCost: 0 },
                { id: "warmup_leg_swings_side", title: "Abertura da Anca", description: "Balance a perna para o lado e através do corpo para abrir a anca.", duration: 30, xp: 0, staminaCost: 0 },
                { id: "warmup_high_knees", title: "Joelhos ao Peito", description: "Corra no lugar, elevando os joelhos o mais alto possível.", duration: 45, xp: 0, staminaCost: 0 },
                { id: "warmup_bodyweight_squats", title: "Agachamentos Livres", description: "Faça agachamentos com o peso do corpo para ativar as pernas e os glúteos.", duration: 60, xp: 0, staminaCost: 0 },
            ]
        },
         "Membros Superiores": {
            color: "#e74c3c",
            items: [
                { id: "c3", title: "Flexões Wing Chun", description: "Flexões com os cotovelos junto ao corpo para fortalecer o tricípite.", requiredBelt: 1, difficulty: 'Iniciante', videoUrl: "https://www.youtube.com/embed/b5f3d_K1aG8", type: 'incremental', duration: 60, xp: 50, staminaCost: 10 },
                { id: "c5", title: "Treino com Saco de Parede", description: "Condicionar os punhos e desenvolver força de impacto.", requiredBelt: 2, difficulty: 'Intermédio', type: 'incremental', duration: 60, xp: 60, staminaCost: 12, videoUrl: "https://www.youtube.com/embed/example" },
            ]
        },
        "Core e Postura": {
            color: "#3498db",
            items: [
                { id: "c1", title: "Postura (Yee Jee Kim Yeung Ma)", description: "Manter a postura base. Foco na estrutura, relaxamento e enraizamento.", requiredBelt: 0, difficulty: 'Essencial', type: 'incremental', duration: 120, xp: 80, staminaCost: 15, videoUrl: "https://www.youtube.com/embed/example" },
            ]
        },
        "Membros Inferiores": {
            color: "#2ecc71",
            items: [
                 { id: "c4", title: "Agachamentos", description: "Desenvolve a força das pernas para uma postura estável.", requiredBelt: 0, difficulty: 'Iniciante', videoUrl: "https://www.youtube.com/embed/Mls-zIq3hL0", type: 'incremental', duration: 60, xp: 40, staminaCost: 8 },
            ]
        }
    },
    RECOMMENDED_PLANS: {
        conditioning: {
            beginner: [
                {
                    id: 'rec_cond_beg_1',
                    name: "Condicionamento Essencial",
                    totalDuration: 1200, // 20 minutos
                    xpAwarded: 800,
                    staminaCost: 50,
                    phases: {
                        warmup: [ { id: 'warmup_arm_circles_fwd', duration: 30 }, { id: 'warmup_torso_twists', duration: 45 }, { id: 'warmup_leg_swings_fwd', duration: 45 }, { id: 'warmup_bodyweight_squats', duration: 60 } ],
                        main: [ { id: 'c1', duration: 360 }, { id: 'c4', duration: 360 }, { id: 'c3', duration: 180 } ],
                        cooldown: [ { id: 'c1', duration: 120 } ]
                    }
                }
            ],
            intermediate: [
                 {
                    id: 'rec_cond_int_1',
                    name: "Resistência Intermédia",
                    totalDuration: 1200, // 20 minutos
                    xpAwarded: 1200,
                    staminaCost: 65,
                    phases: {
                        warmup: [ { id: 'warmup_arm_circles_fwd', duration: 30 }, { id: 'warmup_torso_twists', duration: 45 }, { id: 'warmup_leg_swings_fwd', duration: 45 }, { id: 'warmup_bodyweight_squats', duration: 60 } ],
                        main: [ { id: 'c5', duration: 420 }, { id: 'c3', duration: 300 }, { id: 'c4', duration: 180 } ],
                        cooldown: [ { id: 'c1', duration: 120 } ]
                    }
                }
            ],
            advanced: [
                {
                    id: 'rec_cond_adv_1',
                    name: "Força Explosiva",
                    totalDuration: 1200, // 20 minutos
                    xpAwarded: 1600,
                    staminaCost: 80,
                    phases: {
                        warmup: [ { id: 'warmup_high_knees', duration: 45 }, { id: 'warmup_bodyweight_squats', duration: 60 }, { id: 'warmup_arm_crosses', duration: 30 } ],
                        main: [ { id: 'c5', duration: 420 }, { id: 'c3', duration: 360 }, { id: 'c4', duration: 210 } ],
                        cooldown: [ { id: 'c1', duration: 75 } ]
                    }
                }
            ]
        },
        skill: {
            beginner: [
                {
                    id: 'rec_skill_beg_1',
                    name: "Fundamentos de Skill",
                    totalDuration: 1200, // 20 minutos
                    xpAwarded: 1000,
                    staminaCost: 60,
                    phases: {
                        warmup: [ { id: 'warmup_arm_circles_fwd', duration: 30 }, { id: 'warmup_torso_twists', duration: 45 }, { id: 'warmup_leg_swings_fwd', duration: 45 }, { id: 'warmup_bodyweight_squats', duration: 60 } ],
                        main: [ { id: 'wc_yat_chi_kuen', duration: 240 }, { id: 'wc_tan_sao', duration: 240 }, { id: 'wc_pak_sao', duration: 240 }, { id: 'wc_dan_chi', duration: 210 } ],
                        cooldown: [ { id: 'wc_snt_full', duration: 90 } ]
                    }
                }
            ],
            intermediate: [
                {
                    id: 'rec_skill_int_1',
                    name: "Fluidez e Controlo",
                    totalDuration: 1200, // 20 minutos
                    xpAwarded: 1400,
                    staminaCost: 70,
                    phases: {
                        warmup: [ { id: 'warmup_arm_circles_fwd', duration: 30 }, { id: 'warmup_torso_twists', duration: 45 }, { id: 'warmup_leg_swings_fwd', duration: 45 }, { id: 'warmup_bodyweight_squats', duration: 60 } ],
                        main: [ { id: 'wc_bong_sao', duration: 240 }, { id: 'wc_lap_sao', duration: 240 }, { id: 'wc_look_sao', duration: 300 }, { id: 'wc_seung_ma', duration: 150 } ],
                        cooldown: [ { id: 'wc_snt_full', duration: 90 } ]
                    }
                }
            ],
            advanced: [
                {
                    id: 'rec_skill_adv_1',
                    name: "Combinação Avançada",
                    totalDuration: 1200, // 20 minutos
                    xpAwarded: 1800,
                    staminaCost: 85,
                    phases: {
                        warmup: [ { id: 'warmup_high_knees', duration: 45 }, { id: 'warmup_bodyweight_squats', duration: 60 }, { id: 'warmup_arm_crosses', duration: 30 } ],
                        main: [ { id: 'wc_chi_sao', duration: 420 }, { id: 'wc_man_sao', duration: 300 }, { id: 'wc_seung_ma', duration: 180 } ],
                        cooldown: [ { id: 'wc_ck', duration: 65 } ]
                    }
                }
            ]
        },
        mix: {
            beginner: [
                 {
                    id: 'rec_mix_beg_1',
                    name: "Mix Iniciante",
                    totalDuration: 1200, // 20 minutos
                    xpAwarded: 900,
                    staminaCost: 55,
                    phases: {
                        warmup: [ { id: 'warmup_arm_circles_fwd', duration: 30 }, { id: 'warmup_torso_twists', duration: 45 }, { id: 'warmup_leg_swings_fwd', duration: 45 }, { id: 'warmup_bodyweight_squats', duration: 60 } ],
                        main: [ { id: 'wc_yat_chi_kuen', duration: 300 }, { id: 'wc_tan_sao', duration: 300 }, { id: 'c4', duration: 240 } ],
                        cooldown: [ { id: 'c1', duration: 120 } ]
                    }
                }
            ],
            intermediate: [
                 {
                    id: 'rec_mix_int_1',
                    name: "Mix Intermédio",
                    totalDuration: 1200, // 20 minutos
                    xpAwarded: 1300,
                    staminaCost: 70,
                    phases: {
                        warmup: [ { id: 'warmup_arm_circles_fwd', duration: 30 }, { id: 'warmup_torso_twists', duration: 45 }, { id: 'warmup_leg_swings_fwd', duration: 45 }, { id: 'warmup_bodyweight_squats', duration: 60 } ],
                        main: [ { id: 'wc_look_sao', duration: 420 }, { id: 'c3', duration: 300 }, { id: 'wc_seung_ma', duration: 210 } ],
                        cooldown: [ { id: 'wc_snt_full', duration: 90 } ]
                    }
                }
            ],
            advanced: [
                {
                    id: 'rec_mix_adv_1',
                    name: "Mix Avançado",
                    totalDuration: 1200, // 20 minutos
                    xpAwarded: 1700,
                    staminaCost: 80,
                    phases: {
                        warmup: [ { id: 'warmup_high_knees', duration: 45 }, { id: 'warmup_bodyweight_squats', duration: 60 }, { id: 'warmup_arm_crosses', duration: 30 } ],
                        main: [ { id: 'wc_chi_sao', duration: 420 }, { id: 'c5', duration: 300 }, { id: 'wc_hau_ma', duration: 210 } ],
                        cooldown: [ { id: 'wc_ck', duration: 65 } ]
                    }
                }
            ]
        }
    },
    AVATAR_LIST: [
        { id: "avatar1.png", requiredBelt: 0 }, { id: "avatar2.png", requiredBelt: 0 },
        { id: "avatar3.png", requiredBelt: 1 }, { id: "avatar4.png", requiredBelt: 1 },
        { id: "avatar5.png", requiredBelt: 2 }, { id: "avatar6.png", requiredBelt: 2 },
        { id: "avatar7.png", requiredBelt: 3 }, { id: "avatar8.png", requiredBelt: 3 },
        { id: "avatar9.png", requiredBelt: 4 }, { id: "avatar10.png", requiredBelt: 5 },
        { id: "avatar11.png", requiredBelt: 6 }, { id: "avatar12.png", requiredBelt: 6 }
    ],
    ACHIEVEMENTS: {
        // NOTE: The original file had an empty achievements object. 
        // This should be populated with your achievement data. Example:
        // first_steps: { 
        //     icon: '👣', title: 'Primeiros Passos', desc: 'Completa o teu primeiro treino.', 
        //     check: (profile) => profile.history.length > 0 
        // }
    },
    GREAT_MASTERS_DATA: [
         {
            name: "Ng Mui",
            dynasty: "A Monja Fundadora",
            image_placeholder: "https://placehold.co/400x400/111/FFFFFF?text=Ng+Mui",
            content: "<p>Figura lendária, Ng Mui é frequentemente citada como uma das fundadoras do Wing Chun. Diz-se que era uma monja do Templo Shaolin que desenvolveu um novo sistema de combate, mais eficiente e direto.</p>"
        },
        {
            name: "Leung Jan",
            dynasty: "O Rei do Wing Chun",
            image_placeholder: "https://placehold.co/400x400/111/FFFFFF?text=Leung+Jan",
            content: "<p>Um famoso médico e mestre de Wing Chun de Foshan, Leung Jan era conhecido pela sua mestria excecional. A sua reputação era tal que poucos ousavam desafiá-lo, ganhando o título de 'Rei do Wing Chun'.</p>"
        },
        {
            name: "Ip Man (Yip Man)",
            dynasty: "O Grande Mestre Moderno",
            image_placeholder: "https://placehold.co/400x400/111/FFFFFF?text=Ip+Man",
            content: "<p>Considerado o patriarca do Wing Chun moderno, Ip Man foi fundamental na disseminação da arte em Hong Kong e, consequentemente, no mundo. Foi professor de várias figuras notáveis.</p>"
        },
        {
            name: "Wong Shun Leung",
            dynasty: "O Rei das Lutas",
            image_placeholder: "https://placehold.co/400x400/111/FFFFFF?text=WSL",
            content: "<p>Conhecido como 'Gong Sau Wong' (Rei das Mãos que Falam), foi um dos alunos mais proeminentes de Ip Man. Famoso por testar e provar a eficácia do Wing Chun em dezenas de combates reais (Beimo).</p>"
        },
        {
            name: "Bruce Lee",
            dynasty: "O Dragão",
            image_placeholder: "https://placehold.co/400x400/111/FFFFFF?text=Bruce+Lee",
            content: "<p>O artista marcial mais influente do século XX. Bruce Lee começou o seu treino com Ip Man e Wong Shun Leung. Usou os princípios do Wing Chun como base para desenvolver a sua própria filosofia, o Jeet Kune Do.</p>"
        }
    ],
    THEORY_DATA: [
        {
            title: "Princípios Fundamentais do Wing Chun",
            content: `
                <h3>A Teoria da Linha Central (子午線理論)</h3>
                <p>Este é talvez o princípio mais importante do Wing Chun. A linha central é uma linha imaginária que desce pelo centro do corpo. A maioria dos pontos vitais está localizada ao longo desta linha. Portanto, a estratégia do Wing Chun é <strong>proteger a sua própria linha central enquanto ataca a do oponente</strong>. Todos os movimentos, desde a postura até aos socos e defesas, são orientados por este princípio.</p>
                
                <h3>Economia de Movimento (最簡潔的動作)</h3>
                <p>O Wing Chun valoriza a eficiência acima de tudo. O princípio da economia de movimento dita que se deve usar o caminho mais curto e a ação mais direta para atingir um objetivo. Não há movimentos extravagantes ou desnecessários. Cada ação tem um propósito claro, seja para defender, atacar ou ambos em simultâneo.</p>
                
                <h3>Ataque e Defesa Simultâneos (連消帶打)</h3>
                <p>Em vez de bloquear primeiro e depois atacar, um praticante de Wing Chun procura fazer ambos ao mesmo tempo. Isto é conhecido como <em>Lin Sil Die Da</em>. Por exemplo, um Bong Sao (braço-asa) não só desvia um ataque, como também posiciona o praticante para um contra-ataque imediato. Esta abordagem economiza tempo e sobrecarrega a capacidade de reação do oponente.</p>
                
                <h3>Quatro Portões (四門)</h3>
                <p>O conceito dos 'Quatro Portões' divide a área à frente de um praticante em quatro quadrantes: dois superiores (esquerdo e direito) e dois inferiores (esquerdo e direito). O objetivo é dominar e controlar estes portões, impedindo que o oponente entre na sua zona de perigo enquanto você explora as aberturas nos portões dele.</p>
            `
        }
    ],
    GLOSSARY_DATA: {
        "Conceitos Fundamentais": [
            { term: 'Linha Central (Jung Sin)', definition: 'A linha vertical imaginária no centro do corpo, o alvo principal e a área a ser protegida.', requiredBelt: 0 },
            { term: 'Encarar (Chiu Ying)', definition: 'O princípio de estar sempre virado de frente para o oponente para usar ambas as mãos.', requiredBelt: 0 },
            { term: 'Estrutura (Gan)', definition: 'O uso do alinhamento esquelético correto para gerar e receber força, em vez de usar a força muscular.', requiredBelt: 0 },
            { term: 'Economia de Movimento', definition: 'Usar o caminho mais curto e a ação mais simples para atingir um objetivo.', requiredBelt: 1 },
            { term: 'Ataque e Defesa Simultâneos (Lin Sil Die Da)', definition: 'Defender e atacar no mesmo movimento para máxima eficiência.', requiredBelt: 2 },
        ],
        "Técnicas de Mãos (Sao Faat)": [
            { term: 'Yat Chi Kuen (日字拳)', definition: 'O "Soco Vertical". O soco característico do Wing Chun.', requiredBelt: 0 },
            { term: 'Wu Sao (護手)', definition: 'A "Mão de Guarda". A mão que não está a atacar, posicionada para proteger a linha central.', requiredBelt: 0 },
            { term: 'Tan Sao (攤手)', definition: 'A "Mão que Dispersa". Uma defesa com a palma para cima.', requiredBelt: 1 },
            { term: 'Pak Sao (拍手)', definition: 'A "Mão que Bate". Uma defesa de desvio rápido e agressiva.', requiredBelt: 1 },
            { term: 'Fook Sao (伏手)', definition: 'A "Mão que Controla/Ponte". Usada para manter o contacto e sentir o oponente.', requiredBelt: 1 },
            { term: 'Bong Sao (膀手)', definition: 'O "Braço-Asa". Uma defesa angular para redirecionar a força.', requiredBelt: 2 },
            { term: 'Lap Sao (拉手)', definition: 'A "Mão que Puxa". Quebra a estrutura do oponente puxando-o.', requiredBelt: 2 },
            { term: 'Jut Sao (窒手)', definition: 'A "Mão que Afoga". Um movimento curto e descendente para interromper.', requiredBelt: 2 },
            { term: 'Gaan Sao (耕手)', definition: 'A "Mão que Lavra". Uma defesa baixa que desvia ataques para o lado.', requiredBelt: 3 },
            { term: 'Man Sao (問手)', definition: 'A "Mão que Pergunta". A mão avançada no Chi Sao, que testa as defesas do oponente.', requiredBelt: 3 },
        ],
        "Posturas e Trabalho de Pés (Ma Bo / Bo Faat)": [
            { term: 'Yee Jee Kim Yeung Ma (二字箝羊馬)', definition: 'A postura base do Wing Chun, que treina a estrutura e o enraizamento.', requiredBelt: 0 },
            { term: 'Cheun Ma (轉馬)', definition: 'A "Viragem de Postura". Usada para mudar o ângulo de ataque ou defesa sem mover os pés.', requiredBelt: 1 },
            { term: 'Biu Ma (鏢馬)', definition: 'O "Passo de Impulso". Um passo rápido para a frente para encurtar a distância.', requiredBelt: 2 },
            { term: 'Huen Ma (圈馬)', definition: 'O "Passo Circular". Um passo lateral para contornar o oponente.', requiredBelt: 2 },
        ],
        "Formas e Exercícios (Kuen Tou / Lin習)": [
            { term: 'Siu Nim Tao (小念頭)', definition: 'A "Pequena Ideia". A primeira forma, ensina a estrutura e as técnicas básicas de mão.', requiredBelt: 1 },
            { term: 'Dan Chi Sao (單黐手)', definition: 'Chi Sao com apenas um braço, para iniciantes.', requiredBelt: 1 },
            { term: 'Cham Kiu (尋橋)', definition: 'A "Ponte que Procura". A segunda forma, introduz o trabalho de pés, viragens e pontapés.', requiredBelt: 2 },
            { term: 'Chi Sao (黐手)', definition: 'Os "Braços Colados". O exercício de sensibilidade fundamental para aplicar os princípios em tempo real.', requiredBelt: 2 },
            { term: 'Look Sao (碌手)', definition: 'Os "Braços que Enrolam". Um exercício contínuo que treina a fluidez entre Bong Sao, Tan Sao e Fook Sao.', requiredBelt: 2 },
            { term: 'Biu Jee (鏢指)', definition: 'Os "Dedos que Furam". A terceira forma, focada em técnicas de emergência e recuperação.', requiredBelt: 3 },
        ],
        "Armas (Mok Gwan / Dou)": [
            { term: 'Muk Yan Jong (木人樁)', definition: 'O "Homem de Madeira". Forma e parceiro de treino para refinar técnicas, ângulos e trabalho de pés.', requiredBelt: 4 },
            { term: 'Luk Dim Boon Kwan (六點半棍)', definition: 'O "Bastão de Seis Pontos e Meio". A primeira arma, desenvolve força explosiva.', requiredBelt: 5 },
            { term: 'Baat Jaam Do (八斬刀)', definition: 'As "Facas de Oito Cortes". A segunda arma, considerada a extensão máxima das mãos.', requiredBelt: 6 },
        ],
        "Terminologia Geral": [
            { term: 'Sifu (師父)', definition: 'Professor/Mestre. Uma figura paternal na arte.', requiredBelt: 0 },
            { term: 'Kwoon (館)', definition: 'Escola ou local de treino.', requiredBelt: 0 },
            { term: 'Sihing (師兄)', definition: 'Irmão marcial mais velho (aluno mais antigo).', requiredBelt: 1 },
        ]
    },
    MASTER_SECRET_KEY: "W1NGCHUN_S3CR3T_K3Y_F0R_H4SHING",
};

// Make this data available to other files that import it.
export { appData };
