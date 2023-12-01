'use strict';
document.addEventListener('DOMContentLoaded', () => {
    // Навигация в мобильном виде
    const navToggle = document.querySelector('#navToggle'),
        nav = document.querySelector('#nav');

    navToggle.addEventListener('click', (event) => {
        event.preventDefault();

        body.classList.toggle('show-nav');
        navToggle.classList.toggle('active');
        nav.classList.toggle('show');
    });

    window.addEventListener('orientationchange', (event) => {
        event.preventDefault();
    });

    window.addEventListener('resize', () => {
        body.classList.remove('show-nav');
        navToggle.classList.remove('active');
        nav.classList.remove('show');
    });

    // Изменение цвета заднего фона у шапки
    const intro = document.querySelector('#intro'),
        header = document.querySelector('#header');
    let introH = intro.clientHeight,
        headerH = header.clientHeight;

    function headerScroll() {
        let scrollTop = window.scrollY;
        if (scrollTop >= introH - headerH) {
            header.classList.add('header--dark');
        } else {
            header.classList.remove('header--dark');
        }
    }

    headerScroll();

    // Функция для обработки событий прокрутки и изменения размера окна
    function handleScrollAndResize() {
        headerScroll();
    }

    window.addEventListener('scroll', handleScrollAndResize);
    window.addEventListener('resize', handleScrollAndResize);

    // Плавный скролл к элементам на странице
    const scrollElements = document.querySelectorAll('[data-scroll]');

    function scrollToElement(element, duration) {
        const elementPosition = element.getBoundingClientRect().top;
        const startingY = window.pageYOffset;
        const targetY = startingY + (elementPosition - headerH);

        let startTime = null;

        function scrollAnimation(currentTime) {
            if (startTime === null) {
                startTime = currentTime;
            }

            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easeInOut =
                progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            window.scrollTo(0, startingY + easeInOut * (targetY - startingY));

            if (timeElapsed < duration) {
                requestAnimationFrame(scrollAnimation);
            }
        }

        requestAnimationFrame(scrollAnimation);
    }

    scrollElements.forEach((element) => {
        element.addEventListener('click', (event) => {
            event.preventDefault();
            let dataScroll = element.getAttribute('data-scroll');

            let targetElement = document.querySelector(dataScroll);

            body.classList.remove('show-nav');
            navToggle.classList.remove('active');
            nav.classList.remove('show');

            scrollToElement(targetElement, 500);
        });
    });

    // ScrollSpy
    let navDataScroll = document.querySelectorAll('#nav [data-scroll]');
    let sectionScrollSpy = document.querySelectorAll('[data-scrollspy]');

    window.addEventListener('scroll', () => {
        sectionScrollSpy.forEach((el) => {
            let top = window.scrollY,
                offset = el.offsetTop,
                height = el.offsetHeight,
                id = el.getAttribute('id');

            if (top >= offset - height * 0.33333) {
                navDataScroll.forEach((nav) => {
                    nav.classList.remove('active');

                    let navActive = document.querySelector(
                        `[data-scroll="#${id}"]`
                    );

                    navActive.classList.add('active');
                });
            }

            if (top == 0) {
                let navActive = document.querySelector(
                    `[data-scroll="#${id}"]`
                );
                navActive.classList.remove('active');
            }
        });
    });

    // Модальные окна

    const btnModal = document.querySelectorAll('[data-modal]'),
        modalClient = document.querySelector('#becomeClientModal'),
        modalThanks = document.querySelector('#thanksModal'),
        modalClose = document.querySelectorAll('.modal__close'),
        body = document.querySelector('body'),
        parentModal = document.querySelectorAll('.modal'),
        childModal = document.querySelectorAll('.modal__content');

    function removeClasses() {
        modalClient.classList.remove('show');
        body.classList.remove('no-scroll');
    }

    function closeAnimation() {
        childModal.forEach((child) => {
            child.style.cssText = 'transform: scale(0.5); opacity: 0;';
        });
    }

    btnModal.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            event.preventDefault();
            closeAnimation();
            body.classList.add('no-scroll');

            modalClient.classList.add('show');

            setTimeout(() => {
                childModal.forEach((child) => {
                    child.style.cssText = 'transform: scale(1); opacity: 1;';
                });
            }, 0);
        });
    });

    modalClose.forEach((exit) => {
        exit.addEventListener('click', (event) => {
            event.preventDefault();
            closeAnimation();
            setTimeout(() => {
                // Проверяем, является ли exit частью .modal__close
                if (exit.classList.contains('modal__close')) {
                    removeClasses();
                }
            }, 110);
        });
    });

    parentModal.forEach((modal) => {
        modal.addEventListener('click', (event) => {
            closeAnimation();
            // Проверяем, происходит ли клик внутри .modal__content
            setTimeout(() => {
                if (!event.target.closest('.modal__content')) {
                    removeClasses();
                }
            }, 110);
        });
    });

    childModal.forEach((child) => {
        child.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    });

    // Слайдер 1 - верхний блок

    const sliderItems = document.querySelectorAll('.intro__slider-photo'),
        arrowRight = document.querySelector('#introSliderNext'),
        arrowLeft = document.querySelector('#introSliderPrev');

    let activeSlide = 0;

    function changeSlideRight() {
        sliderItems[activeSlide].classList.remove('slide-active');
        activeSlide =
            activeSlide < sliderItems.length - 1 ? activeSlide + 1 : 0;
        sliderItems[activeSlide].classList.add('slide-active');
    }

    function changeSlideLeft() {
        activeSlide =
            activeSlide > 0 ? activeSlide - 1 : sliderItems.length - 1;
        sliderItems.forEach((item) => item.classList.remove('slide-active'));
        sliderItems[activeSlide].classList.add('slide-active');
    }

    arrowRight.addEventListener('click', () => {
        changeSlideRight();
    });

    arrowLeft.addEventListener('click', () => {
        changeSlideLeft();
    });

    setInterval(() => {
        changeSlideRight();
    }, 4000);

    // 2 Слайдер. Реализован с помощью Swiper.js
    let swiper = new Swiper('.mySwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    // Инициализация библиотеки AOS Animation
    AOS.init();

    // You can also pass an optional settings object
    // below listed default settings
    AOS.init({
        // Global settings:
        disable: 'mobile', // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
        startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
        initClassName: 'aos-init', // class applied after initialization
        animatedClassName: 'aos-animate', // class applied on animation
        useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
        disableMutationObserver: false, // disables automatic mutations' detections (advanced)
        debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
        throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

        // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
        offset: 80, // offset (in px) from the original trigger point
        delay: 0, // values from 0 to 3000, with step 50ms
        duration: 600, // values from 0 to 3000, with step 50ms
        easing: 'ease', // default easing for AOS animations
        once: false, // whether animation should happen only once - while scrolling down
        mirror: false, // whether elements should animate out while scrolling past them
        anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
    });
});
