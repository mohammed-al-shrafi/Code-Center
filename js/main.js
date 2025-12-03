import {
  ul,
  linksTags,
  hamburger,
  courseType,
  modal,
  cancelBtn,
  closeModalBtn,
  submitBtn,
  bookCoursebtn,
  user,
  tel,
  courseSelect,
  buyBtns,
} from './elements.js';

/**
 * Open modal
 */
export const openModal = (e) => {
  const course = e.currentTarget?.dataset?.course;

  if (!modal) return;

  // Set the select value to match the course from data attribute
  if (course) {
    courseSelect.value = course;
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

export const closeModal = () => {
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

export const closeModalOnClickOutside = (e) => {
  if (e.target === modal) {
    closeModal();
  }
};

export const setupModalListeners = () => {
  if (bookCoursebtn) {
    bookCoursebtn.addEventListener('click', openModal);
  }
  // Close modal when clicking outside of it
  if (modal) {
    modal.addEventListener('click', closeModalOnClickOutside);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Get the values from inputs
      const userName = user.value;
      const userPhone = tel.value;
      const userCourse = courseSelect.value;

      // Store in localStorage
      localStorage.setItem('Name', userName);
      localStorage.setItem('phone', userPhone);
      localStorage.setItem('Course', userCourse);

      closeModal();
    });
  }
};

export const init = () => {
  if (!ul || !hamburger) {
    // nothing to do if layout differs
    return;
  } else {
    // set initial aria state
    ul.setAttribute('aria-hidden', 'true');

    // set active link properly
    linksTags.forEach((link) => {
      link.addEventListener('click', (e) => {
        // remove active from all
        linksTags.forEach((l) => l.classList.remove('active'));
        // add to clicked
        e.currentTarget.classList.add('active');

        // on small screens, close menu after click
        if (ul.classList.contains('show')) {
          ul.classList.remove('show');
          ul.setAttribute('aria-hidden', 'true');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // helper to get focusable links inside nav
    const getNavLinks = () => Array.from(ul.querySelectorAll('a'));

    // hamburger toggle + aria
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isOpen = ul.classList.toggle('show');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      ul.setAttribute('aria-hidden', String(!isOpen));

      // focus first link when opened
      const first = getNavLinks()[0];
      if (isOpen && first) first.focus();
    });

    // close menu when clicking outside
    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!target.closest('.nav-bar') && ul.classList.contains('show')) {
        ul.classList.remove('show');
        ul.setAttribute('aria-hidden', 'true');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // close menu on Escape key, and handle simple Tab trap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && ul.classList.contains('show')) {
        ul.classList.remove('show');
        ul.setAttribute('aria-hidden', 'true');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.focus();
        return;
      }

      if (ul.classList.contains('show') && e.key === 'Tab') {
        const links = getNavLinks();
        if (links.length === 0) return;
        const first = links[0];
        const last = links[links.length - 1];
        const activeEl = document.activeElement;

        if (e.shiftKey && activeEl === first) {
          // shift+tab on first -> move focus to last
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && activeEl === last) {
          // tab on last -> move focus to first
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  courseType.forEach((type) => {
    if (type.innerText === '') {
      type.style.display = 'none';
    }
  });

  buyBtns.forEach((buyBtn) => {
    buyBtn.addEventListener('click', openModal);
  });

  setupModalListeners();
};
init();
