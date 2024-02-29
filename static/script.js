document.addEventListener('DOMContentLoaded', (event) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        } else {
          entry.target.classList.remove('visible');
        }
      });
    }, {
      threshold: 0.5 // Trigger when 50% of the target is visible
    });
  
    const map = document.querySelector('.map-container');
    observer.observe(map);
  });
  