let processingScroll = false;
let mouseOnScrollable = false;
let touchOnScrollable = false;
let startX, startY, touchStartElement;

setTimeout(function () {
    const scrollables = document.getElementsByClassName('scrollable');
    for (let scrollable of scrollables) {
        scrollable.addEventListener('mouseenter', () => { mouseOnScrollable = true; });
    
        scrollable.addEventListener('mouseleave', () => { mouseOnScrollable = false; });

        scrollable.addEventListener('touchstart', () => { touchOnScrollable = true; });
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
    if (!e.target.classList.contains('scrollable') || 
        e.target.scrollHeight <= e.target.clientHeight
    ) {
        let direction = e.deltaY < 0 ? 'up' : e.deltaY > 0 ? 'down' : null;
    
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
        let direction = e.key === 'ArrowUp' ? 'up' : 'down';
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

    if ((!touchOnScrollable && (diffY > 20 || diffY < -20)) || 
        touchStartElement.scrollHeight <= touchStartElement.clientHeight
    ) {
        let direction = diffY > 0 ? 'up' : 'down';
        processScroll(direction);
    }
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