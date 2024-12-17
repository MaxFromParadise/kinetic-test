document.addEventListener('DOMContentLoaded', () => {
	const swiperSaas = new Swiper('.slider-saas', {
		lazy: true,
		speed: 1000,
		spaceBetween: 80,
		on: {
			init: function () {
				createBullets(this, '.slider-navigation__bullets');
			},
			slideChange: function () {
				updateActiveBullet(this, '.slider-navigation__bullets');
			},
		},
		// pagination: {
		// 	el: '.slider-saas__bullets',
		// 	clickable: true,
		// },
		autoplay: {
			delay: 8000,
		},
		navigation: {
			nextEl: '.slider-saas__arrow_next',
			prevEl: '.slider-saas__arrow_prev',
		},
	});
	const swiperCases = new Swiper('.slider-cases', {
		speed: 1000,
		spaceBetween: 80,
		slidesPerView: 1,
		// pagination: {
		// 	el: '.slider-saas__bullets',
		// 	clickable: true,
		// },
		on: {
			init: function () {
				createBullets(this, '.slider-cases__bullets');
			},
			slideChange: function () {
				updateActiveBullet(this, '.slider-cases__bullets');
			},
		},
		autoplay: {
			delay: 8000,
		},
		navigation: {
			nextEl: '.slider-cases__arrow_next',
			prevEl: '.slider-cases__arrow_prev',
		},
	});
	function createBullets(swiper, className) {
		swiper.slides.forEach((slide, slideIndex) => {
			const bulletsContainer = slide.querySelector(className);
			if (bulletsContainer) {
				swiper.slides.forEach((_, bulletIndex) => {
					const bullet = document.createElement('div');
					bullet.classList.add('bullet');
					if (bulletIndex === slideIndex) bullet.classList.add('active');
					bullet.addEventListener('click', () => swiper.slideTo(bulletIndex));
					bulletsContainer.appendChild(bullet);
				});
			}
		});
	}

	function updateActiveBullet(swiper, className) {
		swiper.slides.forEach((slide, slideIndex) => {
			const bullets = slide.querySelectorAll(`${className} .bullet`);
			bullets.forEach((bullet, bulletIndex) => {
				bullet.classList.toggle('active', bulletIndex === swiper.activeIndex);
			});
		});
	}

	const form = document.querySelector('.form');
	const inputs = document.querySelectorAll('.form__input');

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		let isValid = true;

		inputs.forEach((input) => {
			const label = input.nextElementSibling;

			if (!input.value.trim()) {
				input.classList.add('error');
				label.textContent = 'This field is required';
				label.style.opacity = '1';
				isValid = false;
			} else {
				input.classList.remove('error');
				label.textContent = '';
				label.style.opacity = '0';

				if (input.type === 'email' && !validateEmail(input.value)) {
					input.classList.add('error');
					label.textContent = 'Invalid email format';
					label.style.opacity = '1';
					isValid = false;
				}

				if (input.name === 'number' && !validatePhoneNumber(input.value)) {
					input.classList.add('error');
					label.textContent = 'Invalid phone number';
					label.style.opacity = '1';
					isValid = false;
				}
			}
		});

		if (isValid) {
			form.submit();
		}
	});

	inputs.forEach((input) => {
		input.addEventListener('input', () => {
			const label = input.nextElementSibling;

			if (input.value.trim()) {
				input.classList.remove('error');
				label.textContent = '';
				label.style.opacity = '0';

				if (input.type === 'email' && !validateEmail(input.value)) {
					label.textContent = 'Invalid email format';
					label.style.opacity = '1';
				}

				if (input.name === 'number' && !validatePhoneNumber(input.value)) {
					label.textContent = 'Invalid phone number';
					label.style.opacity = '1';
				}
			}
		});
	});

	function validateEmail(email) {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	function validatePhoneNumber(number) {
		const phoneRegex = /^[+]?\d{3,}$/;
		return phoneRegex.test(number);
	}
	function toggleMenu() {
		const burger = document.querySelector('.burger');
		const menu = document.querySelector('#menu');
		const body = document.body;

		burger.classList.toggle('active');

		menu.classList.toggle('show');
		body.classList.toggle('lock');
	}
	document.querySelector('.menu__close').addEventListener('click', toggleMenu);
	document.querySelector('.burger').addEventListener('click', toggleMenu);
});
// Переменная для хранения высоты .header и .progress-bar
let headerHeight = null;
let progressBarHeight = null;

// Функция для обновления прогресс-бара
function updateProgressBar() {
	const progressBar = document.querySelector('.progress-bar__line span');
	const scrollTop = window.scrollY || document.documentElement.scrollTop;
	const docHeight =
		document.documentElement.scrollHeight -
		document.documentElement.clientHeight;
	const scrollPercentage = (scrollTop / docHeight) * 100;

	progressBar.style.width = `${scrollPercentage}%`;
}

// Функция для обновления активности ссылок в меню
function updateMenuLinks() {
	const links = document.querySelectorAll('.progress-bar__link');
	const sections = document.querySelectorAll('section');

	// Сначала удаляем класс 'active' у всех ссылок
	links.forEach((link) => link.classList.remove('active'));

	// Проверяем, какие секции уже были пролистаны
	sections.forEach((section) => {
		const sectionTop = section.offsetTop;

		// Если секция пролистана (ее верхняя граница выше текущей прокрутки)
		if (window.scrollY >= sectionTop) {
			const sectionId = section.getAttribute('id');
			const activeLink = document.querySelector(
				`.progress-bar__link[href="#${sectionId}"]`
			);

			// Добавляем класс 'active' к ссылке, соответствующей пролистанной секции
			if (activeLink) {
				activeLink.classList.add('active');
			}
		}
	});
}

// Функция для добавления/удаления класса 'progress' в header и обновления padding-top у body
function toggleHeaderProgress() {
	const header = document.querySelector('.header');
	const body = document.querySelector('body');
	const progressBar = document.querySelector('.progress-bar');

	// Если headerHeight и progressBarHeight еще не были рассчитаны, рассчитываем их при первом вызове
	if (headerHeight === null) {
		headerHeight = header ? header.offsetHeight : 0;
	}

	if (progressBarHeight === null) {
		progressBarHeight = progressBar ? progressBar.offsetHeight : 0;
	}

	// Добавляем класс 'progress' и отступ padding-top, если прокрутка больше 200 пикселей
	if (window.scrollY > 250) {
		header.classList.add('progress');
		// Убираем высоту progress-bar из отступа
		body.style.paddingTop = `${headerHeight - progressBarHeight}px`;
	} else {
		header.classList.remove('progress');
		body.style.paddingTop = '0'; // Убираем padding-top
	}
}

// Слушаем событие прокрутки для обновления прогресс-бара, ссылок и header
window.addEventListener('scroll', () => {
	updateProgressBar();
	updateMenuLinks();
	toggleHeaderProgress(); // Обновляем класс 'progress' у header и padding-top у body
});

// Выполняем расчет высоты .header и .progress-bar сразу после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
	const header = document.querySelector('.header');
	const progressBar = document.querySelector('.progress-bar');

	if (header) {
		headerHeight = header.offsetHeight; // Сохраняем высоту элемента .header
	}

	if (progressBar) {
		progressBarHeight = progressBar.offsetHeight; // Сохраняем высоту элемента .progress-bar
	}
});
