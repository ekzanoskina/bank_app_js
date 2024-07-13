"use strict";


const account1 = {
  owner: "Dmitrii Fokeev",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
  movementsDates: [
    "2019-11-19T21:31:17.178Z", // z означает UTC, в Москве UTC + 3, поэтому отображаемая дата может выглядеть по другому, так как js подстраивается под часовой пояс
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2024-06-30T17:01:17.194Z",
    "2024-07-03T23:36:17.929Z",
    "2024-07-05T10:51:36.790Z",
  ],
  currency: "RUB",
  locale: "pt-PT",
};

const account2 = {
  owner: "Anna Filimonova",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};

const account3 = {
  owner: "Polina Filimonova",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "es-PE",
};

const account4 = {
  owner: "Stanislav Ivanchenko",
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
  ],
  currency: "USD",
  locale: "ru-RU",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Для работы с перемнными создаем локальные области видимости в функциях, чтобы они не влияли на глобальный код


function formatMovementDate(date) {

  // Считаем, сколько дней прошло
  const calcDaysPassed = function (date1, date2) {
    return Math.round((date1 - date2) / (1000 * 60 * 60 * 24))
  };
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return 'Сегодня'
  if (daysPassed === 1) return 'Вчера'
  if (daysPassed >=2 && daysPassed <= 4) return `Прошло ${daysPassed} дня`
  if (daysPassed <= 7 ) return `Прошло ${daysPassed} дней`

  // Выводим дату в формате DD//MM//YYYY
  const year = date.getFullYear() 
  const month = `${date.getMonth() + 1}`.padStart(2, 0); // сначала прекращаем в строку а потом используем padstart
  const day =`${date.getDate()}`.padStart(2, 0);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${day}.${month}.${year} ${hours}:${minutes}`


}
// Отображет все приходы и уходы денежных средств
function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;// метод slice создает независимую копию массива

  movs.forEach(function (value, i) {
    const [type, typeWord] = value >=0 ? ['deposit', 'зачисление'] : ['withdrawal', 'снятие'];
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${i + 1} ${typeWord}
          </div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${value}₽</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html)
  });
};


// Добавляет новое свойство login в аккаунты
function createLogIn(accs) {
  accs.forEach(function (acc) {
    acc.logIn = acc.owner.toLowerCase().split(' ').map(function(val) {
      return val[0]; 
    }).join('');
})};

createLogIn(accounts);

// Выводит на страницу баланс аккаунта и добавляет новое свойство в объект аккаунта balance
function calcPrintBalance (acc) {
  acc.balance = acc.movements.reduce(function (acc, val) {
    return acc + val
  });
  labelBalance.textContent = `${acc.balance}₽`;
};


// Сумма и вывод на страницу прихода и ухода в footer
function calcDisplaySum (movements) {
  const sumIn = movements
    .filter((val) => val >=0)
    .reduce((acc, val) => acc + val);
  const sumOut = movements
    .filter((val) => val < 0)
    .reduce((acc, val) => acc + val);
  labelSumIn.textContent = `${sumIn}₽`
  labelSumOut.textContent = `${Math.abs(sumOut)}₽`
  labelSumInterest.textContent = `${sumIn + sumOut}₽`
};

// Обновление интерфейса сайта
function updateUi(acc) {
  displayMovements(acc);
  calcPrintBalance(acc);
  calcDisplaySum(acc.movements);
}

// Время - timeout & interval
function startLogOut() {
  let time = 600;
  function tick() {  // помещение в переменную дает возможность остановки таймера
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;
  if (time===0) {
    clearInterval(timer);
    containerApp.style.opacity = 0;
  };
  time--
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
}


// Кнопка входа в аккаунт
let currentAccount;
let timer;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // стандартное поведение кнопки в форме - перезагрузка страницы, чтобы убрать его надо использовать preventDefault метод события 
  currentAccount = accounts.find(function(acc) {
    return acc.logIn === inputLoginUsername.value;
  });
  if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = '';
    let locale = navigator.language;
    // let options = {
    //   year: "numeric",
    //   month: "numeric",
    //   day: "numeric",
    //   weekday : "short",
    //   hour: "numeric",
    //   minute: "numeric",
    //   second: "numeric",
    //   timeZoneName : "short",
    //   hour12: false,
    
    // }
    // labelDate.textContent = Intl.DateTimeFormat(locale, options).format(new Date())
    let today = new Date();
    labelDate.textContent = today.toLocaleString(locale, {
      dateStyle: 'short',
      timeStyle: 'medium'
    });
    if (timer) {
      clearInterval(timer); // timer обновляется при выходе и входе в другой аккаунт
    }
    timer = startLogOut();
    updateUi(currentAccount);
  }

});

// Перевод денег
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const receiveAcc = accounts.find((acc) => acc.logIn === inputTransferTo.value);
  const amount  = Number(inputTransferAmount.value);
  if (receiveAcc && 
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiveAcc.logIn !== currentAccount.logIn
  ) {
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiveAcc.movements.push(amount);
    receiveAcc.movementsDates.push(new Date().toISOString());
    // Обновление таймера при переводе денег
    clearInterval(timer);
    timer = startLogOut();
    // Обновление интерфейса
    updateUi(currentAccount);
    inputTransferTo.value = inputTransferAmount.value = '';
  }
});

// Закрытие аккаунта
btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.logIn && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex((acc) => acc.logIn === currentAccount.logIn);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    
  };
  inputClosePin.value = inputCloseUsername.value = '';
});

// Внесение денег
btnLoan.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString())
    // Обновление таймера при внесении средств
    clearInterval(timer);
    timer = startLogOut();
    // Обновление интерфейса
    updateUi(currentAccount);
  };
  inputLoanAmount.value = '';
}
);

// Посчитать общее количество денег на всех аккаунтах
const overallBalance = accounts
.map((acc) => acc.movements)
.flat()
.reduce((acc, val) => acc + val);

// Сортировка
let sorted = false;
btnSort.addEventListener("click", function(e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

labelBalance.addEventListener("click", function(){
  Array.from(document.querySelectorAll(".movements__value"), function(val, i) {
    return (val.innerText = val.textContent.replace('₽', "RUB"))
  })
})

