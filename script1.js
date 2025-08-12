//Rendering functions for browser and basket contents

function renderDishes() {
    let container = document.getElementById('dishes_container');
    container.innerHTML = '';

    for(let category in dishes){
        container.innerHTML +=`<span id='${category}' class='category-name'>${formatCategoryName(category)}</span>`
        let dishList = dishes[category];

        for(let index = 0; index < dishList.length; index++){
            let dish = dishList[index];
            container.innerHTML += getDishesTemplate(dish, index, category);
        }
    }
}

function formatCategoryName(category) {
    let names = {
        mainDishes: 'Hauptgerichte',
        sideDishes:'Beilagen',
        desserts: 'Nachspeisen'
    }

    return names[category] || category;
}


function renderBasketDishes(suppressPlaceholder = false){
    renderBasketDishesPC(suppressPlaceholder);
    renderBasketDishesMobile(suppressPlaceholder);
}


function renderBasketDishesPC(suppressPlaceholder  = false){
    getFromLocalStorage();
    let desktopContainer = document.getElementById('desktop_basket_container');
    desktopContainer.innerHTML = '';

    for(let basketIndex = 0; basketIndex < basketDishes.length; basketIndex++){
        desktopContainer.innerHTML += getDesktopBasketDishesTemplate(basketIndex);
    }

    if(basketDishes.length > 0){
        let subtotalValue = calculateSubtotal();
        desktopContainer.innerHTML += getBasketTotal(subtotalValue, (parseFloat(subtotalValue) + 5).toFixed(2).replace('.', ','));
    } else if(!suppressPlaceholder){
        desktopContainer.innerHTML += getDesktopPlaceholder();
    }
}


function renderBasketDishesMobile(suppressPlaceholder  = false){
    getFromLocalStorage();
    let mobileContainer = document.getElementById('mobile_basket_container');
    mobileContainer.innerHTML = '';

    for (let basketIndex = 0; basketIndex < basketDishes.length; basketIndex++){
        mobileContainer.innerHTML += getMobileBasketDishesTemplate(basketIndex);
    }

    if(basketDishes.length > 0){
        let subtotalValue = calculateSubtotal();
        mobileContainer.innerHTML += getBasketTotal(subtotalValue, (parseFloat(subtotalValue) + 5).toFixed(2).replace('.', ','));
    } else if(!suppressPlaceholder){
        mobileContainer.innerHTML += getMobilePlaceholder();
    }
}

function getFromLocalStorage(){
    let savedSelectedDish = JSON.parse(localStorage.getItem('selectedDishes') || '[]');
    basketDishes = savedSelectedDish;
    return savedSelectedDish;
}

function saveToLocalStorage(basketItem){
    localStorage.setItem('selectedDishes', JSON.stringify(basketItem));
    basketDishes = basketItem;
}


//Functions to move/remove elements

function moveDishesToBasket(category, index){
    let selectedDish = {...dishes[category][index]};
    let savedSelectedDish = getFromLocalStorage();
    let basketIndex = savedSelectedDish.findIndex(dish => dish.name === selectedDish.name);

    if(basketIndex === -1){
        selectedDish.quantity = 1;
        selectedDish.totalPrice = calculateTotalPrice(selectedDish.price);
        savedSelectedDish.push(selectedDish);
        localStorage.setItem('selectedDishes', JSON.stringify(savedSelectedDish));
    } else {
        addDishAmount(basketIndex);
    }
    renderBasketDishes();
}


function removeDish(basketIndex){
    let basketItem = JSON.parse(localStorage.getItem('selectedDishes') || '[]') ;
    basketItem.splice(basketIndex, 1);

    localStorage.setItem('selectedDishes', JSON.stringify(basketItem));

    let separationBar = document.getElementById('separation_bar');
    let totalAmountTable = document.getElementById('amount_table');
    if(basketItem.length === 0) {
        if(separationBar) separationBar.classList.add('d-none');
        if(totalAmountTable) totalAmountTable.classList.add('d-none');
    } 
    renderBasketDishes();
}

//Functions to add and substract nr. of dishes

function addDishAmount(basketIndex){
    if(window.innerWidth < 650){
        addDishAmountPC(basketIndex);
    } else {
        addDishAmountMobile(basketIndex);
    }
}

function addDishAmountPC(basketIndex){
    let basketItem = getFromLocalStorage();
    if(basketItem[basketIndex]){
        basketItem[basketIndex].dishAmount += 1;
    }

    saveToLocalStorage(basketItem);
    updatePricePerDish(basketIndex);
    renderBasketDishes();
}

function addDishAmountMobile(basketIndex){
    let basketItem = getFromLocalStorage();
    if(basketItem[basketIndex]){
        basketItem[basketIndex].dishAmount += 1;
    }

    saveToLocalStorage(basketItem);
    updatePricePerDish(basketIndex);
    renderBasketDishes();
}


function substractDishAmountPC(basketIndex){
let basketItem = getFromLocalStorage();

  if (basketItem[basketIndex].dishAmount <= 1) {
    removeDish(basketIndex);
    return;
  }

  basketItem[basketIndex].dishAmount -= 1;

  saveToLocalStorage(basketItem);
  updatePricePerDish(basketIndex);
  renderBasketDishes();
}

function substractDishAmountMobile(basketIndex){
let basketItem = getFromLocalStorage();

  if (basketItem[basketIndex].dishAmount <= 1){
    removeDish(basketIndex);
    return;
  }

  basketItem[basketIndex].dishAmount -= 1;

  saveToLocalStorage(basketItem);
  updatePricePerDish(basketIndex);
  renderBasketDishes();
}


function updatePricePerDish(basketIndex){
    let amount = basketDishes[basketIndex].dishAmount;
    let price = basketDishes[basketIndex].price;

    let subtotal = amount * price;
    basketDishes[basketIndex].totalPrice = subtotal;

    let formattedSubtotal = subtotal.toFixed(2).replace('.', ',');

    let desktopPriceCell = document.getElementById(`price_pc_${basketIndex}`);
    if (desktopPriceCell) {
        desktopPriceCell.innerText = `${formattedSubtotal} €`;
    }

    let mobilePriceCell = document.getElementById(`price_mobile_${basketIndex}`);
    if (mobilePriceCell) {
        mobilePriceCell.innerText = `${formattedSubtotal} €`;
    }

    localStorage.setItem('selectedDishes', JSON.stringify(basketDishes));
}


function calculateSubtotal(){
    let subtotal = 0;

    for(let basketIndex=0; basketIndex < basketDishes.length; basketIndex++){
         let dish = basketDishes[basketIndex];
        
        if (dish.totalPrice) {
            subtotal += parseFloat(dish.totalPrice);
        }
    }
    return subtotal.toFixed(2).replace('.', ',');
}

function calculateTotalPrice(price, quantity = 1){
    return(price * quantity).toFixed(2).replace('.', ',');
}


//Notification functions

function sendUserNotificationPC(){
   let selectedDishes = getFromLocalStorage();
   let desktopContainer = document.getElementById('desktop_basket_container');

    if(selectedDishes.length === 0){
        desktopContainer.innerHTML = getDesktopPlaceholder();
    } else {
        selectedDishes = [];
        saveToLocalStorage(selectedDishes);
        renderBasketDishes(true);
        desktopContainer.innerHTML += notificationTemplate();
    }

}


function sendUserNotificationMobile(){
    let selectedDishes = getFromLocalStorage();
    let mobileBasketContainer = document.getElementById('mobile_basket_container');

    if(selectedDishes.length === 0){
        mobileBasketContainer.innerHTML = getMobilePlaceholder();
    } else {
        selectedDishes = [];
        saveToLocalStorage(selectedDishes);
        renderBasketDishes(true);
        mobileBasketContainer.innerHTML += notificationTemplate();
    }
}




