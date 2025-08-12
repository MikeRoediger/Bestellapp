//Function to display the basket content even after reload

window.addEventListener('DOMContentLoaded', function(){
    getFromLocalStorage();
    renderBasketDishes();
});

//Function to toggle the mobile basket

document.getElementById('toggle_overlay_btn').addEventListener('click', function(){
    let mobileOverlay = document.getElementById('mobile_basket_overlay');
    let body = document.getElementById('body');

    mobileOverlay.classList.toggle('open');

    if(mobileOverlay.classList.contains('open')){
        body.classList.add('lock-scroll');
    } else {
        body.classList.remove('lock-scroll');
    }
});

document.getElementById('close_overlay_btn').addEventListener('click', function(){
    let mobileOverlay = document.getElementById('mobile_basket_overlay');
    let body = document.getElementById('body');

    mobileOverlay.classList.toggle('open');
    body.classList.remove('lock-scroll');
});

document.getElementById('shopping_bag').addEventListener('click', function(){
    let mobileOverlay = document.getElementById('mobile_basket_overlay');

    mobileOverlay.classList.toggle('open');
});

function toggleOverlay(){
    let mobileOverlay = document.getElementById('mobile_basket_overlay');
    mobileOverlay.classList.toggle('open');
}


//Function for contolling the overlay on window resize

function closeOverlayOnResize(){
    let mobileOverlay = document.getElementById('mobile_basket_overlay');
    let body = document.getElementById('body');

    if(window.innerWidth > 650){
        mobileOverlay.classList.add('d-none');
        body.classList.remove('lock-scroll');
    } else {
        !mobileOverlay.classList.remove('d-none');
    }
}

window.addEventListener('resize', closeOverlayOnResize);
closeOverlayOnResize();

