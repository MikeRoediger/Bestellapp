// Konstanten für DOM-Elemente
const orderContainerRef = document.getElementById("orderContainer");
const orderContainerDialogRef = document.getElementById("orderContainerDialog");
const subtotalRef = document.getElementById("subtotalCost");
const subtotalOverlayRef = document.getElementById("subtotalCostOverlay");
const deliveryRef = document.getElementById("deliveryCost");
const deliveryOverlayRef = document.getElementById("deliveryCostOverlay");
const totalCostRef = document.getElementById("totalCost");
const totalCostOverlayRef = document.getElementById("totalCostOverlay");
const switchBoxRef = document.getElementById("switchBox");
const switchBoxOverlayRef = document.getElementById("switchBoxOverlay");
const overlayRef = document.getElementById("overlay");
const orderMessageRef = document.getElementById("orderMessage");
const orderMessageOverlayRef = document.getElementById("orderMessageOverlay");
const overlayCountRef = document.getElementById("cartCountOverlay");

function loadBasket() {
    const storedBasket = localStorage.getItem('basket');
    if (storedBasket) {
        basket = JSON.parse(storedBasket);
    }
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
    for (let index = 0; index < Object.entries(myDishes).length; index++) {
        let category = Object.entries(myDishes)[index][0];
        let dishes = document.getElementById(category + "DishContent");
        if (!dishes) continue;
        dishes.innerHTML = "";
        for (let indexDishes = 0; indexDishes < myDishes[category].length; indexDishes++) {
            dishes.innerHTML += getDishes(category, indexDishes);
        }
    }
}

function addToBasket(category, indexDishes) {
    const dish = myDishes[category][indexDishes];
    let basketIndex = -1;
    for (let i = 0; i < basket.length; i++) {
        if (basket[i].name === dish.name) {
            basketIndex = i;
            break;
        }
    }
    if (basketIndex !== -1) {
        basket[basketIndex].amount = Number(basket[basketIndex].amount || 0) + 1;
    } else {
        basket.push({ name: dish.name, price: dish.price, amount: 1 });
    }
    saveBasket();
    refreshBasket();
}

function decreaseAmount(indexDishes) {
    if (!basket[indexDishes]) return;
    const current = Number(basket[indexDishes].amount || 0);
    basket[indexDishes].amount = Math.max(0, current - 1);
    if (basket[indexDishes].amount === 0) {
        basket.splice(indexDishes, 1);
    }
    saveBasket();
    refreshBasket();
}

function increaseAmount(indexDishes) {
    if (!basket[indexDishes]) return;
    basket[indexDishes].amount = Number(basket[indexDishes].amount || 0) + 1;
    saveBasket();
    refreshBasket();
}

function deleteDish(indexDishes) {
    basket.splice(indexDishes, 1);
    saveBasket();
    refreshBasket();
}

function refreshBasket() {
    if (orderContainerRef) orderContainerRef.innerHTML = "";
    if (orderContainerDialogRef) orderContainerDialogRef.innerHTML = "";
    let totalItems = 0;
    for (let i = 0; i < basket.length; i++) {
        if (basket[i].amount > 0) {
            totalItems += basket[i].amount;
            const itemHTML = basketData(basket[i].name, basket[i].price, basket[i].amount, i);
            if (orderContainerRef) orderContainerRef.innerHTML += itemHTML;
            if (orderContainerDialogRef) orderContainerDialogRef.innerHTML += itemHTML;
        }
    }
    updateCartCount();
    subtotalCalc();
    deliveryCalc();
    totalCostCalc();
}

function subtotalCalc() {
    let subtotal = 0;
    for (let i = 0; i < basket.length; i++) {
        const amt = Number(basket[i].amount || 0);
        const price = Number(basket[i].price || 0);
        subtotal += amt * price;
    }
    const formatted = subtotal.toFixed(2).replace(".", ",") + " €";
    if (subtotalRef) subtotalRef.innerHTML = formatted;
    if (subtotalOverlayRef) subtotalOverlayRef.innerHTML = formatted;
}

function deliveryCalc() {
    const delivery = (switchBoxRef && switchBoxRef.checked) || (switchBoxOverlayRef && switchBoxOverlayRef.checked);
    const text = delivery ? "+4,95 €" : "0,00 €";
    if (deliveryRef) deliveryRef.innerHTML = text;
    if (deliveryOverlayRef) deliveryOverlayRef.innerHTML = text;
    totalCostCalc();
}

function totalCostCalc() {
    let subtotal = 0;
    if (subtotalRef) {
        subtotal = Number(subtotalRef.innerText.replace(/[^\d,\.]/g, '').replace(",", "."));
    }
    const deliveryCost = (switchBoxRef && switchBoxRef.checked) || (switchBoxOverlayRef && switchBoxOverlayRef.checked) ? 4.95 : 0;
    const total = subtotal + deliveryCost;
    const formatted = total.toFixed(2).replace(".", ",") + " €";
    if (totalCostRef) totalCostRef.innerHTML = formatted;
    if (totalCostOverlayRef) totalCostOverlayRef.innerHTML = formatted;
}

function orderAndEmptyBasket() {
    let message = "";
    if (basket.length === 0 || basket.every(item => item.amount === 0)) {
        message = "Keinen Hunger? Dein Warenkorb ist noch leer!";
    } else {
        message = `
            <p>Deine Testbestellung ist eingegangen!</p>
            <img src="./assets/img/koch.gif" alt="Koch jubelt" style="width:240px; margin-top:10px;">
        `;
        basket.length = 0;
        saveBasket();
        switchBoxCheck();
        refreshBasket();
    }
    if (orderMessageRef) {
        orderMessageRef.classList.remove("hidden");
        orderMessageRef.innerHTML = message;
    }
    if (orderMessageOverlayRef) {
        orderMessageOverlayRef.classList.remove("hidden");
        orderMessageOverlayRef.innerHTML = message;
    }
    orderMessageDisappear();
}

function orderMessageDisappear() {
    setTimeout(() => {
        if (orderMessageRef) orderMessageRef.classList.add("hidden");
        if (orderMessageOverlayRef) orderMessageOverlayRef.classList.add("hidden");
    }, 3000);
}

function switchBoxCheck() {
    if ((switchBoxRef && switchBoxRef.checked) || (switchBoxOverlayRef && switchBoxOverlayRef.checked)) {
        if (switchBoxRef) switchBoxRef.checked = false;
        if (switchBoxOverlayRef) switchBoxOverlayRef.checked = false;
        deliveryCalc();
    }
}

function toggleOverlay() {
    if (overlayRef) overlayRef.classList.toggle("d_none");
}

function eventBubbling(event) {
    event.stopPropagation();
}

function getTotalItems() {
    let sum = 0;
    for (let i = 0; i < basket.length; i++) {
        sum += Number(basket[i].amount || 0);
    }
    return sum;
}

function updateCartCount() {
    const count = getTotalItems();
    if (overlayCountRef) overlayCountRef.innerText = count;
}
