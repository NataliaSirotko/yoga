window.addEventListener('DOMContentLoaded', () => {

    'use strict';
    let tab = document.querySelectorAll('.info-header-tab'),
        info = document.querySelector('.info-header'),
        tabContent = document.querySelectorAll('.info-tabcontent');

    function hideTabContent(a) {
        for (let i = a; i < tabContent.length; i++) {
            tabContent[i].classList.remove('show');
            tabContent[i].classList.add('hide');

        }
    }
    hideTabContent(1);

    function showTabContent(b) {
        if (tabContent[b].classList.contains('hide')) {
            tabContent[b].classList.remove('hide');
            tabContent[b].classList.add('show');
        }
    }

    info.addEventListener('click', event => {
        let target = event.target;
        if (target && target.classList.contains('info-header-tab')) {
            for (let i = 0; i<tab.length; i++) {
                if (target == tab[i]) {
                    hideTabContent(0);
                    showTabContent(i);
                    break;
                }
            }
        }
    });

    //Timer
    let deadline = '2019-05-22';

    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()),
            seconds = Math.floor((t/1000) % 60),
            minutes = Math.floor((t/1000/60)%60),
            hours = Math.floor((t/(1000*60*60)));
             //hours = Math.floor((t/1000/60/60) % 24),
            // days = Math.floor((t/(1000*60*60*24)));
        
        return {
            'total' : t,
            'hours' : hours,
            'minutes' : minutes,
            'seconds' : seconds
        };
    }

    function setClock(id, endtime) {
        let timer = document.getElementById(id),
            hours = timer.querySelector('.hours'),
            minutes = timer.querySelector('.minutes'),
            seconds = timer.querySelector('.seconds'),
            timeInterval = setInterval(updateClock, 1000);

        function updateClock() {
            let t = getTimeRemaining(endtime);

            if (t.total <= 0) {
                clearInterval(timeInterval);
                hours.textContent = '00';
                minutes.textContent = '00';
                seconds.textContent = '00';
            } else {
                hours.textContent = addZero(t.hours);
                minutes.textContent = addZero(t.minutes);
                seconds.textContent = addZero(t.seconds);
            }
        }
        function addZero(num) {
            if (num>=0 && num <10) {
                return '0' + num;
            } else {
                return num;
            }
        }
    }

    setClock('timer', deadline);

    //Scroll
    let anchors = document.querySelectorAll('a[href*="#"]');

    for (let item of anchors) {
        item.addEventListener('click', event => {
            event.preventDefault();

            let elemId = item.getAttribute('href');

            document.querySelector(`${elemId}`).scrollIntoView({ //'' + elemId
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    //Modal
    function getModal() {
        let more = document.querySelector('.more'),
            overlay = document.querySelector('.overlay'),
            close = document.querySelector('.popup-close'),
            popup = document.querySelector('.popup');

        more.addEventListener('click', (e) => {
            overlay.style.display = 'block';
            e.target.classList.add('more-splash'); // с this - работает, но ругается
            document.body.style.overflow = 'hidden';
        });
        close.addEventListener('click', () => {
            overlay.style.display = 'none'; 
            more.classList.remove('more-splash');
            document.body.style.overflow = '';
        });

        let descriptionBtns = document.querySelectorAll('.description-btn');

        descriptionBtns.forEach(item => {
            item.addEventListener('click', () => {
                overlay.style.display = 'block';
                item.classList.add('more-splash');
                document.body.style.overflow = 'hidden';
            });
            close.addEventListener('click', () => {
                item.classList.remove('more-splash');
            });
        });
        //это замена forEach для IE
        for (let i=0; i<descriptionBtns.length; i++) {
            descriptionBtns[i].addEventListener('click', (event) => {
                overlay.style.display = 'block';
                event.target.classList.add('more-splash');
                document.body.style.overflow = 'hidden';
            });
            close.addEventListener('click', () => {
                descriptionBtns[i].classList.remove('more-splash');
            });
        }
    

    // let isChrome = /Chrome/.test(navigator.userAgent);
    // let isSafari = /Safari/.test(navigator.userAgent);
    //    let isMoz = /Firefox/.test(navigator.userAgent);
        let isIe = /InternetExplorer/.test(navigator.userAgent),
            edge = /Edge/.test(navigator.userAgent);

        if (window.screen.width < 500) {
            overlay.classList.remove('fade');
            console.log('done');
        } else {
            if (!(isIe || edge)) {  
                more.addEventListener('click', () => {                  
                    overlay.classList.remove('fade');
                    overlay.animate([
                        {width: '0'},
                        {width: '100%'}
                    ],
                        {duration: 2500});
                    popup.animate([
                        {left: '0'},
                        {left: '50%'}
                    ],
                        {duration: 1500});

                });

                descriptionBtns.forEach(item => {
                    item.addEventListener('click', () => {
                        overlay.classList.remove('fade');
                        overlay.animate([
                            {width: '0'},
                            {width: '100%'}
                        ],
                            {duration: 2500});
                        popup.animate([
                            {left: '0'},
                            {left: '50%'}
                        ],
                            {duration: 1500});
                        });
                });
            }
        } 

    }

    getModal();

    //Form
    function sendForm() {
        let message = {
            loading: 'Загружается..',
            success: 'Спасибо, скоро мы с вами свяжемся',
            failure: 'Что-то пошло не так...'
        };
    
        let form = document.getElementsByTagName('form'),
            bottomForm = document.getElementsByTagName('form');
    
        for (let j=0; j< form.length; j++) {
    
            let input = form[j].getElementsByTagName('input'),
                statusMessage = document.createElement('div');

            statusMessage.classList.add('status');
    
            let inputTel = form[j].querySelector('[type="tel"]');
    
            inputTel.addEventListener('keyup', () => {
                inputTel.value = inputTel.value.replace(/[^0-9\+]/g, '');
            });

            let popup = document.querySelector('.popup-form'),
                img = document.createElement('img'); 

            form[j].addEventListener('submit', (event) => {
                event.preventDefault();
                form[j].appendChild(statusMessage);
                popup.appendChild(img);

                let formData = new FormData(form[j]);

                let obj = {};
                formData.forEach((value, key) => {
                    obj[key] = value;
                });
                let json = JSON.stringify(obj);

                function postData(data) {                  

                    return new Promise(function(resolve, reject) {
                        let request = new XMLHttpRequest();

                        request.open('POST', 'server.php');

                        //request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        request.setRequestHeader('Content-type', 'application/json; charset=utf-8');  
                        
                        request.addEventListener('readystatechange', () => {
                            if (request.readyState < 4) {
                                resolve()                
                            } else if (request.readyState === 4 && request.status == 200) {
                                resolve()
                            } else {
                                reject()
                            }      
                        });

                        request.send(data);
                    })  
               
                }// end postData

                function clearInput() {
                    for (let i=0; i<input.length; i++) {
                        input[i].value = '';
                    }
                }
                
                    postData(json)
                        .then(() => {
                            //statusMessage.innerHTML = message.loading;
                            form[j].style.display = 'none';
                            img.style.display = "block";
                            img.src = "/icons/ajax-loader.gif";
                            img.style.margin = "10px 240px 0";
                        })
                        .then(() => {
                            //statusMessage.innerHTML = message.success;                      
                            img.src = "/icons/herbal.png";
                            img.style.width = "150px";
                            console.log('отправлено');
                        })
                        .catch(() => {
                            //statusMessage.innerHTML = message.failure;
                            img.src = "/icons/fish.psd";
                            img.style.width = "150px";
                            console.log('ошибка');
                        })
                        .then(clearInput)

                let more = document.querySelector('.more'),
                    descrBtn = document.querySelectorAll('.description-btn');

                more.addEventListener('click', () => {
                    form[j].style.display = 'block';
                    img.style.display = "none";
                    //form[j].removeChild(statusMessage);
                }); 
                descrBtn.forEach(item => {
                    item.addEventListener('click', () => {
                        form[j].style.display = 'block';
                        img.style.display = "none";
                        //form[j].removeChild(statusMessage);
                    });
                });
            });
                  
        }   
    }

    sendForm();  

    //Slider

    let slideIndex = 1,
        slides = document.querySelectorAll('.slider-item'),
        prev = document.querySelector('.prev'),
        next = document.querySelector('.next'),
        dotsWrap = document.querySelector('.slider-dots'),
        dots = document.querySelectorAll('.dot');

        showSlides(slideIndex);
    
        function showSlides(n) {

        if (n > slides.length) {
            slideIndex = 1;
        }
        if (n < 1) {
            slideIndex = slides.length;
        }

        slides.forEach(item => item.style.display = 'none');
        dots.forEach(item => item.classList.remove('dot-active'));

        slides[slideIndex - 1].style.display = 'block';
        slides[slideIndex - 1].classList.remove('fade');
        slides[slideIndex - 1].animate([
            {width: '30%',
            transform: 'rotate(360deg)'},
            {offset: 0.6, 
            width: '100%',
            transform: 'rotate(0deg)'},           
            {width: '80%',
            transform: 'rotate(0deg)'}
        ],
            {duration: 2500});

        dots[slideIndex - 1].classList.add('dot-active');
    }

    function plusSlides(n) {
        showSlides(slideIndex += n);
    }
    function currentSlide(n) {
        showSlides(slideIndex = n);
    }

    prev.addEventListener('click', () => {
        plusSlides(-1);
    });
    
    next.addEventListener('click', () => {
        plusSlides(1);
    });

    dotsWrap.addEventListener('click', (event) => {
        for (let i = 0; i < dots.length + 1; i++) {
            if (event.target.classList.contains('dot') && event.target == dots[i-1]) {
                currentSlide(i);
            }
        }
    });

    // Calc

    let persons = document.querySelectorAll('.counter-block-input')[0],
        restDays = document.querySelectorAll('.counter-block-input')[1],
        place = document.getElementById('select'),
        totalValue = document.getElementById('total'),
        personsSum = 0,
        daysSum = 0,
        total = 0;

    totalValue.innerHTML = 0;

    //люди
    persons.addEventListener('input', function() {
        this.value = this.value.replace(/[e\+]/g, '').replace(/[^0-9]/g, '');
        personsSum = +this.value;
        total = (daysSum+personsSum)*4000;

        if (restDays.value == '' || restDays.value == 0 || personsSum == 0 ) {
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
            animateValue(totalValue, 0, total, 7000);
        }
    });

    //дни
    restDays.addEventListener('input', function() { 
        this.value = this.value.replace(/[e\+]/g, '').replace(/[^0-9]/g, '');
        daysSum = +this.value; 
        total = (daysSum+personsSum)*4000;

        if (persons.value == '' || persons.value == 0 || daysSum == 0 ) {
            totalValue.innerHTML = 0;
        } else {
            totalValue.innerHTML = total;
            animateValue(totalValue, 0, total, 7000);
        }
    });

    //Эта функция для выбора баз
    place.addEventListener('change', function() {
        if (restDays.value == '' || persons.value == '') {
            totalValue.innerHTML = 0;
            } else {
            let a = total;
            totalValue.innerHTML = a * this.options[this.selectedIndex].value;
        }
    });

    // animation counter
    function animateValue(name, start, end, duration) {
        let range = start - end;
        let current = start;               
        let step = end > start? 100 : -100;
        let stepTime = Math.abs(Math.floor(duration / range));
        let timer = setInterval(function() {
            current += step;
            name.innerHTML = current;
            if (current == end) {
                clearInterval(timer);
            }
        }, stepTime);
    } 
    
    
});
