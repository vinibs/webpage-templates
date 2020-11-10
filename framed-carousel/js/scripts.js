let processingPageScroll = false;
let waitingForScrollEnd = false;
let canTouchChangePageUp = false;
let canTouchChangePageDown = false;
let changePageTouchStarted = false;
let isScrolling = false;
let lastClickedElement = null;
let startX, startY, touchStartElement, lastScrollTop = 0;

setTimeout(function () {
    document.body.addEventListener('scroll', scrollableScrollHandler);
    // console.log('Listener para scroll adicionado');

    document.body.addEventListener('wheel', wheelHandler);
    // console.log('Listener para movimento da roda do mouse adicionado');
    
    document.body.addEventListener('keydown', keydownScrollHandler);
    // console.log('Listener para keydown adicionado');

    document.body.addEventListener('touchstart', touchStartHandler);
    document.body.addEventListener('touchmove', touchMoveHandler);
    document.body.addEventListener('touchend', () => { changePageTouchStarted = false });
    // console.log('Listeners para eventos touch adicionados')

    document.body.addEventListener('click', (e) => { lastClickedElement = e.target });
    console.log('Todos os listeners adicionados');
}, 1200);


function wheelHandler (e) {
    const direction = e.deltaY < 0 ? 'up' : e.deltaY > 0 ? 'down' : null;

    if (((
            direction === 'up' && 
            canScrollPageUp() && 
            !waitingForScrollEnd
        ) ||
        (
            direction === 'down' && 
            canScrollPageDown() &&
            !waitingForScrollEnd
        )) && !isScrolling
    ) {
    
        if (direction && !processingPageScroll) {
            processScroll(direction);
        }
    }
}

function keydownScrollHandler (e) {
    const direction = e.key === 'ArrowUp' ? 'up' : e.key === 'ArrowDown' ? 'down' : null;

    if ((
            direction === 'up' && 
            canScrollPageUp() && 
            !waitingForScrollEnd
        ) ||
        (
            direction === 'down' && 
            canScrollPageDown() &&
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

    if (canScrollPageUp()) {
        canTouchChangePageUp = true;
    }
    else { canTouchChangePageUp = false; }
    
    if (canScrollPageDown()) {
        canTouchChangePageDown = true;
    }
    else { canTouchChangePageDown = false; }
}

function touchMoveHandler (e) {                                      
    const posX = e.touches[0].clientX;                                      
    const posY = e.touches[0].clientY;

    const diffY = posY - startY;
    const direction = diffY > 0 ? 'up' : 'down';

    if ((
            direction === 'up' && 
            canScrollPageUp() && 
            canTouchChangePageUp &&
            !changePageTouchStarted
        ) ||
        (
            direction === 'down' && 
            canScrollPageDown() &&
            canTouchChangePageDown &&
            !changePageTouchStarted
        )
    ) {
        changePageTouchStarted = true;
        processScroll(direction);
    }
}

function scrollableScrollHandler (e) {
    isScrolling = true;
    
    if (
        lastScrollTop !== e.target.scrollTop && 
        (canScrollPageUp(e.target) || canScrollPageDown(e.target))
    ) {
        isScrolling = false;
        waitingForScrollEnd = true;

        setTimeout(() => {
            console.log('Reativada a escuta de scroll após final de rolagem')
            waitingForScrollEnd = false;
        }, 1200);
    }

    lastScrollTop = e.target.scrollTop;
}



function canScrollPageUp (element = document.body) {
    return element && element.scrollTop === 0;
}

function canScrollPageDown (element = document.body) {
    return element && element.clientHeight + element.scrollTop >= element.scrollHeight
}


function processScroll (direction) {
    console.log('Trocar de página')
    window.location.href = direction === 'up' ? topPage : bottomPage;
    
    processingPageScroll = true;
    setTimeout(function () {
        setTimeout(function () {
            processingPageScroll = false;
        }, 1300);
    }, 1000);
}