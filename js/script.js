let userName = prompt("Как вас зовут?");

if (userName === null || userName.trim() === "") {
    userName = "астроном-любитель";
}

//alert-приветствие, console.log-запись в консоль
alert("Привет, " + userName + "! Добро пожаловать на страницу космического энтузиаста!");
console.log("Пользователь: " + userName);



const magnitudes = [
    -2.5,   // Юпитер
    -1.46,  // Сириус
    0.03,   // Вега
    1.98,   // Полярная звезда
    3.4,    // Туманность Андромеды
    5.2,    // Тусклая звезда
    5.7     // Уран
];
//границы
const BRIGHT_LIMIT = 3; //яркие объекты: меньше 3
const DIM_LIMIT = 5;    //тусклые объекты: 5 и больше

console.log("Звёздные величины объектов: " + magnitudes.join("; "));


function findMin(numbers) {
    let min = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        if (numbers[i] < min) {
            min = numbers[i];
        }
    }
    return min;
}

//оставляет значение меньше limit(ярче лимита)
function filterBrighter(numbers, limit) {
    const result = [];
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] < limit) {
            result.push(numbers[i]);
        }
    }
    return result;
}

function sumArray(numbers) {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }
    return sum;
}

//тусклые объекты
function countDim(numbers, limit) {
    let count = 0;
    const dimObjects = [];

    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] >= limit) {
            count++;
            dimObjects.push(numbers[i]);
        }
    }

    
    let average = 0;
    if (count > 0) {
        average = sumArray(dimObjects) / count;
    }

    return { count: count, average: average };
}

function formatNumber(number) {    
    return String(Math.round(number * 100) / 100).replace(".", ",");   //округляет до сотых и ставит запятую
}





const brightest = findMin(magnitudes);  //самый яркий объект<

const brightObjects = filterBrighter(magnitudes, BRIGHT_LIMIT); //яркие объекты (значение < 3)

const averageMagnitude = sumArray(magnitudes)/magnitudes.length;   //средняя яркость

const dimInfo = countDim(magnitudes, DIM_LIMIT); //тусклые объекты (>=5m)




//вывод
alert("В среднем яркость – " + formatNumber(averageMagnitude) + "m, "
    + brightObjects.length + " объектов – яркие");
console.log("Самый яркий объект: " + formatNumber(brightest) + "m");
console.log("Тусклых объектов (≥ 5m): " + dimInfo.count);

if (dimInfo.count > 0) {
    console.log("Средняя яркость тусклых объектов: " + formatNumber(dimInfo.average) + "m");
} else {
    console.log("Средняя яркость тусклых объектов: тусклых объектов нет");
}

//доп:
if (brightest <= -2) {
    console.log("Среди объектов есть очень яркие-возможно, это планеты");
}





//элементы страницы
const objectsList = document.getElementById("objects-list");
const addObjectBtn = document.getElementById("add-object-btn");
const toggleObjectsBtn = document.getElementById("toggle-objects-btn");
const themeToggle = document.getElementById("theme-toggle");
const firstObjectCard = objectsList.querySelector(".card");

if (firstObjectCard) {
    console.log("Первая карточка:", firstObjectCard);
}

if (!objectsList || !addObjectBtn || !toggleObjectsBtn || !themeToggle) {
    console.error("Ошибка: один или несколько элементов страницы не найдены.");
} else {

    const STORAGE_KEY = "cosmicPageState";

    //получаем первоначальные карточки из HTML
    function getInitialObjects() {
        const cards = objectsList.querySelectorAll(".card");
        const objects = [];

        cards.forEach(card => {
            const name = card.querySelector("h3");
            const paragraphs = card.querySelectorAll("p");

            if (name && paragraphs.length >= 3) {
                objects.push({
                    name: name.textContent,
                    type: paragraphs[0].textContent.replace("Тип: ", ""),
                    constellation: paragraphs[1].textContent.replace("Созвездие: ", ""),
                    brightness: paragraphs[2].textContent.replace("Яркость: ", "")
                });
            }
        });

        return objects;
    }

    let objects = getInitialObjects();    //начальные данные
    let isHidden = false;
    let isLightTheme = false;

    //сохранение состояния
    function saveState() {
        const data = {
            objects: objects,
            isHidden: isHidden,
            isLightTheme: isLightTheme
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error("Не удалось сохранить данные:", error);
        }
    }

    //создание карточки
    function createObjectCard(object) {
        const card = document.createElement("article");
        card.classList.add("card");

        const title = document.createElement("h3");
        title.textContent = object.name;

        const type = document.createElement("p");
        type.textContent = "Тип: " + object.type;

        const constellation = document.createElement("p");
        constellation.textContent = "Созвездие: " + object.constellation;

        const brightness = document.createElement("p");
        brightness.textContent = "Яркость: " + object.brightness;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Удалить";
        deleteBtn.type = "button";
        deleteBtn.classList.add("delete-object-btn");

        card.append(title, type, constellation, brightness, deleteBtn);

        return card;
    }

    //отображение всех карточек
    function renderObjects() {
        objectsList.innerHTML = "";

        objects.forEach(object => {
            const card = createObjectCard(object);
            objectsList.append(card);
        });

        //кнопки удаления
        const deleteButtons = objectsList.querySelectorAll(".delete-object-btn");

        deleteButtons.forEach((button, index) => {
            button.addEventListener("click", function () {
                objects.splice(index, 1);

                renderObjects();
                saveState();
            });
        });
    }



    //добавление нового объекта
    addObjectBtn.addEventListener("click", function () {
        const name = prompt("Введите название объекта:");
        if (name === null || name.trim() === "") {
            alert("Название объекта не указано.");
            return;
        }

        const type = prompt("Введите тип объекта (звезда, планета, галактика и т. д.):");
        if (type === null || type.trim() === "") {
            alert("Тип объекта не указан.");
            return;
        }

        const constellation = prompt("Введите созвездие или местоположение объекта:");
        if (constellation === null || constellation.trim() === "") {
            alert("Местоположение объекта не указано.");
            return;
        }

        const brightness = prompt("Введите звёздную величину объекта:");
        if (brightness === null || brightness.trim() === "") {
            alert("Яркость объекта не указана.");
            return;
        }

        const newObject = {
            name: name.trim(),
            type: type.trim(),
            constellation: constellation.trim(),
            brightness: brightness.trim()
        };

        objects.push(newObject);

        renderObjects();
        saveState();

        alert("Объект успешно добавлен");
    });

    //скрытие и отображение карточек
    toggleObjectsBtn.addEventListener("click", function () {
        isHidden = !isHidden;
        objectsList.hidden = isHidden;

        toggleObjectsBtn.setAttribute("aria-expanded", String(!isHidden));
        toggleObjectsBtn.textContent = isHidden
            ? "Показать объекты"
            : "Скрыть объекты";
        saveState();
    });

    //переключение тем
    themeToggle.addEventListener("click", function () {
        isLightTheme = !isLightTheme;
        document.body.classList.toggle("light-theme", isLightTheme);
        themeToggle.textContent = isLightTheme
            ? "Включить тёмную тему"
            : "Включить светлую тему";
        saveState();
    });


    //восстановление состояния при открытии страницы
    loadState();
    renderObjects();

    objectsList.hidden = isHidden;

    toggleObjectsBtn.setAttribute("aria-expanded", String(!isHidden));
    toggleObjectsBtn.textContent = isHidden
        ? "Показать объекты"
        : "Скрыть объекты";

    document.body.classList.toggle("light-theme", isLightTheme);

    themeToggle.textContent = isLightTheme
        ? "Включить тёмную тему"
        : "Включить светлую тему";
   
    saveState();  //первоначальное сохранение карточек при первом запуске
}