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
    let deadline = '2019-05-10';

    function getTimeRemaining(endtime) {
        let t = Date.parse(endtime) - Date.parse(new Date()),
            seconds = Math.floor((t/1000) % 60),
            minutes = Math.floor((t/1000/60)%60),
            hours = Math.floor((t/(1000*60*60)));
            // hours = Math.floor((t/1000/60/60) % 24),
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

        more.addEventListener('click', () => {
            overlay.style.display = 'block';
            this.classList.add('more-splash');
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
                this.classList.add('more-splash');
                document.body.style.overflow = 'hidden';
            });
            close.addEventListener('click', () => {
                item.classList.remove('more-splash');
            });
        });
        //это замена forEach для IE
        for (let i=0; i<descriptionBtns.length; i++) {
            descriptionBtns[i].addEventListener('click', () => {
                overlay.style.display = 'block';
                this.classList.add('more-splash');
                document.body.style.overflow = 'hidden';
            });
            close.addEventListener('click', () => {
                descriptionBtns.classList.remove('more-splash');
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
            loading: 'Загрузка..',
            success: 'Спасибо, скоро мы с вами свяжемся',
            failure: 'Что-то пошло не так...'
        };
    
        let form = document.getElementsByTagName('form');
    
        for (let j=0; j< form.length; j++) {
    
            let input = form[j].getElementsByTagName('input'),
                statusMessage = document.createElement('div');
    
            statusMessage.classList.add('status');
    
            let inputTel = form[j].querySelector('[type="tel"]');
    
            inputTel.addEventListener('keyup', () => {
                inputTel.value = inputTel.value.replace(/[^0-9\+]/g, '');
            });
    
            form[j].addEventListener('submit', (event) => {
                event.preventDefault();
                form[j].appendChild(statusMessage);
    
                let request = new XMLHttpRequest();
                request.open('POST', 'server.php');
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    
                let formData = new FormData(form[j]);
                request.send(formData);
    
                request.addEventListener('readystatechange', () => {
                    if (request.readyState < 4) {
                        statusMessage.innerHTML = message.loading;
                    } else if (request.readyState === 4 && request.status == 200) {
                        statusMessage.innerHTML = message.success;
                    } else {
                        statusMessage.innerHTML = message.failure;
                    }
                });
    
                for (let i=0; i<input.length; i++) {
                    input[i].value = '';
                }
            });
        }
    }

    sendForm();  
    
});
