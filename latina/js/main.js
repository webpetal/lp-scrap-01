
/*--------------------------------slide-----------------------------------------------------*/
const buttonDown = document.getElementById("button__down");
const buttonUp = document.getElementById("button__up");
const mainButtons = document.querySelectorAll("button.main__button");
const checkedItems = document.getElementsByClassName("main__header-item");
const headers = document.getElementsByClassName("main__header");
const firstHeader = headers[0];
const line = document.getElementById("line");

let slide = 0;
let lineWidth = 0;
let vh = window.innerHeight * 0.01;
let touchPosition;
let touchStartPosition;
let oldScrollTop = 0;
let scrollEventPause = false;
let touchEndTimeout;


(function init100vh() {
    function setHeight() {
        vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        firstHeader.style.marginTop = `-${slide * (vh * 100)}px`;
    }
    setHeight();
    window.addEventListener('resize', setHeight);
})();


function nextSlide() {
    clearTimeout(touchEndTimeout);
    if (slide < (headers.length - 1)) {
        slide++;
        lineWidth++;
        setSlide();
    }

    buttonUp.disabled = false;
    if (slide === (headers.length - 1)) {
        buttonDown.disabled = true;
    }

    headers[slide].scrollTop = 0;
    oldScrollTop = 0;


    setTimeout(() => {
        scrollEventPause = false;
    }, 2000);
}

function prevSlide() {
    clearTimeout(touchEndTimeout);
    if (slide > 0) {
        slide--;
        lineWidth--;
        setSlide();
    }

    buttonUp.disabled = false;

    if (slide === 0) {
        buttonUp.disabled = true;
    }

    headers[slide].scrollTop = 0;
    oldScrollTop = 0;


    setTimeout(() => {
        scrollEventPause = false;
    }, 2000);
}

function setSlide() {
    firstHeader.style.marginTop = `-${slide * (vh * 100)}px`;
    line.style.width = `${lineWidth * 100 / (headers.length - 1)}%`;
    buttonDown.disabled = false;
}


function touchStart(e) {
    touchPosition = e.changedTouches[0].clientY;
    touchStartPosition = this.scrollHeight ;
}

function touchEnd(e) {
    touchEndTimeout = setTimeout(() => {
        let newTouchPosition = e.changedTouches[0].clientY;
        if (
            !scrollEventPause &&
            ((newTouchPosition - touchPosition) > 20)
            
        ) {
            prevSlide();
        }

        if (!scrollEventPause &&
            ((newTouchPosition - touchPosition) < -20)
        ) {
            if (touchStartPosition === this.clientHeight) {
                touchStartPosition = 0;
                nextSlide();
            } 
        }
    }, 100);
}


function scrollEvent() {
    if (!scrollEventPause) {
        scrollEventPause = true;
        const moveUp = this.scrollTop < oldScrollTop;
        oldScrollTop = this.scrollTop;
        if (moveUp && (this.scrollTop === 0)) {
            nextSlide(this.scrollHeight - this.scrollTop);
        } else if (!moveUp && (this.scrollHeight - this.scrollTop === this.clientHeight)) {
            prevSlide();
        }
    }
}

function scrollWindow(e) {
    if (!scrollEventPause) {
        scrollEventPause = true;
        if (e.deltaY > 0) { 
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

for (let i = 0; i < headers.length; i++) {
    headers[i].addEventListener('scroll', scrollEvent);
    headers[i].addEventListener('touchstart', touchStart);
    headers[i].addEventListener('touchend', touchEnd);
}

for (let i = 0; i < mainButtons.length; i++) {
    mainButtons[i].addEventListener('click', nextSlide);
}

for (let i = 0; i < checkedItems.length; i++) {

    checkedItems[i].addEventListener("click", (e) => {

        const children = e.currentTarget.parentElement.children;

        for (let i = 0; i < children.length; i++) {
            children[i].classList.remove("checked")
        }
        e.currentTarget.classList.add("checked");

        setTimeout(nextSlide, 1000);
    });
}

document.addEventListener('wheel', scrollWindow);

buttonDown.addEventListener("click", nextSlide);
buttonUp.addEventListener("click", prevSlide);

