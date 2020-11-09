let processingScroll = false;
let mouseOnScrollable = false;
let touchOnScrollable = false;
let waitingForScrollEnd = false;
let startX, startY, touchStartElement, lastScrollTop = 0;

setTimeout(function () {
    const scrollables = document.getElementsByClassName('scrollable');
    for (let scrollable of scrollables) {
        scrollable.addEventListener('mouseenter', () => { mouseOnScrollable = true; });
    
        scrollable.addEventListener('mouseleave', () => { mouseOnScrollable = false; });

        scrollable.addEventListener('touchstart', () => { touchOnScrollable = true; });

        scrollable.addEventListener('scroll', scrollableScrollHandler);
    }
    console.log('Listener para mouse sobre elemento scrollable adicionado');


    document.body.addEventListener('wheel', wheelHandler);
    console.log('Listener para scroll adicionado');
    
    document.body.addEventListener('keydown', keydowScrollHandler);
    console.log('Listener para keydown adicionado');

    
    
    document.body.addEventListener('touchstart', touchStartHandler);
    document.body.addEventListener('touchmove', touchMoveHandler);
    document.body.addEventListener('touchend', () => { touchOnScrollable = false; });
    console.log('Listeners para eventos touch adicionados')

}, 1200);


function wheelHandler (e) {
    const direction = e.deltaY < 0 ? 'up' : e.deltaY > 0 ? 'down' : null;

    if (!e.target.classList.contains('scrollable') || 
        (direction === 'up' && e.target.scrollTop === 0 && !waitingForScrollEnd) ||
        (
            direction === 'down' && 
            e.target.clientHeight + e.target.scrollTop === e.target.scrollHeight &&
            !waitingForScrollEnd
        )
    ) {
    
        if (direction && !processingScroll) {
            processScroll(direction);
        }
    }
}

function keydowScrollHandler (e) {
    if (!mouseOnScrollable && 
        document.activeElement.tagName.toLowerCase() === 'body' &&
        (e.key === 'ArrowUp' || e.key === 'ArrowDown')
    ) {
        const direction = e.key === 'ArrowUp' ? 'up' : 'down';
        processScroll(direction);
    }
}

function touchStartHandler (e) {                                    
    startX = e.touches[0].clientX;                                      
    startY = e.touches[0].clientY;
    touchStartElement = e.target;
}

function touchMoveHandler (e) {                                      
    const posX = e.touches[0].clientX;                                      
    const posY = e.touches[0].clientY;

    const diffX = posX - startX;
    const diffY = posY - startY;
    const direction = diffY > 0 ? 'up' : 'down';

    if ((!touchOnScrollable && (diffY > 20 || diffY < -20)) || 
        (
            direction === 'up' && 
            touchStartElement.scrollTop === 0 && 
            !waitingForScrollEnd
        ) ||
        (
            direction === 'down' && 
            touchStartElement.clientHeight 
                + touchStartElement.scrollTop 
                === touchStartElement.scrollHeight &&
            !waitingForScrollEnd
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
            waitingForScrollEnd = false;
        }, 1200);
    }

    lastScrollTop = e.target.scrollTop;
}


function processScroll (direction) {
    window.location.href = direction === 'up' ? topPage : bottomPage;
    
    processingScroll = true;
    setTimeout(function () {
        setTimeout(function () {
            processingScroll = false;
            processingDom.innerHTML = '';
        }, 1300);
    }, 1000);
}