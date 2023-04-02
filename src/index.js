const form = document.querySelector('#form');
const currencySelect = document.querySelector('#currency');
const cryptocurrencySelect = document.querySelector('#cryptocurrencies');
const cryptoSubmitBtn = document.querySelector('#submit');
const result = document.querySelector('#result');

const objSearch = {
    currency: '',
    cryptocurrency: ''
}

document.addEventListener('DOMContentLoaded', () => {
    getCryptoInfo();
    form.addEventListener('submit', getSelectedCrypto);
    currencySelect.addEventListener('change', readValue);
    cryptocurrencySelect.addEventListener('change', readValue);
});

function getCryptoInfo() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=5&tsym=USD`; 

    fetch(url)
    .then(res => res.json())
    .then(result => selectCryptos(result.Data))
}

function selectCryptos(cryptos) {
    cryptos.forEach(crypto => {
        const {FullName, Name} = crypto.CoinInfo;
        const option = document.createElement('option');
        option.textContent = FullName;
        option.value = Name;
        cryptocurrencySelect.appendChild(option);
    })
}

function getSelectedCrypto(e) {
    e.preventDefault();
    const {currency, cryptocurrency} = objSearch;
    if (currency === '' || cryptocurrency === '') {
        showAlert('Please select both fields');
        return;
    }

    getAPIInfo();
}

function showAlert(alert) {
    const existAlert = document.querySelector('.validation');
    if(!existAlert) {
        const alertMessage = document.createElement('p');
        alertMessage.textContent = alert;
        alertMessage.classList.add('validation', 'mt-5', 'bg-red-500', 'text-white', 'p-3', 'rounded');
        form.appendChild(alertMessage);

        setTimeout(() => {
            alertMessage.remove();
        }, 2500);
    }
}

function readValue(e) {
    objSearch[e.target.name] = e.target.value;
}

function getAPIInfo() {
    const {currency, cryptocurrency} = objSearch;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}`;
    fetch(url)
        .then(res => res.json())
        .then(result => showCryptoDOM(result.DISPLAY[cryptocurrency][currency]))
}

function showCryptoDOM(info) {
    cleanDOM();
    // console.log(info);
    const {CHANGE24HOUR, HIGHDAY, LOWDAY, PRICE} = info;

    const div = document.createElement('div');
    div.classList.add('p-2', 'flex', 'flex-col', 'justify-center', 'items-center');

    const cryptoName = document.createElement('h2');
    cryptoName.textContent = objSearch.cryptocurrency;
    cryptoName.classList.add('text-center', 'my-1');

    const price = document.createElement('h3');
    price.textContent = `Price: ${PRICE}`;

    const change24Hour = document.createElement('p');
    change24Hour.textContent = `Change 24 hour: ${CHANGE24HOUR}`;

    const highDay = document.createElement('p');
    highDay.textContent = `High day: ${HIGHDAY}`;

    const lowDay = document.createElement('p');
    lowDay.textContent = `Low day: ${LOWDAY}`;

    const clearSearch = document.createElement('button');
    clearSearch.textContent = 'Clear Search';
    clearSearch.classList.add('block','bg-slate-950', 'text-white', 'px-4', 'py-1', 'rounded', 'hover:bg-slate-800', 'mt-2');
    clearSearch.onclick = () => {
        cleanDOM();
        objSearch.cryptocurrency = '';
        objSearch.currency = '';
        cryptocurrencySelect.value = '';
        currencySelect.value = '';
    }

    result.appendChild(div);
    div.appendChild(cryptoName);
    div.appendChild(price);
    div.appendChild(change24Hour);
    div.appendChild(highDay);
    div.appendChild(lowDay);
    div.appendChild(clearSearch);
}

function cleanDOM() {
    while(result.firstChild) {
        result.removeChild(result.firstChild);
    }
}