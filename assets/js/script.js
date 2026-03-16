const PASSWORD = '1703';
const FIXED_START_DATE = '2025-03-17T00:00:00';
const backgroundImages = [
    'assets/images/fondo1.jpeg',
    'assets/images/fondo2.jpeg',
    'assets/images/fondo3.jpeg',
    'assets/images/fondo4.jpeg',
    'assets/images/fondo5.jpeg'
];
const slideInterval = 5000;

let isPlaying = false;
let volumeInterval = null;
let timerInterval = null;

function initSlideshow() {
    const slideshow = document.getElementById('slideshow');

    backgroundImages.forEach((image, index) => {
        const slide = document.createElement('div');
        slide.className = `slide${index === 0 ? ' active' : ''}`;
        slide.style.backgroundImage = `url('${image}')`;
        slideshow.appendChild(slide);
    });

    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');

    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, slideInterval);
}

function toggleMusic() {
    const audio = document.getElementById('bgmusic');
    const btn = document.querySelector('#music-player button');
    const status = document.getElementById('music-status');

    if (isPlaying) {
        audio.pause();
        btn.textContent = '🎵 Reproducir';
        status.textContent = 'Música pausada';
        isPlaying = false;
        return;
    }

    audio.play()
        .then(() => {
            btn.textContent = '⏸️ Pausar';
            status.textContent = '🎶 Reproduciendo...';
            isPlaying = true;
        })
        .catch(() => {
            status.textContent = 'Pulsa de nuevo para activar música';
        });
}

function startMusicWithFadeIn() {
    const audio = document.getElementById('bgmusic');
    const btn = document.querySelector('#music-player button');
    const status = document.getElementById('music-status');

    audio.volume = 0;

    audio.play()
        .then(() => {
            isPlaying = true;
            btn.textContent = '⏸️ Pausar';
            status.textContent = '🎶 Reproduciendo...';

            clearInterval(volumeInterval);
            volumeInterval = setInterval(() => {
                if (audio.volume < 0.12) {
                    audio.volume = Math.min(audio.volume + 0.01, 0.12);
                } else {
                    clearInterval(volumeInterval);
                }
            }, 60);
        })
        .catch(() => {
            status.textContent = 'Activa la música con el botón';
        });
}

function createHearts() {
    const container = document.getElementById('hearts-container');
    const heartSymbols = ['💕', '💖', '💗', '💓', '💘', '❤️', '💝'];

    for (let i = 0; i < 36; i += 1) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 8}s`;
        heart.style.fontSize = `${Math.random() * 18 + 16}px`;
        container.appendChild(heart);
    }
}

function goToStep(step) {
    document.querySelectorAll('.container').forEach((container) => {
        container.classList.remove('active');
    });

    const target = document.getElementById(`step${step}`);
    if (target) {
        target.classList.add('active');
    }
}

function validatePassword() {
    const input = document.getElementById('password-input');
    const errorText = document.getElementById('password-error');

    if (input.value.trim() === PASSWORD) {
        errorText.textContent = '';
        goToStep(2);
        if (!isPlaying) {
            startMusicWithFadeIn();
        }
        return;
    }

    errorText.textContent = 'Contraseña incorrecta, intenta nuevamente.';
}

function updateElapsedTime() {
    const selectedDate = new Date(FIXED_START_DATE);

    if (Number.isNaN(selectedDate.getTime())) {
        return;
    }

    const now = new Date();
    let diff = now.getTime() - selectedDate.getTime();
    if (diff < 0) {
        diff = 0;
    }

    const totalMinutes = Math.floor(diff / (1000 * 60));
    const totalHours = Math.floor(totalMinutes / 60);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    const minutes = totalMinutes % 60;

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
}

function initDateCounter() {
    updateElapsedTime();
    clearInterval(timerInterval);
    timerInterval = setInterval(updateElapsedTime, 1000);
}

window.onload = () => {
    initSlideshow();
    createHearts();
    initDateCounter();

    // Permite presionar Enter en el campo de contraseña.
    document.getElementById('password-input').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            validatePassword();
        }
    });
};