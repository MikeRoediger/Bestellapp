function basketData(name, price, amount, indexDishes) {
    return `
        <div class="orderContainerStyle">
            <p class="orderContainerName">${name}</p>
            <div class="orderContainerAmountPrice">
                <div class="orderContainerAmount">
                    <button class="amountButton" onclick="decreaseAmount(${indexDishes})">-</button>
                    <span>${amount} x </span>
                    <button class="amountButton" onclick="increaseAmount(${indexDishes})">+</button>
                </div>
                <p>${(price * amount).toFixed(2).replace(".", ",")} €</p>
                <img onclick="deleteDish(${indexDishes})" class="binIcon" src="./assets/icons/bin.png" alt="bin">
            </div>
        </div>
    `;
}

function getDishes(category, indexDishes) {
    let dish = myDishes[category][indexDishes];
    return `
        <div class="dishContainer">
            <div class="dishData">
                <h2>${dish.name}</h2>
                <div>${dish.description}</div>
                <br>
                <div class="dishPrice">${dish.price.toFixed(2).replace(".", ",")} €</div>
            </div>
            <button class="addButton" onclick="addToBasket('${category}', ${indexDishes})">+</button>
        </div>
    `;
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

