// js/main.js

document.addEventListener('DOMContentLoaded', () => {

    gsap.registerPlugin(ScrollTrigger);

    // --- 1. VIDEO PLAYER LOGIC ---
    const videoElement = document.getElementById('portfolio-video');
    const prevBtn = document.getElementById('prev-video');
    const nextBtn = document.getElementById('next-video');

    const videoSources = [
        '../img/3.mp4',
        '../img/VGA.mp4'
    ];

    let currentVideoIndex = 0;

    function changeVideo(direction) {
        if (!videoElement || videoSources.length === 0) return;
        if (direction === 'next') {
            currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
        } else if (direction === 'prev') {
            currentVideoIndex = (currentVideoIndex - 1 + videoSources.length) % videoSources.length;
        }

        videoElement.src = videoSources[currentVideoIndex];
        videoElement.play();
    }

    if (videoElement && videoSources.length > 0) {
        videoElement.src = videoSources[0];
        nextBtn.addEventListener('click', () => changeVideo('next'));
        prevBtn.addEventListener('click', () => changeVideo('prev'));
    }

    // --- 2. DYNAMIC CONTENT & SCROLL ANIMATION LOGIC ---
    const artworkProjects = [{
        title: "Curfewed Market Scene Diorama",
        description: "Modeled in 3dsMax, Textured in Substance Painter, and Rendered in ART.",
        images: ["img/diorama-proto4.jpg", ],
    }, {
        title: "Textured Robot",
        description: "Unwrapped UVs and applied textures in 3ds Max, rendered in Arnold as a part of school project.Asset modeled by Roxanne Resh.",
        images: ["img/robot-textured.jpg","img/robot-render2.jpg", "img/robot-render3.jpg"],
    }, {
        title: "Scavenger Character3d Character - Arka",
        description: "3d model of a character and a diorama sculpted, polypainted, and rendered in Zbrush.",
        images: ["img/render-pose2.jpg", "img/pose-render.jpg"],
    },{
        title: "Kitchen Scene",
        description: "Modeled a kitchen scene in 3ds max and rendered using ART as a part of school project.",
        images: ["img/rendered-kitchen2.jpg", "img/renderedkitchen.jpg"],
    }];

    const conceptArtProjects = [{
        title: "The Last Scavenger",
        description: "Concept Character made using Photoshop.",
        images: ["img/scavenger.jpg"],
    }, {
        title: "Mussafir",
        description: "Concept Character made using Photoshop.",
        images: ["img/AIS.jpg"],
    } //,{
    //     title: "Design",
    //     description: "Concept art for a legendary sword. Multiple variations were created to find the right feel for the game's hero.",
    //     images: ["img/concept-4.jpg", "img/concept-5.jpg", "img/concept-6.jpg"],
    // } 
     ];

function setupScrubAnimation(config) {
    const {
        sectionId,
        projectData,
        progressBarId
    } = config;
    const section = document.querySelector(sectionId);
    if (!section) return;

    // Check if we are on a mobile device
    if (window.matchMedia("(max-width: 900px)").matches) {
        // --- MOBILE LAYOUT ---
        const mobileContainer = section.querySelector('.portfolio-mobile-container');
        if (!mobileContainer) return;

        projectData.forEach(project => {
            if (project.images.length === 0) return;
            const card = document.createElement('div');
            card.className = 'mobile-project-card';
            const img = document.createElement('img');
            img.src = project.images[0];
            img.alt = project.title;
            card.appendChild(img);
            const title = document.createElement('h3');
            title.textContent = project.title;
            card.appendChild(title);
            const description = document.createElement('p');
            description.textContent = project.description;
            card.appendChild(description);
            mobileContainer.appendChild(card);
        });

    } else {
        // --- DESKTOP SCROLLING LAYOUT ---
        const imageContainer = section.querySelector('.portfolio-image-card');
        const textContainer = section.querySelector('.portfolio-text-content');
        const progressBar = section.querySelector(progressBarId);
        const grid = section.querySelector('.portfolio-grid');

        if (!imageContainer || !textContainer || !grid) return;

        const allProjectImages = [];

        // Populate the DOM with images and text for the animation
        projectData.forEach((project) => {
            const textSection = document.createElement('div');
            textSection.className = "project-text-section";
            textSection.innerHTML = `<h3>${project.title}</h3><p>${project.description}</p>`;
            textContainer.appendChild(textSection);

            const currentProjectImages = [];
            project.images.forEach((imageUrl) => {
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = project.title;
                imageContainer.appendChild(imgElement);
                currentProjectImages.push(imgElement);
            });
            allProjectImages.push(currentProjectImages);
        });

        // --- NEW CODE STARTS HERE ---
        // Manually make the very first text and image visible before the animation starts.
        // This prevents the "black box" on initial scroll.
        const firstText = textContainer.querySelector('.project-text-section:first-child');
        const firstImage = imageContainer.querySelector('img:first-child');

        if (firstText) {
            firstText.style.opacity = 1;
        }
        if (firstImage) {
            firstImage.style.opacity = 1;
        }
        // --- NEW CODE ENDS HERE ---

        // Set up the GSAP timeline for the scroll animation
        const textSections = gsap.utils.toArray(section.querySelectorAll('.project-text-section'));
        const scrollDistance = (projectData.length * 1000) + 1000;
        const header = document.getElementById('main-header');
        const headerHeight = header ? header.offsetHeight : 0;

        const masterTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: grid,
                start: `top ${headerHeight}px`,
                end: `+=${scrollDistance}`,
                pin: true,
                scrub: 1,
            }
        });

        if (progressBar) {
            masterTimeline.to(progressBar, {
                scaleX: 1,
                ease: 'none'
            }, 0);
        }

        projectData.forEach((project, index) => {
            const currentText = textSections[index];
            const currentImages = allProjectImages[index];

            // Only fade IN elements that are NOT the first one (since it's already visible)
            if (index > 0) {
                masterTimeline.to(currentText, { opacity: 1, duration: 0.3 });
                masterTimeline.to(currentImages[0], { opacity: 1, duration: 0.3 }, "<");
            }

            // Handle cycling through multiple images within a single project
            if (currentImages.length > 1) {
                for (let i = 1; i < currentImages.length; i++) {
                    masterTimeline.to(currentImages[i - 1], { opacity: 0, duration: 0.2 }, "+=0.6");
                    masterTimeline.to(currentImages[i], { opacity: 1, duration: 0.2 }, "<");
                }
            }

            // Fade OUT the current project to make way for the next one
            if (index < projectData.length - 1) {
                masterTimeline.to(currentText, { opacity: 0, duration: 0.3 }, "+=0.8");
                masterTimeline.to(currentImages[currentImages.length - 1], { opacity: 0, duration: 0.3 }, "<");
            }
        });
        masterTimeline.to({}, { duration: 1.5 }); // Add extra space at the end
    }
}

    // Initialize the animations for both sections
    setupScrubAnimation({ sectionId: '#artworks', projectData: artworkProjects, progressBarId: '#artworks-progress .progress' });
    setupScrubAnimation({ sectionId: '#concept-art', projectData: conceptArtProjects, progressBarId: '#concept-art-progress .progress' });


    // --- 3. LIGHTBOX LOGIC ---
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    const lightboxImg = document.getElementById('lightbox-img');
    
    // Event delegation for opening the lightbox
    document.body.addEventListener('click', (e) => {
        // Check if a project image was clicked (works for both desktop and mobile layouts)
        const clickedImg = e.target.closest('.portfolio-image-card img, .mobile-project-card img');
        if (clickedImg) {
            // On desktop, find the currently visible image
            const imageCard = clickedImg.closest('.portfolio-image-card');
            if(imageCard) {
                const visibleImage = Array.from(imageCard.querySelectorAll('img')).find(img => getComputedStyle(img).opacity == 1);
                 if (visibleImage) {
                    openLightbox(visibleImage.src);
                 }
            } else {
                // On mobile, just use the clicked image's src
                openLightbox(clickedImg.src);
            }
        }
    });
    
    let isDragging = false, currentScale = 1, minScale = 1, maxScale = 4;
    let startPos = { x: 0, y: 0 }, currentTranslate = { x: 0, y: 0 }, startTranslate = { x: 0, y: 0 };

    function openLightbox(src) {
        lightboxImg.src = src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        addLightboxEventListeners();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            currentScale = 1;
            currentTranslate = { x: 0, y: 0 };
            lightboxContent.style.transform = 'translate(0px, 0px)';
            lightboxImg.style.transform = 'scale(1)';
            lightboxImg.classList.remove('is-pannable', 'is-dragging');
            lightboxContent.classList.remove('is-dragging');
        }, 300);
        removeLightboxEventListeners();
    }

    function handleWheel(e) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.2 : 0.2;
        currentScale = Math.max(minScale, Math.min(currentScale + delta, maxScale));
        lightboxImg.style.transform = `scale(${currentScale})`;
        if (currentScale <= minScale) {
            currentTranslate = { x: 0, y: 0 };
            lightboxContent.style.transform = 'translate(0px, 0px)';
            lightboxImg.classList.remove('is-pannable');
        } else {
            lightboxImg.classList.add('is-pannable');
        }
    }

    function startDrag(e) {
        if (currentScale <= minScale) return;
        e.preventDefault();
        isDragging = true;
        startPos = { x: e.clientX, y: e.clientY };
        startTranslate = { ...currentTranslate };
        lightboxImg.classList.add('is-dragging');
        lightboxContent.classList.add('is-dragging');
    }

    function onDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const dx = e.clientX - startPos.x;
        const dy = e.clientY - startPos.y;
        currentTranslate.x = startTranslate.x + dx;
        currentTranslate.y = startTranslate.y + dy;
        lightboxContent.style.transform = `translate(${currentTranslate.x}px, ${currentTranslate.y}px)`;
    }

    function endDrag(e) {
        if (!isDragging) return;
        isDragging = false;
        lightboxImg.classList.remove('is-dragging');
        lightboxContent.classList.remove('is-dragging');
    }

    function handleKeydown(e) { if (e.key === "Escape") closeLightbox(); }
    function handleClickOutside(e) { if (e.target === lightbox) closeLightbox(); }

    function addLightboxEventListeners() {
        document.addEventListener('keydown', handleKeydown);
        lightbox.addEventListener('click', handleClickOutside);
        lightbox.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
        lightbox.addEventListener('wheel', handleWheel, { passive: false });
        lightboxContent.addEventListener('mousedown', startDrag);
        window.addEventListener('mousemove', onDrag);
        window.addEventListener('mouseup', endDrag);
    }

    function removeLightboxEventListeners() {
        document.removeEventListener('keydown', handleKeydown);
        lightbox.removeEventListener('click', handleClickOutside);
        const closeButton = lightbox.querySelector('.close-lightbox');
        if (closeButton) { closeButton.removeEventListener('click', closeLightbox); }
        lightbox.removeEventListener('wheel', handleWheel);
        lightboxContent.removeEventListener('mousedown', startDrag);
        window.removeEventListener('mousemove', onDrag);
        window.removeEventListener('mouseup', endDrag);
    }
});