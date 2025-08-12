// Hilfsfunktion zur einheitlichen Preisformatierung
function formatPrice(value) {
    let number = parseFloat(value);
    if (isNaN(number)) number = 0;
    return number.toFixed(2).replace('.', ',');
}

// Rendering functions for browser and basket contents

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
        // subtotalValue ist schon formatiert mit Komma, daher als Zahl für Addition umwandeln:
        let subtotalNumber = parseFloat(subtotalValue.replace(',', '.')) || 0;
        desktopContainer.innerHTML += getBasketTotal(subtotalValue, formatPrice(subtotalNumber + 5));
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
        let subtotalNumber = parseFloat(subtotalValue.replace(',', '.')) || 0;
        mobileContainer.innerHTML += getBasketTotal(subtotalValue, formatPrice(subtotalNumber + 5));
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
        selectedDish.totalPrice = parseFloat(selectedDish.price); // Speichere als Zahl
        selectedDish.dishAmount = 1; // Sicherstellen, dass dishAmount existiert
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

//Functions to add and subtract number of dishes

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
        basketItem[basketIndex].dishAmount = (basketItem[basketIndex].dishAmount || 1) + 1;
    }

    saveToLocalStorage(basketItem);
    updatePricePerDish(basketIndex);
    renderBasketDishes();
}

function addDishAmountMobile(basketIndex){
    let basketItem = getFromLocalStorage();
    if(basketItem[basketIndex]){
        basketItem[basketIndex].dishAmount = (basketItem[basketIndex].dishAmount || 1) + 1;
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
    let amount = basketDishes[basketIndex].dishAmount || 1;
    let price = parseFloat(basketDishes[basketIndex].price) || 0;

    let subtotal = amount * price;
    basketDishes[basketIndex].totalPrice = subtotal;

    let formattedSubtotal = formatPrice(subtotal);

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
        
        if (dish.totalPrice !== undefined) {
            subtotal += parseFloat(dish.totalPrice) || 0;
        }
    }
    return formatPrice(subtotal);
}

function calculateTotalPrice(price, quantity = 1){
    let total = parseFloat(price) * quantity;
    if(isNaN(total)) total = 0;
    return formatPrice(total);
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