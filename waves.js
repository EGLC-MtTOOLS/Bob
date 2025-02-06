// Add more complex wave animations based on scroll position
document.addEventListener('scroll', () => {
  const waves = document.querySelector('.waves');
  const scrolled = window.pageYOffset;
  const rate = scrolled * 0.15;
  
  waves.style.transform = `translateY(${rate}px) rotate(${rate * 0.15}deg)`;
});

// Add enhanced mouse movement effect
document.addEventListener('mousemove', (e) => {
  const waves = document.querySelector('.waves');
  const mouseX = (e.clientX - window.innerWidth / 2) / window.innerWidth;
  const mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;
  
  // Create more dramatic wave effect based on mouse position
  waves.style.transform = `translate(${mouseX * 30}px, ${mouseY * 30}px) 
                          scale(${1 + Math.abs(mouseX) * 0.1}, ${1 + Math.abs(mouseY) * 0.1})
                          rotate(${mouseX * 5}deg)`;
});

// Add periodic wave pulse
setInterval(() => {
  const waves = document.querySelector('.waves');
  waves.style.transition = 'transform 2s cubic-bezier(0.4, 0, 0.2, 1)';
  
  // Random movement within constraints
  const randomX = (Math.random() - 0.5) * 20;
  const randomY = (Math.random() - 0.5) * 20;
  const randomRotate = (Math.random() - 0.5) * 3;
  const randomScale = 1 + Math.random() * 0.1;
  
  waves.style.transform = `translate(${randomX}px, ${randomY}px) 
                          scale(${randomScale}) 
                          rotate(${randomRotate}deg)`;
}, 3000);