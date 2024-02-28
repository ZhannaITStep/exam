const orderList= document.getElementById('order-list'); // ul - область просмотра заказа
        totalPrice = document.getElementById('total-price'); // span в divе - итоговая цена
        pizzaLoader = document.getElementById('pizza-loader'); // div с картинками пиццы
        buttonOrder = document.getElementById('button-order'); // кнопка button Закакзать
        checkBox = [...document.getElementsByTagName('input')]; // inputы - ингридиенты 16шт
        container = document.getElementById('container'); // весь div container
        formsInput = [...document.getElementsByTagName('form')]; // 4 form - столбца с ингридиентами
        img1 = document.getElementById('img1'); // 1 часть пиццы
        img2 = document.getElementById('img2'); // 2 часть пиццы
        img3 = document.getElementById('img3'); // 3 часть пиццы
        img4 = document.getElementById('img4'); // 4 часть пиццы

const pizzaIngrid ={
    base:[
        {
            name: 'classic_base',
            innerName: `Основа "Классик"`,
            price: 2.1,
            checked: false
        },
        {
            name: 'americano_base',
            innerName: `Основа "Американо"`,
            price: 2.4,
            checked: false
        },
        {
            name: 'italiano_base',
            innerName: `Основа "Итальяно"`,
            price: 2.3,
            checked: false
        },
        {
            name: 'hot-dog_base',
            innerName: `Основа "Хот-Дог"`,
            price: 2.2,
            checked: false
        },
    ],
    meat:[
        {
            name: 'ham',
            innerName: `Ветчина`,
            price: 1.4,
            checked: false
        },
        {
            name: 'chicken',
            innerName: `Курица`,
            price: 1.0,
            checked: false
        },
        {
            name: 'bacon',
            innerName: `Бекон`,
            price: 1.3,
            checked: false
        },
        {
            name: 'pepperoni',
            innerName: `Пепперони`,
            price: 1.2,
            checked: false
        }
    ],
    veg:[
        {
            name: 'jalapeno_pepper',
            innerName: `Перец халапенью`,
            price: 0.8,
            checked: false
        },
        {
            name: 'onion',
            innerName: `Лук`,
            price: 0.3,
            checked: false
        },
        {
            name: 'tomatoes',
            innerName: `Томаты`,
            price: 0.7,
            checked: false
        },
        {
            name: 'bell_pepper',
            innerName: `Сладкий перец`,
            price: 0.6,
            checked: false
        },
    ],
    sauce:[
        {
            name: 'tomato',
            innerName: `Томатный соус`,
            price: 0.2,
            checked: false
        },
        {
            name: 'garlic',
            innerName: `Чесночный соус`,
            price: 0.3,
            checked: false
        },
        {
            name: 'cheese',
            innerName: `Сырный соус`,
            price: 0.4,
            checked: false
        },
        {
            name: 'ranch',
            innerName: `Ранч соус`,
            price: 0.3,
            checked: false
        },
    ]
};

//проходим по 16 inputам, по клику меняем checked: false на true и создаем эдементы списка (функция createOrder) и добавляем ингридиенты в итоговый объект (функция addTotalForm). Если снова нажали, то checked снова false и срабатывает функия, которая удаляет элементы из списка заказа (delOrder)
checkBox.forEach(checkInput => {
    checkInput.addEventListener('click', function (e) {  
        pizzaIngrid[e.target.dataset.type].forEach(elem => {
            if (elem.name === e.target.name) {
                elem.checked = !elem.checked;
                if (elem.checked) {
                    createOrder(elem, e);
                    addTotalForm(elem, e);
                } else {
                    delOrder(elem, e);
                }
            }
        })
    })
});

//объект заказа
let totalForm = {  
    base: [],
    meat: [],
    veg: [],
    sauce: [],
};

//проходим по 4 столбцам с ингридиентами, по событию change (срабатывает, когда пользователь изменяет значение в input) будет срабатывать функция, вызывающая две функции: stopChoose (не дает выбрать более одного или двух элементов) и changeImg (считает checked по отдельным формам; меняет картинку)
formsInput.forEach(form => {
    form.addEventListener('change', function() {
        stopChoose(form);
        countForm(totalForm);
    })
});

let total = 0.00;
totalPrice.innerText = total;

//создает элементы списка заказа с ценами, считает итоговую стоимость. При нажатии на элемент уже из списка заказа, будет работать delOrder (удаление элементов из списка заказа) и меняться картинка пиццы (changeImg).
function createOrder(ingrid, e) {  
    const li = document.createElement('li');
    li.innerText = ingrid.innerName+ `      ` + ingrid.price + `$`;
    li.name = ingrid.name;
    orderList.append(li);
    li.addEventListener('click', function clickLi() { 
        ingrid.checked = !ingrid.checked;
        e.target.checked = false;
        delOrder(ingrid, e); 
        countForm(totalForm);
    })
    total += ingrid.price;
    totalPrice.innerText = total.toFixed(2);
}; 

//удаляет элементы из списка заказа
function delOrder(ing, e) { 
    [...orderList.children].forEach(el => {
        if(el.name === ing.name) {
            el.remove();
        }
    })
    delTotalForm(ing, e);  
    total = (total - ing.price);
    totalPrice.innerText = total.toFixed(2); 
};

//добавляет ингридиенты в итоговый объект
function addTotalForm (ingr, e) { 
    for (key in totalForm) {
        if(key === e.target.dataset.type) {
            totalForm[key].push({
                name: ingr.innerName,
                price: ingr.price,
                }                
            )
        }
    }
};

//удаляет ингридиенты из итогового объекта
function delTotalForm(ingr, e) { 
    for(key in totalForm) {
        if(key === e.target.dataset.type) {
            totalForm[key].forEach((elem, i) => {
                if(ingr.innerName === elem.name){
                    totalForm[key].splice(i, 1);
                } 
            });
            stopChoose(e.target.form);
        }   
    }
};

// не дает выбрать более одного или двух элементов
function stopChoose(form) {  
    let all = form.querySelectorAll('[type="checkbox"]');
    let check = form.querySelectorAll('[type="checkbox"]:checked');
    if(form === base || form === sauce) {
    [...all].forEach(el => {
        if(check.length >= 1) {
            el.disabled = true;
            [...check].forEach(elem =>
                elem.disabled = false
            );
        } else {
            all.forEach(el =>
                el.disabled = false
                )
        }
    })
    } else {
    [...all].forEach(el => {
        if(check.length >= 2) {
            el.disabled = true;
            [...check].forEach(elem =>
                elem.disabled = false
            );
        } else {
            all.forEach(el =>
                el.disabled = false
                )
        }
    })
    }  
};

//считает checked по отдельным формам, вызывает функию changeImgActiveBtn
function countForm(arr) {  
    let counter = 0;  
    for(key in arr) {
        if(arr[key].length > 0) {
            counter++
        } else { 
            counter
        }        
    }; 
    changeImgActiveBtn(counter)
};

//меняет картинку, активирует кнопку заказа 
function changeImgActiveBtn(formCounter){
    if (formCounter===1) {
        buttonOrder.style.backgroundColor= `rgb(88, 84, 84)`;
        buttonOrder.style.cursor=""
        document.getElementById('button-order').disabled=true;
        img1.style.opacity = '1';
        img2.style.opacity = '0';
        img3.style.opacity = '0';
        img4.style.opacity = '0';
    } else if (formCounter===2) {
        buttonOrder.style.backgroundColor= `rgb(88, 84, 84)`;
        buttonOrder.style.cursor=""
        document.getElementById('button-order').disabled=true;
        img1.style.opacity = '1';
        img2.style.opacity = '1';
        img3.style.opacity = '0';
        img4.style.opacity = '0';
    } else if (formCounter===3) {
        buttonOrder.style.backgroundColor= `rgb(88, 84, 84)`;
        buttonOrder.style.cursor=""
        document.getElementById('button-order').disabled=true;
        img1.style.opacity = '1';
        img2.style.opacity = '1';
        img3.style.opacity = '1';
        img4.style.opacity = '0';
    } else if (formCounter===4){
        buttonOrder.style.backgroundColor= `rgb(234, 156, 12)`;
        buttonOrder.style.cursor="pointer";
        document.getElementById('button-order').disabled=false;
        img1.style.opacity = '1';
        img2.style.opacity = '1';
        img3.style.opacity = '1';
        img4.style.opacity = '1';
    } else {
        buttonOrder.style.backgroundColor= `rgb(88, 84, 84)`;
        buttonOrder.style.cursor=""
        document.getElementById('button-order').disabled=true;
        img1.style.opacity = '0';
        img2.style.opacity = '0';
        img3.style.opacity = '0';
        img4.style.opacity = '0';
    }
};

//click на кнопку заказа
(function clickButtonOrder() {   
    buttonOrder.addEventListener("click", function() {
        modalWindow();
        console.log(totalForm);
    })
})();

//окно сообщения об успешном оформлении заказа
function modalWindow(){ 

    const wrapper = document.createElement('div');
    wrapper.id="wrapper";
    container.append(wrapper);

    const orderMessage = document.createElement('div');
    orderMessage.id = "order-message";
    wrapper.append(orderMessage);

    const orderMessageImg = document.createElement('div');
    orderMessageImg.className='orderMessageImg';
    orderMessage.append(orderMessageImg);

    const orderMessageH1 = document.createElement('h1');
    orderMessageH1.innerText = 'Спасибо!';
    orderMessage.append(orderMessageH1);

    const orderMessageText = document.createElement('h2');
    orderMessageText.innerText = `Ваш заказ успешно оформлен. Мы свяжемся с Вами в ближайшее время.
    Номер вашего заказа  #${123}`
    orderMessage.append(orderMessageText);

    const closeButton = document.createElement('button');
    closeButton.id = 'closeButton';
    closeButton.innerText = 'x'
    orderMessage.append(closeButton);

    closeButton.addEventListener('click', () => {
        wrapper.style.display = 'none';
        document.body.style.overflow = '';
        location.reload();
    });
}
















