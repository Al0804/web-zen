// DOM Elements
const header = document.getElementById('header');
const footer = document.getElementById('footer');
const hamburger = document.getElementById('hamburger');
const navbar = document.querySelector('.navbar');
const sections = document.querySelectorAll('section');
const themeToggle = document.getElementById('theme-toggle');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const kinniesSlider = document.querySelector('.kinnies-slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const playBtns = document.querySelectorAll('.play-btn');
const pauseBtns = document.querySelectorAll('.pause-btn');
const audioElements = document.querySelectorAll('audio');
const progressBars = document.querySelectorAll('.progress-bar');
const musicDurations = document.querySelectorAll('.music-duration');

// Song durations in seconds
const songDurations = [249, 142, 264, 159, 258]; // 4:09, 2:22, 4:24, 2:39, 4:18

// Typology Text Effect
const typologyTextElement = document.getElementById('typology-text');
const typologyText = "SLE ES(T) Sp/Sx 836 VFEL Chol-Phleg";
let typologyIndex = 0;
function typeTypology() {
    const currentText = typologyText.substring(0, typologyIndex);
    typologyTextElement.textContent = currentText;
    
    if (typologyIndex < typologyText.length) {
        typologyIndex++;
        setTimeout(typeTypology, 50);
    } else {
        typologyIndex = 0;
        setTimeout(typeTypology, 3000);
    }
}

typeTypology();

// Current slide index
let currentSlide = 0;
let slideCount = document.querySelectorAll('.kinnie-card').length;

// Last scroll position
let lastScrollY = window.scrollY;

// Check for saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Toggle Dark/Light Mode
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', 'dark');
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        localStorage.setItem('theme', 'light');
    }
});

// Toggle Mobile Menu
hamburger.addEventListener('click', () => {
    navbar.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu when clicking a link
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Scroll Events
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Hide/Show Header on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.classList.add('hidden');
    } else {
        header.classList.remove('hidden');
    }
    
    // Hide/Show Footer
    if (window.innerHeight + currentScrollY >= document.body.offsetHeight - 100) {
        footer.classList.remove('hidden');
    } else {
        footer.classList.add('hidden');
    }
    
    lastScrollY = currentScrollY;
    
    // Check which section is in view
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (currentScrollY >= sectionTop && currentScrollY < sectionBottom) {
            section.classList.add('active');
            
            // Highlight current nav item
            const id = section.getAttribute('id');
            document.querySelectorAll('.navbar a').forEach(navLink => {
                navLink.classList.remove('active');
                if (navLink.getAttribute('href') === `#${id}`) {
                    navLink.classList.add('active');
                }
            });
        }
    });
});


// Scroll Animation


const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('hidden');
        } else {
            entry.target.classList.add('hidden');
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        
        // Remove active class from all buttons and tabs
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(t => t.classList.remove('active'));
        
        // Add active class to current button and tab
        btn.classList.add('active');
        document.getElementById(`${tab}-tab`).classList.add('active');
    });
});

// Kinnies Slider
function moveSlider() {
    const slideWidth = kinniesSlider.clientWidth;
    kinniesSlider.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
}

// Initialize slider position
moveSlider();

// Resize event to adjust slider
window.addEventListener('resize', moveSlider);

// Next and Previous buttons
nextBtn.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slideCount;
    moveSlider();
});

prevBtn.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slideCount) % slideCount;
    moveSlider();
});

// Audio Player Functions
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Update progress bar and time display during playback
function updateProgress(index) {
    const audio = audioElements[index];
    const progressBar = progressBars[index];
    const durationDisplay = musicDurations[index];
    
    if (audio.duration) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${progress}%`;
        
        const currentTime = formatTime(audio.currentTime);
        const totalTime = formatTime(songDurations[index]);
        durationDisplay.textContent = `${currentTime} / ${totalTime}`;
    }
}

// Set up audio players
playBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        // Pause all other audio
        audioElements.forEach((audio, i) => {
            if (i !== index && !audio.paused) {
                audio.pause();
                playBtns[i].style.display = 'flex';
                pauseBtns[i].style.display = 'none';
            }
        });
        
        // Play current audio
        const audio = audioElements[index];
        audio.play();
        
        // Show pause button, hide play button
        btn.style.display = 'none';
        pauseBtns[index].style.display = 'flex';
        
        // Set up progress tracking
        audio.addEventListener('timeupdate', () => updateProgress(index));
    });
});

pauseBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        // Pause audio
        audioElements[index].pause();
        
        // Show play button, hide pause button
        btn.style.display = 'none';
        playBtns[index].style.display = 'flex';
    });
});

// Initialize music duration displays
musicDurations.forEach((display, index) => {
    const totalTime = formatTime(songDurations[index]);
    display.textContent = `0:00 / ${totalTime}`;
});

// Initialize sections visibility
sections.forEach(section => {
    const sectionTop = section.offsetTop - window.innerHeight;
    const sectionBottom = sectionTop + section.offsetHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionBottom) {
        section.classList.add('active');
    }
});

