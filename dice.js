class DiceRenderer {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.container = document.getElementById('dice-container');
    this.dice = null;
    this.isRolling = false;
    this.targetRotation = { x: 0, y: 0, z: 0 };

    this.init();
    this.createDiceTextures();
    this.animate();
    this.setupEventListeners();
  }

  init() {
    this.renderer.setSize(600, 600);  
    this.container.appendChild(this.renderer.domElement);
    this.camera.position.z = 12;  

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    this.scene.add(directionalLight);
  }

  createDiceTextures() {
    const loader = new THREE.TextureLoader();
    const materials = [
      this.createDiceFace(6), 
      this.createDiceFace(5), 
      this.createDiceFace(2), 
      this.createDiceFace(1), 
      this.createDiceFace(3), 
      this.createDiceFace(4)  
    ].map(svg => {
      const texture = new THREE.Texture();
      const img = new Image();
      img.onload = () => {
        texture.image = img;
        texture.needsUpdate = true;
      };
      img.src = 'data:image/svg+xml,' + encodeURIComponent(svg);
      return new THREE.MeshPhongMaterial({
        map: texture,
        specular: 0x050505,
        shininess: 100
      });
    });

    const geometry = new THREE.BoxGeometry(3, 3, 3);  
    this.dice = new THREE.Mesh(geometry, materials);
    this.scene.add(this.dice);
    
    this.dice.rotation.set(0, 0, 0);
  }

  createDiceFace(number) {
    const dotPositions = {
      1: [[50, 50]],
      2: [[25, 25], [75, 75]],
      3: [[25, 25], [50, 50], [75, 75]],
      4: [[25, 25], [25, 75], [75, 25], [75, 75]],
      5: [[25, 25], [25, 75], [50, 50], [75, 25], [75, 75]],
      6: [[25, 25], [25, 50], [25, 75], [75, 25], [75, 50], [75, 75]]
    };

    const dots = dotPositions[number]
      .map(([x, y]) => `<circle cx="${x}%" cy="${y}%" r="8" fill="black"/>`)
      .join('');

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="white"/>
        ${dots}
      </svg>
    `;
  }

  getRandomFaceRotation() {
    const faces = [
      { face: 1, rotation: { x: Math.PI/2, y: 0, z: 0 } },    // Top face (1)
      { face: 2, rotation: { x: 0, y: 0, z: Math.PI/2 } },    // Right face (2)
      { face: 3, rotation: { x: 0, y: Math.PI/2, z: 0 } },    // Front face (3)
      { face: 4, rotation: { x: 0, y: -Math.PI/2, z: 0 } },   // Back face (4)
      { face: 5, rotation: { x: 0, y: 0, z: -Math.PI/2 } },   // Left face (5)
      { face: 6, rotation: { x: -Math.PI/2, y: 0, z: 0 } }    // Bottom face (6)
    ];
    
    return faces[Math.floor(Math.random() * faces.length)].rotation;
  }

  rollDice() {
    if (this.isRolling) return;
    this.isRolling = true;

    const finalRotation = this.getRandomFaceRotation();
    
    const spins = 3;
    const targetX = finalRotation.x + (Math.PI * 2 * spins);
    const targetY = finalRotation.y + (Math.PI * 2 * spins);
    const targetZ = finalRotation.z + (Math.PI * 2 * spins);

    gsap.to(this.dice.rotation, {
      x: targetX,
      y: targetY,
      z: targetZ,
      duration: 2,
      ease: "power2.out",
      onComplete: () => {
        this.isRolling = false;
        this.dice.rotation.x = finalRotation.x;
        this.dice.rotation.y = finalRotation.y;
        this.dice.rotation.z = finalRotation.z;
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  setupEventListeners() {
    const button = document.querySelector('.fancy-button');
    button.addEventListener('click', (event) => {
      this.rollDice();
      this.createParticles(button, event);
    });
  }

  createParticles(button, event) {
    const waves = document.querySelector('.waves');
    gsap.to(waves, {
      keyframes: [
        { 
          scale: 1.1,
          duration: 0.2,
          ease: "power2.out"
        },
        {
          scale: 1,
          duration: 0.8,
          ease: "elastic.out(1, 0.3)"
        }
      ]
    });

    const rect = button.getBoundingClientRect();
    const particlesContainer = button.querySelector('.button-particles');

    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: white;
        border-radius: 50%;
        pointer-events: none;
        left: ${clickX}px;
        top: ${clickY}px;
      `;

      const angle = (Math.random() * Math.PI * 2);
      const velocity = 50 + Math.random() * 50;
      const endX = Math.cos(angle) * velocity;
      const endY = Math.sin(angle) * velocity;

      particle.style.setProperty('--start-x', '0px');
      particle.style.setProperty('--start-y', '0px');
      particle.style.setProperty('--end-x', `${endX}px`);
      particle.style.setProperty('--end-y', `${endY}px`);
      particle.style.animation = 'particle 0.8s ease-out forwards';

      particlesContainer.appendChild(particle);
      setTimeout(() => particle.remove(), 800);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const diceRenderer = new DiceRenderer();
});