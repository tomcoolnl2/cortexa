// Hex Grid WebGL Background using Three.js and a custom fragment shader
// Author: Copilot

// ====== SETUP ======
const canvas = document.getElementById('hex-bg-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
// Read background color from global variable injected by Next.js (see layout.tsx)
const BG_COLOR = window.__HEX_BG_COLOR__;
renderer.setClearColor(BG_COLOR, 1);

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

// Fullscreen quad geometry
const geometry = new THREE.PlaneGeometry(2, 2);

// ====== UNIFORMS ======
const uniforms = {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) }
};

// ====== FRAGMENT SHADER ======
const fragmentShader = `
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    // --- HEX UTILS (correct axial layout) ---

    vec2 hexCoords(vec2 p) {
        float q = (2.0/3.0) * p.x;
        float r = (-1.0/3.0) * p.x + (0.57735027) * p.y;
        return vec2(q, r);
    }

    vec2 hexRound(vec2 h) {
        vec3 cube = vec3(h.x, -h.x - h.y, h.y);
        vec3 rcube = floor(cube + 0.5);
        
        vec3 diff = abs(rcube - cube);
        
        if (diff.x > diff.y && diff.x > diff.z)
            rcube.x = -rcube.y - rcube.z;
        else if (diff.y > diff.z)
            rcube.y = -rcube.x - rcube.z;
        else
            rcube.z = -rcube.x - rcube.y;

        return vec2(rcube.x, rcube.z);
    }

    vec2 hexCenter(vec2 h) {
        float x = (3.0/2.0) * h.x;
        float y = (1.7320508) * (h.y + h.x / 2.0);
        return vec2(x, y);
    }

    // Signed distance to hex
    float hexSDF(vec2 p) {
        // Canonical regular hexagon SDF, radius 0.5
        p = abs(p);
        return max(dot(p, vec2(0.5, 0.8660254)), p.x) - 0.5;
    }

    // scale grid
    void main() {
        // --- PIXEL SPACE (stable, non-scaling hexes) ---
        float hexPx = 90.0; // desired hex size in pixels (bigger hexagons)
        float spacing = 1.0; // tightest hexes (1.0 = edge-to-edge)
        vec2 grid = gl_FragCoord.xy / (hexPx * spacing);
        // Optional: subtle motion
        grid += sin(u_time * 0.3) * 0.1;

        // --- TRUE HEX GRID ---
        vec2 h = hexCoords(grid);
        vec2 rh = hexRound(h);
        vec2 center = hexCenter(rh);
        vec2 local = grid - center;

        float d = hexSDF(local * 0.85); // more overlap for stronger honeycomb

        // --- EDGE: thin outline ---
        float outline = smoothstep(-0.02, 0.0, d) - smoothstep(0.0, 0.02, d);
        float margin = 1.0 - smoothstep(-0.02, 0.02, d); // margin is outside the outline

        // --- MOUSE (aspect-corrected for distance) ---
        // Mouse in pixel space
        vec2 mousePx = u_mouse * u_resolution;
        float dist = length(gl_FragCoord.xy - mousePx);
        float glow = exp(-dist * 0.015); // larger radius for mouse glow
        glow *= 0.8 + 0.2 * sin(u_time * 2.0);

        // --- COLORS ---
        vec3 baseColor = vec3(0.102, 0.106, 0.118); // background #1A1B1E
        vec3 lineColor = vec3(0.12, 0.12, 0.13); // outline, very close to background
        vec3 glowColor = vec3(0.13, 0.18, 0.28);  // dimmed mouse glow

        vec3 color = baseColor;
        color = mix(color, lineColor, outline); // draw only outline
        color += glowColor * glow * margin;     // mouse glow only in margin

        gl_FragColor = vec4(color, 1.0);
    }
  `;

const material = new THREE.ShaderMaterial({
    uniforms,
    fragmentShader,
    vertexShader: `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// ====== MOUSE INTERACTION ======
function onPointerMove(e) {
    let x, y;
    if (e.touches && e.touches.length) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }
    uniforms.u_mouse.value.set(
        x / window.innerWidth,
        1.0 - y / window.innerHeight
    );
}
window.addEventListener('mousemove', onPointerMove, false);
window.addEventListener('touchmove', onPointerMove, false);

// ====== RESIZE HANDLING ======
// --- Throttled Resize Handler ---
let resizeTimeout = null;
function onResizeThrottled() {
    if (resizeTimeout) return;
    resizeTimeout = setTimeout(() => {
        resizeTimeout = null;
        const w = window.innerWidth, h = window.innerHeight;
        renderer.setSize(w, h, false);
        uniforms.u_resolution.value.set(w, h);
    }, 100); // 100ms throttle
}
window.addEventListener('resize', onResizeThrottled, false);
// Initial sizing
const w = window.innerWidth, h = window.innerHeight;
renderer.setSize(w, h, false);
uniforms.u_resolution.value.set(w, h);

// ====== ANIMATION LOOP ======
function animate() {
    uniforms.u_time.value = performance.now() * 0.001;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();