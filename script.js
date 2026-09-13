const dialogueBox = document.getElementById('dialogue-box');
const dialogueText = document.getElementById('dialogue-text');
const battleMenu = document.getElementById('battle-menu');
const fxLayer = document.getElementById('fx-layer');
const nextgenContainer = document.querySelector('.nextgen-container');
const overlay = document.getElementById('content-overlay');
const overlayContent = document.getElementById('overlay-content');
const opponentMech = document.getElementById('opponent-mech');
const targetHpVal = document.getElementById('target-hp-val');
const targetHpFill = document.querySelector('.target-hp');
const targetHpGlow = document.querySelector('.target-hp-glow');

let state = 'intro'; 
let targetHp = 100;

// --- AUDIO ENGINE ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playBeep(freq, type, duration, vol = 0.1) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + duration);
}
function playTypeSound() { playBeep(Math.random() * 200 + 600, 'square', 0.05, 0.05); }
function playHitSound() {
    playBeep(150, 'sawtooth', 0.5, 0.3);
    setTimeout(() => playBeep(100, 'square', 0.4, 0.3), 50);
}
function playSelectSound() { playBeep(880, 'sine', 0.1, 0.1); }
// --------------------

const contentData = {
    'api': {
        title: 'Bookspace: Library Management System',
        tags: [
            { label: 'Node.js', type: 'blue' },
            { label: 'MongoDB', type: 'green' },
            { label: 'RESTful API', type: 'purple' }
        ],
        desc: 'Monolithic RESTful API Structure with a clear separation of concerns (Models, Routes, Middleware). Features Role-Based Access Control (RBAC), an internal token economy, and automated background processing.',
        cards: [
            { icon: 'fa-solid fa-database', title: 'Advanced MongoDB Schemas', text: 'Core schemas for Users, Books, and Loans. Features compound text indexing on Books for highly optimized, fast full-text search capabilities.' },
            { icon: 'fa-solid fa-shield-halved', title: 'Stateless Auth & Security', text: 'Stateless JWT Bearer tokens eliminating server-side session memory, coupled with robust bcryptjs one-way password hashing.' },
            { icon: 'fa-solid fa-microchip', title: 'Automated Server Maintenance', text: 'Utilizes node-cron jobs for executing server-side tasks like nightly database cleanup sweeps and automated overdue loan calculation.' }
        ]
    },
    'ai': {
        title: 'RetinaGuard: Hybrid CDSS',
        tags: [
            { label: 'Python', type: 'orange' },
            { label: 'Deep Learning', type: 'purple' },
            { label: 'OpenCV', type: 'blue' }
        ],
        desc: 'Hybrid Clinical Decision Support System combining a Deep Learning CNN with a deterministic 10-Expert Rule-Based Engine. Built as a stateless RESTful microservice.',
        cards: [
            { icon: 'fa-solid fa-server', title: 'Microservice API Architecture', text: 'Stateless Flask REST API returning structured JSON analyses (composite scores, severity, differential diagnosis) for easy clinical frontend integration.' },
            { icon: 'fa-solid fa-gauge-high', title: 'Performance Optimization', text: 'Vectorized NumPy operations and Field of View (FOV) masking restrict computation strictly to the retinal area, heavily saving CPU cycles.' },
            { icon: 'fa-solid fa-user-doctor', title: 'Clinical Safety & XAI', text: 'Context-aware thresholding based on demographics, strict GIGO prevention, and Explainable AI (XAI) narratives to guarantee diagnostic safety.' }
        ]
    },
    'java': {
        title: 'Oracle Certified Professional: Java SE 17',
        tags: [
            { label: 'Java 17', type: 'orange' },
            { label: 'OOP', type: 'blue' },
            { label: 'Certified', type: 'green' }
        ],
        desc: 'Validated advanced proficiency in Java SE 17, encompassing object-oriented design and modern Java APIs.',
        cards: [
            { icon: 'fa-brands fa-java', title: 'Modern Java APIs', text: 'Advanced knowledge of modern Java APIs and object-oriented programming.' },
            { icon: 'fa-solid fa-cubes', title: 'OOP & DBMS', text: 'Strong foundation in Core Concepts including DBMS and OOP.' },
            { icon: 'fa-solid fa-briefcase', title: 'Inplant Training', text: 'Analyzed Java-based enterprise workflows at Techvolt Software & Frenzo Technologies.' }
        ]
    },
    'stats': {
        title: 'Achievements & Education',
        tags: [
            { label: 'Top 10 Finalist', type: 'purple' },
            { label: '1st Place x2', type: 'orange' },
            { label: 'CGPA 7.63', type: 'blue' }
        ],
        desc: 'Top 10 Finalist at the NIT Kanini technical competition, demonstrating strong algorithmic and problem-solving skills.',
        cards: [
            { icon: 'fa-solid fa-trophy', title: '1st Place Presentations', text: 'Secured 1st Place in Project Presentations at Markus 2k26 and Renaissance 2k25.' },
            { icon: 'fa-solid fa-medal', title: 'Web Weave Winner', text: 'Secured 2nd Place at the Web Weave Event (Renaissance 2k25).' },
            { icon: 'fa-solid fa-graduation-cap', title: 'Kongu Engineering College', text: 'B.E. Computer Science and Engineering (Expected 2027). Current CGPA: 7.63.' }
        ]
    },
    'arch': {
        title: 'Core System Architecture',
        tags: [
            { label: 'System Design', type: 'blue' },
            { label: 'Scalability', type: 'purple' },
            { label: 'Algorithms', type: 'green' }
        ],
        desc: 'My approach to solving complex engineering problems revolves around crafting highly scalable, decoupled, and secure systems from the ground up.',
        cards: [
            { icon: 'fa-solid fa-diagram-project', title: 'Micro-Service Mindset', text: 'Experience orchestrating async pipelines, load balancing, and API gateways for distributed systems.' },
            { icon: 'fa-solid fa-shield-halved', title: 'Security First', text: 'Implementing robust JWT authentication, Bcrypt hashing, and role-based access control (RBAC) layers.' },
            { icon: 'fa-solid fa-bolt', title: 'Algorithmic Efficiency', text: 'Consistently producing highly optimized solutions, focusing heavily on reducing time (Big O) and space complexities.' }
        ]
    },
    'contact': {
        title: 'Initiate Secure Comm-Link',
        tags: [
            { label: 'Available to Hire', type: 'green' },
            { label: '2027 Graduate', type: 'orange' },
            { label: 'Remote / On-site', type: 'blue' }
        ],
        desc: 'Ready to deploy robust backend architectures and innovative Generative AI solutions for your enterprise? The system is primed for your connection.',
        cards: [
            { icon: 'fa-solid fa-envelope', title: 'Direct Email Protocol', text: '<a href="mailto:manojpalanisamy515@gmail.com" style="color:#38bdf8; text-decoration:none;">manojpalanisamy515@gmail.com</a><br>Average response time: < 12 Hours.' },
            { icon: 'fa-brands fa-linkedin', title: 'Professional Network', text: '<a href="https://linkedin.com/in/manoj-p-a14913291" target="_blank" style="color:#38bdf8; text-decoration:none;">linkedin.com/in/manoj-p-a14913291</a><br>Connect with me to see my professional journey.' },
            { icon: 'fa-solid fa-phone', title: 'Voice Comm Channel', text: '<a href="tel:+919514374431" style="color:#38bdf8; text-decoration:none;">+91 9514374431</a><br>Available for technical interviews and discussions.' }
        ]
    }
};

async function typeWriter(text, element, speed = 20) {
    element.innerHTML = '';
    return new Promise(resolve => {
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                playTypeSound();
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        type();
    });
}

let pokedexViewed = false;

dialogueBox.addEventListener('click', async () => {
    if (state !== 'intro') return;
    
    state = 'animating';
    document.querySelector('.dialogue-indicator').style.display = 'none';
    
    await typeWriter("A wild RECRUITER appeared! Analyzing target profile... Launching Pokédex...", dialogueText, 15);
    
    setTimeout(() => {
        // Automatically open the pokedex
        const p = document.getElementById('pokedex-overlay');
        p.classList.remove('hidden');
        pokedexViewed = true;
    }, 800);
});

// We override the togglePokedex function to handle the transition from Pokedex to Battle
window.togglePokedex = function() {
    const p = document.getElementById('pokedex-overlay');
    const isHidden = p.classList.contains('hidden');
    
    if (isHidden) {
        p.classList.remove('hidden');
    } else {
        p.classList.add('hidden');
        
        // If this is the first time closing the pokedex, start the battle!
        if (pokedexViewed && state === 'animating') {
            startBattleFlow();
        }
    }
}

async function startBattleFlow() {
    await typeWriter("Profile analyzed. IGNIS systems online. Awaiting commands...", dialogueText, 20);
    
    setTimeout(() => {
        state = 'waiting_action';
        // Morph dialogue box layout to reveal commands
        dialogueBox.style.flex = '0 0 35%';
        setTimeout(() => {
            battleMenu.classList.remove('hidden');
        }, 300);
    }, 500);
}

function updateTargetHp(damage) {
    targetHp = Math.max(0, targetHp - damage);
    targetHpVal.innerText = `${targetHp}%`;
    targetHpFill.style.width = `${targetHp}%`;
    targetHpGlow.style.width = `${targetHp}%`;
    
    if (targetHp <= 0) {
        targetHpFill.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
        targetHpGlow.style.background = '#ef4444';
    } else if (targetHp < 50 && targetHp > 20) {
        targetHpFill.style.background = 'linear-gradient(90deg, #eab308, #fef08a)';
        targetHpGlow.style.background = '#eab308';
    } else if (targetHp <= 20) {
        targetHpFill.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
        targetHpGlow.style.background = '#ef4444';
    } else {
        targetHpFill.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
        targetHpGlow.style.background = '#10b981';
    }
}

async function useMove(moveKey) {
    if (state !== 'waiting_action') return;
    state = 'animating';
    playSelectSound();
    
    // Hide menu
    battleMenu.classList.add('hidden');
    dialogueBox.style.flex = '1 1 auto';
    
    const moveNames = {
        'api': 'REST API BEAM',
        'ai': 'MEDICAL AI WGAN',
        'java': 'OCP JAVA FLARE',
        'stats': 'ACHIEVEMENT BURST',
        'arch': 'CORE ARCHITECTURE',
        'contact': 'RECRUITER SIGNAL'
    };
    
    await typeWriter(`IGNIS executing protocol: ${moveNames[moveKey]}!`, dialogueText);
    
    // Play Animation based on move
    playMoveAnimation(moveKey);
    
    setTimeout(async () => {
        // High fidelity Screen Shake & Flash
        nextgenContainer.classList.add('anim-shake');
        
        // Color-coded flash
        const colors = {
            'api': '#fef08a', 'ai': '#e9d5ff', 'java': '#fecaca', 
            'stats': '#bbf7d0', 'arch': '#e9d5ff', 'contact': '#fef08a'
        };
        const flash = document.createElement('div');
        flash.style.position = 'absolute';
        flash.style.top = '0'; flash.style.left = '0';
        flash.style.width = '100%'; flash.style.height = '100%';
        flash.style.backgroundColor = colors[moveKey] || 'white';
        flash.style.zIndex = '90';
        flash.style.animation = 'flash-white 0.8s cubic-bezier(0.1, 0.9, 0.2, 1) forwards';
        flash.style.mixBlendMode = 'overlay';
        
        // Critical Hit Text
        const dmgText = document.createElement('div');
        dmgText.innerText = "CRITICAL HIT!";
        dmgText.style.position = 'absolute';
        dmgText.style.right = '15%';
        dmgText.style.top = '20%';
        dmgText.style.color = '#ef4444';
        dmgText.style.fontSize = '4rem';
        dmgText.style.fontWeight = '900';
        dmgText.style.fontStyle = 'italic';
        dmgText.style.textShadow = '0 0 30px #ef4444, 5px 5px 0px #000';
        dmgText.style.zIndex = '95';
        dmgText.style.animation = 'float-up 1s ease-out forwards';
        
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes flash-white { 0% { opacity: 0; } 10% { opacity: 0.9; } 100% { opacity: 0; } }
            @keyframes float-up { 0% { transform: translateY(0) scale(0.5); opacity: 1; } 40% { transform: translateY(-50px) scale(1.3); } 100% { transform: translateY(-120px) scale(1); opacity: 0; } }
        `;
        document.head.appendChild(style);
        
        nextgenContainer.appendChild(flash);
        nextgenContainer.appendChild(dmgText);
        
        playHitSound();
        
        // Target shake and damage
        opponentMech.style.animation = 'violent-shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        updateTargetHp(25);
        
        setTimeout(() => {
            nextgenContainer.classList.remove('anim-shake');
            opponentMech.style.animation = 'hover-mech 4s ease-in-out infinite';
            flash.remove();
            dmgText.remove();
            style.remove();
        }, 1000);

        await typeWriter("Recruiter defense bypassed. Extracting data...", dialogueText, 15);
        
        setTimeout(() => {
            showRevealOverlay(moveKey);
        }, 1200);
        
    }, 800);
}

function playMoveAnimation(moveKey) {
    fxLayer.innerHTML = ''; 
    let fxElement = document.createElement('div');
    
    switch(moveKey) {
        case 'api': fxElement.className = 'beam-fx'; break;
        case 'ai': fxElement.className = 'psychic-fx'; break;
        case 'java': fxElement.className = 'fire-fx'; break;
        case 'stats': fxElement.className = 'grass-fx'; break;
        case 'arch': fxElement.className = 'psychic-fx'; break;
        case 'contact': fxElement.className = 'beam-fx'; break;
    }
    
    fxLayer.appendChild(fxElement);
    
    setTimeout(() => { fxLayer.innerHTML = ''; }, 1200);
}

function generateRevealHTML(data) {
    let tagsHTML = data.tags.map(tag => `<span class="reveal-tag ${tag.type}">${tag.label}</span>`).join('');
    let cardsHTML = data.cards.map(card => `
        <div class="reveal-card">
            <h4><i class="${card.icon}"></i> ${card.title}</h4>
            <p>${card.text}</p>
        </div>
    `).join('');
    
    return `
        <h2 class="reveal-title">${data.title}</h2>
        <div class="reveal-tags">${tagsHTML}</div>
        <p class="reveal-desc">${data.desc}</p>
        <div class="reveal-grid">
            ${cardsHTML}
        </div>
    `;
}

function showRevealOverlay(moveKey) {
    const data = contentData[moveKey];
    overlayContent.innerHTML = generateRevealHTML(data);
    overlay.classList.remove('hidden');
}

function closeOverlay() {
    overlay.classList.add('hidden');
    overlayContent.innerHTML = '';
    
    if (targetHp <= 0) {
        typeWriter("Recruiter's HP is 0! Recruiter used FULL RESTORE!", dialogueText).then(() => {
            playSelectSound();
            
            // Dramatic heal effect
            setTimeout(() => {
                targetHp = 100;
                targetHpVal.innerText = `100%`;
                targetHpFill.style.width = `100%`;
                targetHpGlow.style.width = `100%`;
                targetHpFill.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
                targetHpGlow.style.background = '#10b981';
                playTypeSound(); // little tick
                
                setTimeout(() => {
                    typeWriter("Ready for next command protocol.", dialogueText).then(() => {
                        state = 'waiting_action';
                        dialogueBox.style.flex = '0 0 35%';
                        setTimeout(() => {
                            battleMenu.classList.remove('hidden');
                        }, 300);
                    });
                }, 1000);
            }, 500);
        });
    } else {
        typeWriter("Ready for next command protocol.", dialogueText).then(() => {
            state = 'waiting_action';
            dialogueBox.style.flex = '0 0 35%';
            setTimeout(() => {
                battleMenu.classList.remove('hidden');
            }, 300);
        });
    }
}
