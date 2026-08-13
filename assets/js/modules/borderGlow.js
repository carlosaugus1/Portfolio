function parseHSL(hslStr) {
  const match = hslStr.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 40, s: 80, l: 80 };
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

function buildGlowVars(glowColor, intensity) {
  const { h, s, l } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ['', '-60', '-50', '-40', '-30', '-20', '-10'];
  const vars = {};
  for (let i = 0; i < opacities.length; i++) {
    vars[`--glow-color${keys[i]}`] = `hsl(${base} / ${Math.min(opacities[i] * intensity, 100)}%)`;
  }
  return vars;
}

const GRADIENT_POSITIONS = ['80% 55%', '69% 34%', '8% 6%', '41% 38%', '86% 85%', '82% 18%', '51% 4%'];
const GRADIENT_KEYS = ['--gradient-one', '--gradient-two', '--gradient-three', '--gradient-four', '--gradient-five', '--gradient-six', '--gradient-seven'];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

function buildGradientVars(colors) {
  const vars = {};
  for (let i = 0; i < 7; i++) {
    const c = colors[Math.min(COLOR_MAP[i], colors.length - 1)];
    vars[GRADIENT_KEYS[i]] = `radial-gradient(at ${GRADIENT_POSITIONS[i]}, ${c} 0px, transparent 50%)`;
  }
  vars['--gradient-base'] = `linear-gradient(${colors[0]} 0 100%)`;
  return vars;
}

function getCenterOfElement(el) {
  const rect = el.getBoundingClientRect();
  return [rect.width / 2, rect.height / 2];
}

function getEdgeProximity(el, x, y) {
  const [cx, cy] = getCenterOfElement(el);
  const dx = x - cx;
  const dy = y - cy;
  let kx = Infinity;
  let ky = Infinity;
  if (dx !== 0) kx = cx / Math.abs(dx);
  if (dy !== 0) ky = cy / Math.abs(dy);
  return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
}

function getCursorAngle(el, x, y) {
  const [cx, cy] = getCenterOfElement(el);
  const dx = x - cx;
  const dy = y - cy;
  if (dx === 0 && dy === 0) return 0;
  const radians = Math.atan2(dy, dx);
  let degrees = radians * (180 / Math.PI) + 90;
  if (degrees < 0) degrees += 360;
  return degrees;
}

export function initBorderGlow() {
  const cards = document.querySelectorAll('.border-glow');
  if (cards.length === 0) return;
  
  // Configurações originais solicitadas pelo usuário
  const edgeSensitivity = 30;
  const glowColor = '40 80 80';
  const glowRadius = 40;
  const glowIntensity = 1.0;
  const coneSpread = 25;
  const colors = ['#c084fc', '#f472b6', '#38bdf8'];
  
  // O radius e as posições agora se baseiam no próprio elemento!

  const glowVars = buildGlowVars(glowColor, glowIntensity);
  const gradientVars = buildGradientVars(colors);
  
  cards.forEach(card => {
    // Pegar o border-radius nativo do painel e usar no CSS dinâmico
    const computedStyle = window.getComputedStyle(card);
    const nativeBorderRadius = computedStyle.borderRadius || '16px';
    
    // Configura os inline styles estáticos diretamente no card alvo
    card.style.setProperty('--edge-sensitivity', edgeSensitivity);
    card.style.setProperty('--color-sensitivity', edgeSensitivity + 20);
    card.style.setProperty('--border-radius', nativeBorderRadius);
    card.style.setProperty('--glow-padding', `${glowRadius}px`);
    card.style.setProperty('--cone-spread', coneSpread);
    
    // Injetar variáveis de gradiente e cores
    for (const [key, value] of Object.entries(glowVars)) {
      card.style.setProperty(key, value);
    }
    for (const [key, value] of Object.entries(gradientVars)) {
      card.style.setProperty(key, value);
    }
    
    // Para garantir que o z-index dos pseudo elementos fique correto e não escape:
    if (computedStyle.position === 'static') {
        card.style.position = 'relative';
    }

    // Estrutura dinâmica para evitar conflitos de máscara e HTML extra:
    // 1. Edge Light (Glow externo)
    const edgeLight = document.createElement('div');
    edgeLight.className = 'border-glow-edge-light';
    
    // 2. Border Container (Máscara vazada)
    const borderContainer = document.createElement('div');
    borderContainer.className = 'border-glow-border-container';
    
    // 3. Mesh Gradient (Máscara Cônica)
    const mesh = document.createElement('div');
    mesh.className = 'border-glow-mesh';
    borderContainer.appendChild(mesh);

    // Adiciona dentro do card original
    card.appendChild(edgeLight);
    card.appendChild(borderContainer);

    // Lógica do cursor
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const edge = getEdgeProximity(card, x, y);
      const angle = getCursorAngle(card, x, y);

      card.style.setProperty('--edge-proximity', `${(edge * 100).toFixed(3)}`);
      card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
    });
  });
}
