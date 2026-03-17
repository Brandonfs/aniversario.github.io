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
let currentGalleryIndex = 0;

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

function startMusicWithFadeIn() {
    const audio = document.getElementById('bgmusic');

    audio.volume = 0;

    audio.play()
        .then(() => {
            isPlaying = true;

            clearInterval(volumeInterval);
            volumeInterval = setInterval(() => {
                if (audio.volume < 0.12) {
                    audio.volume = Math.min(audio.volume + 0.01, 0.12);
                } else {
                    clearInterval(volumeInterval);
                }
            }, 60);
        })
        .catch(() => { });
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

function getGalleryItems() {
    return Array.from(document.querySelectorAll('#step4 .gallery img, #step4 .gallery video'));
}

function getGalleryItemSource(item) {
    if (item.tagName === 'VIDEO') {
        const source = item.querySelector('source');
        return source ? source.getAttribute('src') : item.getAttribute('src');
    }

    return item.getAttribute('src');
}

function updateLightboxContent() {
    const items = getGalleryItems();
    const item = items[currentGalleryIndex];
    const mediaContainer = document.getElementById('lightbox-media');
    const title = document.getElementById('lightbox-title');
    const prevButton = document.getElementById('lightbox-prev');
    const nextButton = document.getElementById('lightbox-next');

    if (!item || !mediaContainer) {
        return;
    }

    mediaContainer.innerHTML = '';

    const source = getGalleryItemSource(item);
    const altText = item.getAttribute('alt') || `Recuerdo ${currentGalleryIndex + 1}`;
    title.textContent = `${altText} (${currentGalleryIndex + 1}/${items.length})`;

    if (item.tagName === 'VIDEO') {
        const video = document.createElement('video');
        video.src = source;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        mediaContainer.appendChild(video);
    } else {
        const image = document.createElement('img');
        image.src = source;
        image.alt = altText;
        mediaContainer.appendChild(image);
    }

    prevButton.disabled = items.length <= 1;
    nextButton.disabled = items.length <= 1;
}

function openLightbox(index) {
    const lightbox = document.getElementById('gallery-lightbox');
    const items = getGalleryItems();

    if (!lightbox || !items.length) {
        return;
    }

    currentGalleryIndex = index;
    updateLightboxContent();
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('gallery-lightbox');
    const mediaContainer = document.getElementById('lightbox-media');

    if (!lightbox) {
        return;
    }

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (mediaContainer) {
        mediaContainer.innerHTML = '';
    }
}

function changeLightboxItem(direction) {
    const items = getGalleryItems();

    if (items.length <= 1) {
        return;
    }

    currentGalleryIndex = (currentGalleryIndex + direction + items.length) % items.length;
    updateLightboxContent();
}

function initGalleryViewer() {
    const items = getGalleryItems();
    const closeButton = document.getElementById('lightbox-close');
    const prevButton = document.getElementById('lightbox-prev');
    const nextButton = document.getElementById('lightbox-next');
    const lightbox = document.getElementById('gallery-lightbox');

    items.forEach((item, index) => {
        item.setAttribute('tabindex', '0');
        item.setAttribute('data-gallery-index', index);
        item.addEventListener('click', () => openLightbox(index));
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openLightbox(index);
            }
        });
    });

    if (closeButton) {
        closeButton.addEventListener('click', closeLightbox);
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => changeLightboxItem(-1));
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => changeLightboxItem(1));
    }

    if (lightbox) {
        lightbox.addEventListener('click', (event) => {
            if (event.target instanceof HTMLElement && event.target.dataset.closeLightbox === 'true') {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (!lightbox || !lightbox.classList.contains('is-open')) {
            return;
        }

        if (event.key === 'Escape') {
            closeLightbox();
        }

        if (event.key === 'ArrowLeft') {
            changeLightboxItem(-1);
        }

        if (event.key === 'ArrowRight') {
            changeLightboxItem(1);
        }
    });
}

window.onload = () => {
    initSlideshow();
    createHearts();
    initDateCounter();
    initGalleryViewer();

    // Permite presionar Enter en el campo de contraseña.
    document.getElementById('password-input').addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            validatePassword();
        }
    });
};