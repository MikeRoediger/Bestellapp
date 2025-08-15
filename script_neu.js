function getDishes(category, indexDishes) {
    var dish = myDishes[category][indexDishes];
    return `<div class="dish">
        <span>${dish.name} - ${dish.price.toFixed(2).replace(".", ",")} €</span>
        <button onclick="addToBasket('${category}', ${indexDishes})">+</button>
    </div>`;
}

function basketData(name, price, amount, i) {
    return `<div class="basketItem">
        <span>${name} x ${amount} - ${(price*amount).toFixed(2).replace(".", ",")} €</span>
        <button onclick="increaseAmount(${i})">+</button>
        <button onclick="decreaseAmount(${i})">-</button>
        <button onclick="deleteDish(${i})">x</button>
    </div>`;
}

function loadBasket() {
    var storedBasket = localStorage.getItem('basket');
    if (storedBasket) basket = JSON.parse(storedBasket);
}

function saveBasket() {
    localStorage.setItem('basket', JSON.stringify(basket));
}

function init() {
    loadBasket();
    renderDishes();
    refreshBasket();
}

function renderDishes() {
    var categories = Object.keys(myDishes);
    for (var i = 0; i < categories.length; i++) {
        var category = categories[i];
        var dishesEl = document.getElementById(category + "DishContent");
        if (!dishesEl) continue;
        dishesEl.innerHTML = "";
        for (var j = 0; j < myDishes[category].length; j++) {
            dishesEl.innerHTML += getDishes(category, j);
        }
    }
}

function addToBasket(category, indexDishes) {
    var dish = myDishes[category][indexDishes];
    var idx = basket.findIndex(function(el){ return el.name === dish.name });
    if (idx !== -1) basket[idx].amount = Number(basket[idx].amount || 0) + 1;
    else basket.push({ name: dish.name, price: dish.price, amount: 1 });
    saveBasket();
    refreshBasket();
}

function decreaseAmount(i) {
    if (!basket[i]) return;
    basket[i].amount = Math.max(0, Number(basket[i].amount || 0) - 1);
    refreshBasket();
}

function increaseAmount(i) {
    if (!basket[i]) return;
    basket[i].amount = Number(basket[i].amount || 0) + 1;
    refreshBasket();
}

function deleteDish(i) {
    basket.splice(i, 1);
    refreshBasket();
}

function refreshBasket() {
    var orderContainer = document.getElementById("orderContainer");
    var orderOverlay = document.getElementById("orderContainerDialog");
    if (orderContainer) orderContainer.innerHTML = "";
    if (orderOverlay) orderOverlay.innerHTML = "";

    for (var i = 0; i < basket.length; i++) {
        var item = basket[i];
        if (item.amount > 0) {
            if (orderContainer) orderContainer.innerHTML += basketData(item.name, item.price, item.amount, i);
            if (orderOverlay) orderOverlay.innerHTML += basketData(item.name, item.price, item.amount, i);
        }
    }
    updateCartCount();
    subtotalCalc();
    deliveryCalc();
    totalCostCalc();
}

function subtotalCalc() {
    var subtotal = 0;
    for (var i = 0; i < basket.length; i++) {
        subtotal += (Number(basket[i].price || 0)) * (Number(basket[i].amount || 0));
    }
    var formatted = subtotal.toFixed(2).replace(".", ",") + " €";
    var subtotalRef = document.getElementById("subtotalCost");
    var subtotalOverlay = document.getElementById("subtotalCostOverlay");
    if (subtotalRef) subtotalRef.innerHTML = formatted;
    if (subtotalOverlay) subtotalOverlay.innerHTML = formatted;
}

function deliveryCalc() {
    var delivery = false;
    var switchBox = document.getElementById("switchBox");
    var switchBoxOverlay = document.getElementById("switchBoxOverlay");
    if ((switchBox && switchBox.checked) || (switchBoxOverlay && switchBoxOverlay.checked)) delivery = true;
    setDeliveryCost(delivery);
    totalCostCalc();
}

function setDeliveryCost(delivery) {
    var text = delivery ? "+4,95 €" : "0,00 €";
    var deliveryRef = document.getElementById("deliveryCost");
    var deliveryOverlay = document.getElementById("deliveryCostOverlay");
    if (deliveryRef) deliveryRef.innerHTML = text;
    if (deliveryOverlay) deliveryOverlay.innerHTML = text;
}

function totalCostCalc() {
    var subtotalRef = document.getElementById("subtotalCost");
    var subtotal = subtotalRef ? Number(subtotalRef.innerText.replace(/[^\d,\.]/g,'').replace(",", ".")) : 0;
    var total = subtotal + deliverySwitchCalc("switchBox");
    var totalOverlay = subtotal + deliverySwitchCalc("switchBoxOverlay");
    var totalRef = document.getElementById("totalCost");
    var totalOverlayRef = document.getElementById("totalCostOverlay");
    if (totalRef) totalRef.innerHTML = total.toFixed(2).replace(".", ",") + " €";
    if (totalOverlayRef) totalOverlayRef.innerHTML = totalOverlay.toFixed(2).replace(".", ",") + " €";
}

function deliverySwitchCalc(id) {
    var ref = document.getElementById(id);
    return (ref && ref.checked) ? 4.95 : 0;
}

function orderAndEmptyBasket() {
    var orderMessage = document.getElementById("orderMessage");
    var orderOverlay = document.getElementById("orderMessageOverlay");

    if (basket.length === 0 || basket.every(function(item){ return item.amount === 0 })) {
        if (orderMessage) { orderMessage.classList.remove("hidden"); orderMessage.innerHTML = "Keinen Hunger? Dein Warenkorb ist noch leer!"; }
        if (orderOverlay) { orderOverlay.classList.remove("hidden"); orderOverlay.innerHTML = "Keinen Hunger? Dein Warenkorb ist noch leer!"; }
        return;
    }

    if (orderMessage) orderMessage.innerHTML = `<p>Deine Testbestellung ist eingegangen!</p><img src="./assets/img/koch.gif" style="width:240px;margin-top:10px;">`;
    if (orderOverlay) orderOverlay.innerHTML = `<p>Deine Testbestellung ist eingegangen!</p><img src="./assets/img/koch.gif" style="width:240px;margin-top:10px;">`;

    basket = [];
    switchBoxCheck();
    refreshBasket();

    setTimeout(function(){
        if (orderMessage) orderMessage.classList.add("hidden");
        if (orderOverlay) orderOverlay.classList.add("hidden");
    }, 3000);
}

function switchBoxCheck() {
    var switchBox = document.getElementById("switchBox");
    var switchOverlay = document.getElementById("switchBoxOverlay");
    if ((switchBox && switchBox.checked) || (switchOverlay && switchOverlay.checked)) {
        if (switchBox) switchBox.checked = false;
        if (switchOverlay) switchOverlay.checked = false;
        deliveryCalc();
    }
}

function toggleOverlay() {
    var overlay = document.getElementById("overlay");
    if (overlay) overlay.classList.toggle("d_none");
}

function eventBubbling(event) {
    event.stopPropagation();
}

function getTotalItems() {
    var sum = 0;
    for (var i = 0; i < basket.length; i++) sum += Number(basket[i].amount || 0);
    return sum;
}

function updateCartCount() {
    var count = getTotalItems();
    var headerRef = document.getElementById("cartCountHeader");
    var overlayRef = document.getElementById("cartCountOverlay");
    if (headerRef) headerRef.innerText = count;
    if (overlayRef) overlayRef.innerText = count;

    var headerIcon = document.getElementById("cartIconHeader");
    var overlayIcon = document.getElementById("cartIconOverlay");

    if (headerIcon) { headerIcon.classList.remove("bump"); void headerIcon.offsetWidth; headerIcon.classList.add("bump"); }
    if (overlayIcon) { overlayIcon.classList.remove("bump"); void overlayIcon.offsetWidth; overlayIcon.classList.add("bump"); }
}
