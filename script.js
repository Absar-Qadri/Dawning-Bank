'use strict';

const account1 = {
  owner: 'Alia Czratal',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2,
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2023-08-28T14:11:59.604Z',
    '2023-08-30T17:01:17.194Z',
    '2023-09-01T23:36:17.929Z',
    '2023-09-02T10:51:36.790Z',
  ],
  currency: 'JPY',
  currVal: 146.2,
  timeZone: 'Asia/Tokyo',
  code: 'ja-JP',
};

const account2 = {
  owner: 'Usmaan Ranga',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2023-08-28T14:11:59.604Z',
    '2023-08-30T17:01:17.194Z',
    '2023-09-01T23:36:17.929Z',
    '2023-09-02T10:51:36.790Z',
  ],
  currency: 'EUR',
  currVal: 0.93,
  timeZone: 'Europe/London',
  code: 'en-GB',
};

const account3 = {
  owner: 'Umer Tappa',
  movements: [200, 2000, 340, -300, -20, 50, 400, 460],
  interestRate: 0.7,
  pin: 3333,
  timeZone: 'Australia/Sydney',
  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2023-08-28T14:11:59.604Z',
    '2023-08-30T17:01:17.194Z',
    '2023-09-01T23:36:17.929Z',
    '2023-09-02T10:51:36.790Z',
  ],
  currency: 'AUD',
  currVal: 1.55,
  code: 'en-AU',
};

const account4 = {
  owner: 'Areeb Gulla',
  movements: [4000, 1000, 800, 1000, 100],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2022-01-28T09:15:04.904Z',
    '2022-04-01T10:17:24.185Z',
    '2023-08-28T14:11:59.604Z',
    '2023-08-30T17:01:17.194Z',
    '2023-09-01T23:36:17.929Z',
    '2023-09-02T10:51:36.790Z',
  ],
  currency: 'USD',
  currVal: 1,
  timeZone: 'America/New_York',
  code: 'en-US',
};

const accounts = [account1, account2, account3, account4];

const labelWelcome = document.querySelector('.welcome');
const labelBalance = document.querySelector('.balance-value');
const labelDate = document.querySelector('.date');
const labelTimer = document.querySelector('.timer');
const summaryIn = document.querySelector('.summary-value-in');
const summaryOut = document.querySelector('.summary-value-out');
const summaryIntrest = document.querySelector('.summary-value-interest');

const appContainer = document.querySelector('.app');
const transferWindow = document.querySelector('.transfers');
const logOut = document.querySelector('.tool-tip');

const btnLogin = document.querySelector('.login_btn');
const btnTransfer = document.querySelector('.form-btn-transfer');
const btnLoan = document.querySelector('.form-btn-loan');
const btnClose = document.querySelector('.form-btn-close');
const btnSort = document.querySelector('.btn-sort');

const logInUser = document.querySelector('.login_input--user');
const logInPin = document.querySelector('.login_input--pin');
const transferTo = document.querySelector('.form-input-to');
const transferToAmnt = document.querySelector('.form-input-amount');
const reqLoanAmnt = document.querySelector('.form-input-loan-amount');
const closeAccUser = document.querySelector('.form-input-user');
const closeAccPin = document.querySelector('.form-input-pin');

let currentAccount, timer, clock;

const updateTime = function (timeZone) {
  const updation = function () {
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
      timeZone: timeZone,
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.code,
      options
    ).format(now);
  };
  updation();

  const clock = setInterval(updation, 1000);
  return clock;
};

const logOutTimer = function () {
  let time = 120;

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      appContainer.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
    }
    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

const displayTransactions = function (accounts, sort = false) {
  transferWindow.innerHTML = '';

  const movementOfDates = function (date, code) {
    const calDaysPassed = (date1, date2) =>
      Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
    const diff = calDaysPassed(new Date(), date);

    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff <= 7) return `${diff} days ago`;

    return new Intl.DateTimeFormat(code).format(date);
  };

  const movs = sort
    ? accounts.movements.slice().sort((a, b) => a - b)
    : accounts.movements;
  movs.forEach(function (mov, i) {
    const date = new Date(accounts.movementsDates[i]);
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const displayDate = movementOfDates(date, accounts.code);

    const formatedMov = formatCurrencies(mov, accounts);

    const html = `
      <div class="transfers-row">
      <div class="transfers-type transfers-type--${type}">${i + 1} ${type}</div>
      <div class="transfers-date">${displayDate}</div>
      <div class="transfers-value">${formatedMov}</div>
    `;
    transferWindow.insertAdjacentHTML('afterbegin', html);
  });
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(names => names[0])
      .join('');
  });
};
createUserNames(accounts);

const balanceCalculator = function (accounts) {
  accounts.balance = accounts.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = formatCurrencies(accounts.balance, accounts);
};

const formatCurrencies = function (value, acc) {
  const formatedValue = new Intl.NumberFormat(acc.code, {
    style: 'currency',
    currency: acc.currency,
  }).format(value);
  return formatedValue;
};

const calcDisplaySummary = function (accounts) {
  const inValue = accounts.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  summaryIn.textContent = formatCurrencies(inValue, accounts);

  const OutValue = accounts.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  summaryOut.textContent = formatCurrencies(OutValue, accounts);

  const interestValue = accounts.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * accounts.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, mov) => acc + mov, 0);
  summaryIntrest.textContent = formatCurrencies(interestValue, accounts);
};

const updateUI = function (acc) {
  displayTransactions(currentAccount);
  calcDisplaySummary(currentAccount);
  balanceCalculator(currentAccount);
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === logInUser.value);
  if (currentAccount?.pin === Number(logInPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    appContainer.style.opacity = 1;
    logInUser.value = logInPin.value = '';
    logInPin.blur();
    updateUI(currentAccount);
  } else {
    appContainer.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    setTimeout(() => alert(`Wrong Pin or Username`), 500);
  }
  if (clock) clearInterval(clock);
  clock = updateTime(currentAccount.timeZone);

  if (timer) clearInterval(timer);
  timer = logOutTimer();
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const now = new Date();
  now.toISOString;
  const amount = Number(transferToAmnt.value);
  const recieverAccount = accounts.find(
    acc => acc.username === transferTo.value
  );
  transferTo.value = transferToAmnt.value = '';
  transferToAmnt.blur();
  if (
    amount > 0 &&
    recieverAccount &&
    currentAccount.balance > amount &&
    recieverAccount.username !== currentAccount.username
  ) {
    const sender = currentAccount.currVal;
    const reciever = recieverAccount.currVal;
    const currConver = sender / reciever;

    const cm = Number(currConver.toFixed(5));
    const conMoney = amount / cm;

    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(conMoney);
    console.log(recieverAccount.movements);
    currentAccount.movementsDates.push(now);
    recieverAccount.movementsDates.push(now);

    updateUI(currentAccount);
    clearInterval(timer);
    timer = logOutTimer();
  } else {
    alert(`Some error occured! \nMoney not debited \nTry checking username`);
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const checkUser = closeAccUser.value;
  const checkPin = Number(closeAccPin.value);

  closeAccUser.value = closeAccPin.value = '';
  closeAccPin.blur();
  if (
    checkUser === currentAccount.username &&
    checkPin === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);

    appContainer.style.opacity = 0;
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const now = new Date();
  now.toISOString;
  const amount = Math.floor(reqLoanAmnt.value);

  reqLoanAmnt.value = '';
  reqLoanAmnt.blur();

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(now);
      updateUI(currentAccount);
    }, 2500);
  }
  clearInterval(timer);
  timer = logOutTimer();
});

let sorted = false;
btnSort.addEventListener('click', function () {
  displayTransactions(currentAccount, !sorted);
  sorted = !sorted;
});

logOut.addEventListener('click', function () {
  appContainer.style.opacity = 0;
  labelWelcome.textContent = 'Log in to get started';
});

//////////////////////////////////// Creating Array from HTML///////////////////////////////////////////

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.transfers-value'),
//     el => Number(el.textContent.replace(currentAccount.curr, ''))
//   );
// });

//////////////////////////////////// Creating Array from HTML///////////////////////////////////////////
