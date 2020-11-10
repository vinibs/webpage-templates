let processingPageScroll = false;
let waitingForScrollEnd = false;
let canTouchChangePage = false;
let lastClickedElement = null;
let startX, startY, touchStartElement, lastScrollTop = 0;

setTimeout(function () {
    const scrollables = document.querySelectorAll('.scrollable');
    for (let scrollable of scrollables) {
        scrollable.addEventListener('scroll', scrollableScrollHandler);
    }
    console.log('Listener para mouse sobre elemento scrollable adicionado');

    document.body.addEventListener('wheel', wheelHandler);
    console.log('Listener para scroll adicionado');
    
    document.body.addEventListener('keydown', keydowScrollHandler);
    console.log('Listener para keydown adicionado');

    document.body.addEventListener('touchstart', touchStartHandler);
    document.body.addEventListener('touchmove', touchMoveHandler);
    console.log('Listeners para eventos touch adicionados')

    document.body.addEventListener('click', (e) => { lastClickedElement = e.target });
    document.body.addEventListener('focus', (e) => { lastClickedElement = e.target });

}, 1200);


function wheelHandler (e) {
    const direction = e.deltaY < 0 ? 'up' : e.deltaY > 0 ? 'down' : null;
    const scrollableElement = getParentOfClass(e.target, 'scrollable');

    if (!scrollableElement || 
        (
            scrollableElement &&
            direction === 'up' && 
            scrollableElement.scrollTop === 0 && !waitingForScrollEnd
        ) ||
        (
            scrollableElement &&
            direction === 'down' && 
            scrollableElement.clientHeight 
                + scrollableElement.scrollTop 
                === scrollableElement.scrollHeight &&
            !waitingForScrollEnd
        )
    ) {
    
        if (direction && !processingPageScroll) {
            processScroll(direction);
        }
    }
}

function keydowScrollHandler (e) {
    const direction = e.key === 'ArrowUp' ? 'up' : 'down';
    const scrollableElement = document.activeElement.tagName.toLowerCase() !== 'body' ?
        getParentOfClass(document.activeElement, 'scrollable') :
        getParentOfClass(lastClickedElement, 'scrollable');

    if ((!scrollableElement && (e.key === 'ArrowUp' || e.key === 'ArrowDown'))|| 
        (
            scrollableElement &&
            direction === 'up' && 
            scrollableElement.scrollTop === 0 && !waitingForScrollEnd
        ) ||
        (
            scrollableElement &&
            direction === 'down' && 
            scrollableElement.clientHeight 
                + scrollableElement.scrollTop 
                === scrollableElement.scrollHeight &&
            !waitingForScrollEnd
        )
    ) {
        processScroll(direction);
    }
}

function touchStartHandler (e) {                                    
    startX = e.touches[0].clientX;                                      
    startY = e.touches[0].clientY;
    touchStartElement = e.target;

    const scrollableElement = getParentOfClass(touchStartElement, 'scrollable');
    if ((scrollableElement && scrollableElement.scrollTop === 0) ||
        (
            scrollableElement &&
            scrollableElement.clientHeight 
                + scrollableElement.scrollTop 
                === scrollableElement.scrollHeight
        )
    ) {
        canTouchChangePage = true;
    }
    else {
        canTouchChangePage = false;
    }
}

function touchMoveHandler (e) {                                      
    const posX = e.touches[0].clientX;                                      
    const posY = e.touches[0].clientY;

    const diffX = posX - startX;
    const diffY = posY - startY;
    const direction = diffY > 0 ? 'up' : 'down';
    const scrollableElement = getParentOfClass(touchStartElement, 'scrollable');

    if ((!scrollableElement && (diffY > 20 || diffY < -20)) || 
        (
            scrollableElement && 
            direction === 'up' && 
            scrollableElement.scrollTop === 0 && 
            canTouchChangePage
        ) ||
        (
            scrollableElement && 
            direction === 'down' && 
            scrollableElement.clientHeight 
                + scrollableElement.scrollTop 
                === scrollableElement.scrollHeight &&
            canTouchChangePage
        )
    ) {
        processScroll(direction);
    }
}

function scrollableScrollHandler (e) {
    if (lastScrollTop !== e.target.scrollTop && 
        (
            e.target.scrollTop == 0 || 
            e.target.clientHeight + e.target.scrollTop === e.target.scrollHeight
        )
    ) {
        waitingForScrollEnd = true;

        setTimeout(() => {
            console.log('Reativando escuta de scroll após final de rolagem')
            waitingForScrollEnd = false;
        }, 1200);
    }

    lastScrollTop = e.target.scrollTop;
}

function getParentOfClass (element, className) {
    if (!element) return false;

    if (element.classList && element.classList.contains(className)) {
        return element;
    }
    else if (element.tagName.toLowerCase() === 'body') {
        return null;
    }
    else {
        return getParentOfClass (element.parentNode, className);
    }
}


function processScroll (direction) {
    window.location.href = direction === 'up' ? topPage : bottomPage;
    
    processingPageScroll = true;
    setTimeout(function () {
        setTimeout(function () {
            processingPageScroll = false;
            processingDom.innerHTML = '';
        }, 1300);
    }, 1000);
}