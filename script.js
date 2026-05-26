'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// SELECTIONS

const nav = document.querySelector('nav');
const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');
const allsections = document.querySelectorAll('.section');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');

///////////////////////////////////////
// SCROLL BEHAVIOUR

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

navLinks.addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log('e.target: ', e.target, 'id: ', id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
// NAV LINKS FADEOUT

// nav.addEventListener('mouseover', function (e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link'); // Including the link
//     const logo = link.closest('.nav').querySelector('img');

//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity = 0.5;
//     });
//     logo.style.opacity = 0.5;
//   }
// });

// nav.addEventListener('mouseout', function (e) {
//   if (e.target.classList.contains('nav__link')) {
//     const link = e.target;
//     const siblings = link.closest('.nav').querySelectorAll('.nav__link');
//     const logo = link.closest('.nav').querySelector('img');

//     siblings.forEach(el => {
//       if (el !== link) el.style.opacity = 1;
//     });
//     logo.style.opacity = 1;
//   }
// });

// USING BIND

const changeOpacity = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;

    const siblings = link.closest('.nav').querySelectorAll('.nav__link'); // Includes link  -->  NodeList(4)[]

    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(sibling => {
      if (sibling !== link) {
        sibling.style.opacity = this;
      }
    });

    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', changeOpacity.bind(0.5));
nav.addEventListener('mouseout', changeOpacity.bind(1));

///////////////////////////////////////
// STICKY NAVIGATION

const navHeight = nav.getBoundingClientRect().height; // 90
// console.log(navHeight);

// a) Function
const stickyNav = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

// b) Object
const optionsObject = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

// c) Observer API
const observeHeader = new IntersectionObserver(stickyNav, optionsObject);

// d) Call Observer API
observeHeader.observe(header);

///////////////////////////////////////
// SECTION REVEAL
const revealSection = function (entries, observer) {
  const entry = entries[0];

  console.log(entry);

  // Gaurd Clause
  if (!entry.isIntersecting) return;

  // Reveal the current section
  entry.target.classList.remove('section--hidden');

  // Stop the observer
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15, // 15%
});

allsections.forEach(section => {
  // The Observer can Observe multiple things at ONCE!
  sectionObserver.observe(section);

  // Hide All Sections
  section.classList.add('section--hidden');
});

///////////////////////////////////////
// TABBED COMPONENTS

tabsContainer.addEventListener('click', function (e) {
  // operations__tab--active
  // operations__tab--1

  const clickedBtn = e.target.closest('.operations__tab');

  // console.log(clickedBtn.dataset); // 1, 2, 3
  if (!clickedBtn) return;

  // Remove active class
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active'),
  );

  // Add active class
  clickedBtn.classList.add('operations__tab--active');

  document
    .querySelector(`.operations__content--${clickedBtn.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////
// LAZY LOADING IMAGES

const images = document.querySelectorAll('img[data-src]'); // Images with data-src attribute

const lazyload = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  // Replace "src" with "data-src"
  entry.target.src = entry.target.dataset.src;

  // Load eventlisteners
  entry.target.addEventListener('load', function () {
    // Remove the blur class
    entry.target.classList.remove('lazy-img');
  });
};

const imageObserver = new IntersectionObserver(lazyload, {
  root: null,
  threshold: 0,
  rootMargin: '70px', // Loads (blur is removed) 70px before we reach the images
});

images.forEach(image => imageObserver.observe(image));

///////////////////////////////////////
// SLIDER COMPONENT

// states
let currSlide = 0;
const maxSlide = slides.length - 1; // 3

// 1. Dots
// Dots
function createDots() {
  slides.forEach((_, index) => {
    return dotsContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${index}"></button>`,
    );
  });
}
createDots();

function activateDots(slide) {
  // 1. Remove active class from all dots first
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  // Add active class to current dot using the data-slide attribute
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
}

activateDots(currSlide);

// Dots events
dotsContainer.addEventListener('click', function (e) {
  // 1. Get the click target
  if (e.target.classList.contains('dots__dot')) {
    console.log(e.target.dataset.slide);

    // Get the current dot with it's dataset
    const currentDot = Number(e.target.dataset.slide);

    slides.forEach(
      (slide, index) =>
        (slide.style.transform = `translateX(${100 * (index - currentDot)}%)`),
    );

    activateDots(currentDot);
  }
});

// 2. Buttons & Arrows
slides.forEach(
  (slide, index) => (slide.style.transform = `translateX(${100 * index}%)`),
);

// handlers
function nextSlide() {
  if (currSlide === maxSlide) {
    currSlide = 0;
  } else currSlide++;

  // Loop through the slides and change their postions
  slides.forEach(
    (slide, index) =>
      (slide.style.transform = `translateX(${100 * (index - currSlide)}%)`),
  );

  // Activate dots
  activateDots(currSlide); // 👈 add this
}

function previousSlide() {
  if (currSlide === 0) {
    currSlide = maxSlide;
  } else currSlide--;

  // Loop through the slides and change their postions
  slides.forEach(
    (slide, index) =>
      (slide.style.transform = `translateX(${100 * (index - currSlide)}%)`),
  );

  // Activate dots
  activateDots(currSlide); // 👈 add this
}

// Click events
btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', previousSlide);

// Keyboard events
document.addEventListener('keydown', function (e) {
  e.key === 'ArrowLeft' && previousSlide();
  e.key === 'ArrowRight' && nextSlide();
});
