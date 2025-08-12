// I. Function for dishes in the browser
function getDishesTemplate(dish, index, category) {
    return `
            <div id="dish_container_${category}_${index}" class="dish-container">
              <h2>${dish.name}</h2>
              <p>${dish.description}</p>
              <p class="price">${formatPrice(dish.price)}&euro;</p>
              <img
                onclick='moveDishesToBasket("${category}", ${index})'
                id='add_btn'
                class="add-btn"
                src="./assets/img/add_btn.svg"
                alt="Button zum Hinzufügen von Gerichten"
              />
              <img 
                onclick='toggleOverlay()'
                id="shopping_bag_dish" 
                class="shopping-bag-dish"  
                src="./assets/img/shopping-basket-green.svg" 
                alt="Einkaufswagen">
            </div>`;
}

// II. Functions for dishes in the baskets (browser and mobile)
// 2.1.Templates

function getDesktopBasketDishesTemplate(basketIndex){
    let dish = basketDishes[basketIndex];
    let priceToShow = dish.totalPrice !== undefined ? dish.totalPrice : dish.price;
    return `<h2>${dish.name}</h2>
            <table>
                <tr>
                    <td><img onclick='substractDishAmountPC(${basketIndex})' id='substract' class='basket-icons' src="./assets/img/remove.svg" alt="Button zum Entfernen von Gerichten, Minus-Zeichen"></td>
                    <td id='pc_amount_${basketIndex}'>${dish.dishAmount || 1}x</td>
                    <td><img onclick='addDishAmountPC(${basketIndex})' id='add' class='basket-icons' src="./assets/img/add.svg" alt="Button zum Hinzufügen von Gerichten, Plus-Zeichen"></td>
                    <td id='price_pc_${basketIndex}'>${formatPrice(priceToShow)} &euro;</td>
                    <td><img onclick='removeDish(${basketIndex})' id='remove' class='basket-icons' src="./assets/img/trash_bin.svg" alt="Button zum Löschen von Gerichten, Mülleimer"></td>
                </tr>   
            </table>   
    `;
}

function getMobileBasketDishesTemplate(basketIndex){
    let dish = basketDishes[basketIndex];
    let priceToShow = dish.totalPrice !== undefined ? dish.totalPrice : dish.price;
    return `<h2>${dish.name}</h2>
            <table>
                <tr>
                    <td><img onclick='substractDishAmountMobile(${basketIndex})' id='substract' class='basket-icons' src="./assets/img/remove.svg" alt="Button zum Entfernen von Gerichten, Minus-Zeichen"></td>
                    <td id='mobile_amount_${basketIndex}'>${dish.dishAmount || 1}x</td>
                    <td><img onclick='addDishAmountMobile(${basketIndex})' id='add' class='basket-icons' src="./assets/img/add.svg" alt="Button zum Hinzufügen von Gerichten, Plus-Zeichen"></td>
                    <td id='price_mobile_${basketIndex}'>${formatPrice(priceToShow)} &euro;</td>
                    <td><img onclick='removeDish(${basketIndex})' id='remove' class='basket-icons' src="./assets/img/trash_bin.svg" alt="Button zum Löschen von Gerichten, Mülleimer"></td>
                </tr>   
            </table>   
    `;
}

// 2.2.Total-amount-section
function getBasketTotal(subtotalValue, totalAmount){
    return `<div id='separation_bar' class="separation-bar"></div>
            <table id='amount_table' class='total-amount-table'>
                <tr>
                    <td>Zwischensumme</td>
                    <td id='subtotal'> ${subtotalValue} &euro;</td>
                </tr>
                <tr>
                    <td>Lieferkosten</td>
                    <td>5,00 &euro;</td>
                </tr>
                <tr class='total'>
                    <td>Gesamt</td>
                    <td>${totalAmount} &euro;</td>
                </tr>
            </table>`;
}

// 2.3.Placeholders for empty baskets (desktop + mobile)

function getDesktopPlaceholder(){
    return `<div id="basket_placeholder" class="order-placeholder">
              <p>Wähle Deine Gerichte aus der Karte und stelle Dir Dein Menü zusammen.</p>
              <img class="empty-bag" src="./assets/img/empty-bag.png" alt="Eine leere Einkaufstasche">
            </div>`;
}

function getMobilePlaceholder(){
    return `<div id="mobile_basket_placeholder" class="order-placeholder">
              <p>Wähle Deine Gerichte aus der Karte und stelle Dir Dein Menü zusammen.</p>
              <img class="empty-bag" src="./assets/img/empty-bag.png" alt="Eine leere Einkaufstasche">
            </div>`;
}

// 2.4. Notification message for order placement

function notificationTemplate(){
    return `<p class='user-notification'>Ihre Bestellung wurde aufgegeben!<br><br>Guten Appetit!</p><br>
            <img class='cook' src="./assets/img/koch.gif" alt="Koch">`
}