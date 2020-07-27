
window.addEventListener("DOMContentLoaded", () => {

// Tabs
	const tabContent = document.querySelectorAll(".tabcontent"),
	tabsParent = document.querySelector(".tabheader__items"),
	tabItem = document.querySelectorAll(".tabheader__item");

	function hideAllTabs(){
		tabContent.forEach(item => {
		item.style.display = "none";
	});

	tabItem.forEach(item => {
		item.classList.remove("tabheader__item_active");
	});
	}

	function showTabContent(i = 0){
		tabContent[i].style.display = "block";
		tabItem[i].classList.add("tabheader__item_active");
	}

	tabsParent.addEventListener("click", (event) => {
	let target = event.target;
	if(target && target.classList.contains("tabheader__item")){
		tabItem.forEach((item, index) => {
			if (target == item){
				hideAllTabs();
				showTabContent(index);
			}
		});
	}
	});

	hideAllTabs();
	showTabContent();

// Timers

	const deadline = "2020-07-16T14:14";

	function calcDiffer(endtime){
		const milliseconds = Date.parse(endtime) - Date.parse(new Date()),
					days = Math.floor(milliseconds / (1000 * 60 * 60 * 24)),
					hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24),
					minutes = Math.floor((milliseconds / (1000 * 60)) % 60),
					seconds = Math.floor((milliseconds / 1000) % 60);

		return {
			days,
			hours,
			minutes,
			seconds,
			milliseconds
		};
	}

	function setZero(data){
		if (data >= 0 && data < 10){
			return `0${data}`;
		} else{
			return data;
		}
	}

	function setTime(selector, endtime){
		const timer = document.querySelector(selector),
					days = timer.querySelector("#days"),
					hours = timer.querySelector("#hours"),
					minutes = timer.querySelector("#minutes"),
					seconds = timer.querySelector("#seconds");
		let timerId;

		updateTime();

		function updateTime(){
			const time = calcDiffer(endtime);
			days.innerHTML = setZero(time.days);
			hours.innerHTML = setZero(time.hours);
			minutes.innerHTML = setZero(time.minutes);
			seconds.innerHTML = setZero(time.seconds);

			if (time.milliseconds <= 0){
				if (timerId){
					clearInterval(timerId);
				}
				days.innerHTML = 0;
				hours.innerHTML = 0;
				minutes.innerHTML = 0;
				seconds.innerHTML = 0;
			}
		}

		timerId = setInterval(updateTime, 3000);
	}

	setTime(".timer", deadline);

// Modal window

	const modalWindowBtn = document.querySelectorAll("[data-modal]"),
				modalWindowContent = document.querySelector(".modal");
				// modalWindowCloseBtn = document.querySelector("[data-close]");

	modalWindowBtn.forEach(item => {
		item.addEventListener("click", () => {
			openModal();
		});
	});

	function openModal(){
		modalWindowContent.classList.add("show");
		modalWindowContent.classList.remove("hide");
		document.body.style.overflow = "hidden";
		// clearTimeout(modalTimerId);
	}

	function closeModal(){
		modalWindowContent.classList.add("hide");
		modalWindowContent.classList.remove("show");
		document.body.style.overflow = "";
	}

	// modalWindowCloseBtn.addEventListener("click", closeModal);

	modalWindowContent.addEventListener("click", (e) => {
		if (e.target === modalWindowContent || e.target.getAttribute("data-close") == ""){
			closeModal();
		}
	});

	document.addEventListener("keydown", (e) => {
		if (e.code == "Escape" && modalWindowContent.classList.contains("show")){
			closeModal();
		}
	});

	// const modalTimerId = setTimeout(openModal, 6000);

	function modalScrollOpen(){
		if (window.pageYOffset + document.documentElement.clientHeight == document.documentElement.scrollHeight){
			openModal();
			window.removeEventListener("scroll", modalScrollOpen);
		}
	}

	window.addEventListener("scroll", modalScrollOpen);

//Создаем класс

	class MenuCard{
		constructor(src, alt, title, descr, price, ...classes){
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.transfer = 70;
			this.classes = classes;
			this.transferToRuble();
		}

		transferToRuble(){
			this.price = this.price * this.transfer;
		}

		createCard(){
			let divMenuItem = document.createElement("div");
			if (this.classes.length == 0){
				divMenuItem.className = "menu__item";
			} else{
				this.classes.forEach(item => {
					divMenuItem.classList.add(item);
				});
			}

			divMenuItem.innerHTML = `
				<img src=${this.src} alt=${this.alt}>
				<h3 class="menu__item-subtitle">${this.title}</h3>
				<div class="menu__item-descr">${this.descr}</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
						<div class="menu__item-cost">Цена:</div>
						<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
				</div>`;

			let container = document.querySelector(".menu__field .container");
			container.append(divMenuItem);
		}
	}

	new MenuCard(
		"img/tabs/vegy.jpg",
		"vegy",
		'Меню "Фитнес"',
		`Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. 
		Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!`,
		229,
		"menu__item",
		"aaa",
		"sdsdsdsd").createCard();

	new MenuCard(
		"img/tabs/elite.jpg",
		"elite",
		'Меню “Премиум”',
		`В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. 
		Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!`,
		550).createCard();

	new MenuCard(
		"img/tabs/post.jpg",
		"post",
		'Меню "Постное"',
		`Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, 
		молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных 
		вегетарианских стейков.`,
		430).createCard();

// Forms POST

		let forms = document.querySelectorAll("form");

		const textMessage = {
			ok: "Всё ок",
			loading: "icons/spinner.svg",
			fail: "Трабл"
		};

		forms.forEach(item => {
			postData(item);
		});

		function postData(form){
			form.addEventListener("submit", (e) => {
				e.preventDefault();

				let statusMessage = document.createElement("img");
				statusMessage.src = textMessage.loading;
				statusMessage.style.cssText = `
					display: block;
					margin: 0 auto;
				`;
				form.insertAdjacentElement("afterend", statusMessage);

				let formData = new FormData(form);
				// console.log(formData);
				let obj = {};
				formData.forEach((value, key) => {
					obj[key] = value;
				});

				fetch("server.php", {
					method: "POST",
					headers: {
						'Content-type': 'application/json'
					},
					body: JSON.stringify(obj)
				})
				.then(data => {
					console.log("data", data);
					return data.text();
				})
				.then(data => {
					console.log(data);
					showModalThanks(textMessage.ok);
					statusMessage.remove();
				}).catch(() => {
					showModalThanks(textMessage.fail);
				}).finally(() => {
					form.reset();
				});
			});
		}

		function showModalThanks(message){
			let modalDialog = document.querySelector(".modal__dialog");
			modalDialog.classList.add("hide");
			modalDialog.classList.remove("show");

			openModal();

			let modalThanks = document.createElement("div");
			modalThanks.classList.add("modal__dialog");
			modalThanks.innerHTML = `
				<div class="modal__content">
					<div data-close class="modal__close">×</div>
					<div class="modal__title">${message}</div>
				</div>
			`;
			modalWindowContent.append(modalThanks);

			setTimeout(() => {
				modalDialog.classList.add("show");
				modalDialog.classList.remove("hide");
				modalThanks.remove();
				closeModal();
			}, 5000);
		}

		fetch("db.json")
			.then(data => data.json())
			.then(res => console.log(res));

});