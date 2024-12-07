// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
let isDark = false;

themeToggle.addEventListener('click', () => {
    isDark = !isDark;
    body.setAttribute('data-theme', isDark ? 'dark' : 'light');
    if (isDark) {
        createStars();
    } else {
        document.querySelectorAll('.star').forEach(star => star.remove());
    }
});

document.querySelector('.hamburger').addEventListener('click', function() {
  const nav = document.querySelector('nav');
  nav.classList.toggle('active'); // Tambahkan atau hapus kelas 'active'
});


  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault(); // Mencegah perilaku default tautan

      const targetId = this.getAttribute('href'); // Ambil ID target dari href
      const targetElement = document.querySelector(targetId); // Temukan elemen target

      // Gulir ke elemen target dengan efek halus
      targetElement.scrollIntoView({
        behavior: 'smooth' // Mengatur perilaku gulir menjadi halus
      });
    });
  });


// Typing Animation
const words = ['Pelajar', 'Laki-Laki', 'SOCIAL 8'];
const changingText = document.querySelector('.changing-text');
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
        changingText.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        changingText.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        setTimeout(() => isDeleting = true, 1000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
    }

    setTimeout(typeEffect, isDeleting ? typingSpeed / 2 : typingSpeed);
}

// Falling Stars Animation
function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * window.innerWidth + 'px';
    star.style.animation = `falling-star ${3 + Math.random() * 2}s linear`; // Perbaikan di sini
    document.body.appendChild(star);

    star.addEventListener('animationend', () => star.remove());
}

function createStars() {
    if (isDark) {
        createStar();
        setTimeout(createStars, 1000);
    }
}

// Start typing animation
typeEffect();