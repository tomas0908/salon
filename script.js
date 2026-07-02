/* ===========================================
   AURELIA — Landing Page Script
   Весь інтерактив сайту зібраний тут.
   Кожен блок підписаний — шукайте потрібний за коментарем.
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------------------------
     ІНІЦІАЛІЗАЦІЯ AOS (анімації появи блоків при скролі)
     Тут можна змінити: тривалість, затримку, повторення
  ------------------------------------------- */
  if (window.AOS) {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60
    });
  }

  /* -------------------------------------------
     ПРЕЛОАДЕР
     Ховається одразу після повного завантаження сторінки
  ------------------------------------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader && preloader.classList.add('is-hidden'), 300);
  });

  /* -------------------------------------------
     ШАПКА: скляний фон при скролі
     Клас .header--scrolled додається після 60px прокрутки
  ------------------------------------------- */
  const header = document.getElementById('header');
  const toTopBtn = document.getElementById('toTop');

  const onScroll = () => {
    const scrolled = window.scrollY > 60;
    header.classList.toggle('header--scrolled', scrolled);
    toTopBtn.classList.toggle('is-visible', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* -------------------------------------------
     МОБІЛЬНЕ МЕНЮ (бургер)
     Відкриття / закриття бокового меню
  ------------------------------------------- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    burger.classList.toggle('is-active');
    mobileMenu.classList.toggle('is-open');
  });

  // Закриваємо мобільне меню при кліку на будь-яке посилання
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('is-active');
      mobileMenu.classList.remove('is-open');
    });
  });

  /* -------------------------------------------
     RIPPLE-ЕФЕКТ НА КНОПКАХ
     Створює анімовану хвилю у місці кліку
  ------------------------------------------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* -------------------------------------------
     АНІМОВАНА СТАТИСТИКА У HERO (лічильник чисел)
     Числа "накручуються" від 0 до значення data-count
     коли блок з'являється у зоні видимості
  ------------------------------------------- */
  const statNums = document.querySelectorAll('.hero__stat-num');
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1500;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out
      el.textContent = Math.floor(eased * target).toLocaleString('uk-UA');
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString('uk-UA');
    };
    requestAnimationFrame(tick);
  };

  const statsObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNums.forEach(animateCount);
        obs.disconnect();
      }
    });
  }, { threshold: 0.4 });

  const heroStatsBlock = document.querySelector('.hero__stats');
  if (heroStatsBlock) statsObserver.observe(heroStatsBlock);

  /* -------------------------------------------
     СЛАЙДЕР ГАЛЕРЕЇ (Swiper.js)
     Тут можна змінити: кількість слайдів, швидкість, автоплей
  ------------------------------------------- */
  if (window.Swiper) {
    new Swiper('.gallery__slider', {
      slidesPerView: 1.15,
      spaceBetween: 20,
      centeredSlides: false,
      speed: 700,
      pagination: { el: '.gallery .swiper-pagination', clickable: true },
      navigation: { nextEl: '.gallery__next', prevEl: '.gallery__prev' },
      breakpoints: {
        640: { slidesPerView: 1.6, spaceBetween: 24 },
        1000: { slidesPerView: 2.4, spaceBetween: 28 },
        1300: { slidesPerView: 3.2, spaceBetween: 30 }
      }
    });

    /* -------------------------------------------
       СЛАЙДЕР ВІДГУКІВ (Swiper.js)
       Автоматична прокрутка карток з відгуками клієнтів
    ------------------------------------------- */
    new Swiper('.reviews__slider', {
      slidesPerView: 1,
      spaceBetween: 24,
      speed: 700,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.reviews .swiper-pagination', clickable: true },
      breakpoints: {
        720: { slidesPerView: 2 },
        1100: { slidesPerView: 3 }
      }
    });
  }

  /* -------------------------------------------
     СЛАЙДЕР "ДО / ПІСЛЯ"
     Керується через <input type="range"> для доступності
     (працює і мишкою, і з клавіатури, і на дотик)
  ------------------------------------------- */
  const baRange = document.getElementById('baRange');
  const baAfter = document.querySelector('.ba-slider__after');
  const baHandle = document.getElementById('baHandle');

  if (baRange) {
    const updateBaSlider = () => {
      const val = baRange.value;
      baAfter.style.clipPath = `inset(0 0 0 ${val}%)`;
      baHandle.style.left = `${val}%`;
    };
    baRange.addEventListener('input', updateBaSlider);
    updateBaSlider();
  }

  /* -------------------------------------------
     АКОРДЕОН FAQ
     Клік по питанню розкриває/згортає відповідь
     Тут можна змінити: чи закриваються інші пункти автоматично
  ------------------------------------------- */
  const accordionItems = document.querySelectorAll('.accordion__item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion__header');
    const body = item.querySelector('.accordion__body');

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Закриваємо всі інші пункти (акордеон-стиль "один відкритий")
      accordionItems.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.accordion__body').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('is-open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* -------------------------------------------
     ТАЙМЕР АКЦІЇ "-20% до кінця тижня"
     Змінна promoEndDate — тут задається дата закінчення акції
  ------------------------------------------- */
  const promoEndDate = new Date();
  promoEndDate.setDate(promoEndDate.getDate() + 5); // акція діє ще 5 днів від моменту завантаження
  promoEndDate.setHours(23, 59, 59, 0);

  const tDays = document.getElementById('tDays');
  const tHours = document.getElementById('tHours');
  const tMinutes = document.getElementById('tMinutes');
  const tSeconds = document.getElementById('tSeconds');

  const pad = (n) => String(n).padStart(2, '0');

  const updateTimer = () => {
    const diff = promoEndDate.getTime() - Date.now();
    if (diff <= 0 || !tDays) return;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    tDays.textContent = pad(days);
    tHours.textContent = pad(hours);
    tMinutes.textContent = pad(minutes);
    tSeconds.textContent = pad(seconds);
  };

  if (tDays) {
    updateTimer();
    setInterval(updateTimer, 1000);
  }

  /* -------------------------------------------
     ФОРМА ЗАПИСУ
     Тут підключається відправка на backend / CRM / Telegram-бота.
     Наразі показує підтвердження — замініть на fetch() до вашого API.
  ------------------------------------------- */
  const bookingForm = document.getElementById('bookingForm');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Заявку надіслано!';
      submitBtn.style.pointerEvents = 'none';

      // TODO: тут замініть на реальну відправку даних, наприклад:
      // fetch('/api/booking', { method: 'POST', body: new FormData(bookingForm) });

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.pointerEvents = 'auto';
        bookingForm.reset();
      }, 3000);
    });
  }

  /* -------------------------------------------
     РІК У FOOTER (оновлюється автоматично)
  ------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------------------------
     ПЛАВНИЙ СКРОЛ ДО ЯКОРІВ З УРАХУВАННЯМ ВИСОТИ ШАПКИ
  ------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

});
