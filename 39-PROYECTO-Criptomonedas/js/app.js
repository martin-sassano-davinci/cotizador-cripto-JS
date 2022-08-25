
const criptoSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const form = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const objBusqueda = {
    moneda: '',
    criptomoneda: ''
};

const obtenerCriptomonedas = criptomonedas => new Promise( resolve =>{
        resolve(criptomonedas);
    })

document.addEventListener('DOMContentLoaded', ()=>{
    consultaCriptomonedas();
    form.addEventListener('submit', cotizar);
    criptoSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

async function consultaCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
    .then(respuesta => respuesta.json())
    .then(resultado => obtenerCriptomonedas(resultado.Data))
    .then(criptomonedas => selectCriptomonedas(criptomonedas))

    
}

function selectCriptomonedas(criptomonedas) {
    // console.log(criptomonedas)
    criptomonedas.forEach(cripto => {
        const { FullName, Name} = cripto.CoinInfo;
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptoSelect.appendChild(option);

    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
    console.log(objBusqueda);
}

function cotizar(e) {
    e.preventDefault();
    const { moneda, criptomoneda} = objBusqueda;

    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
    } else {
        consultarApi();
    }
        
    
}

async function consultarApi() {
    const {moneda, criptomoneda} = objBusqueda;
    
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(cotizacion => mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda]))
    
}
function mostrarCotizacion(cotizacion) {
    limpiarHTML()
    console.log(cotizacion);
     const {LOWDAY, HIGHDAY, CHANGEPCT24HOUR, PRICE, LASTUPDATE} = cotizacion;

     const precio = document.createElement('p');
     precio.classList.add('precio');
     precio.innerHTML = `El precio es: <span>${PRICE}</span`;

     const precioAlto = document.createElement('p');
     precioAlto.innerHTML = `El precio mas alto del dia fue: <span>${HIGHDAY}</span`;

     const precioBajo = document.createElement('p');
     precioBajo.innerHTML = `El precio mas bajo del dia fue: <span>${LOWDAY}</span`;

     const precio24hs = document.createElement('p');
     precio24hs.innerHTML = `La variacion en las ultimas 24hs fue: <span>${CHANGEPCT24HOUR}%</span`;

     const precioActualizacion = document.createElement('p');
     precioActualizacion.innerHTML = `Ultima actualizacion: <span>${LASTUPDATE}</span`;

     resultado.appendChild(precio);
     resultado.appendChild(precioAlto);
     resultado.appendChild(precioBajo);
     resultado.appendChild(precio24hs);
     resultado.appendChild(precioActualizacion);
}
function mostrarAlerta(mensaje) {
    
    const existeError = document.querySelector('.error');
    
    if (!existeError) {

        const alerta = document.createElement('p');
        alerta.classList.add('error');

        alerta.innerHTML = `
        <strong class='font-bold'>Error!</strong>
        <span class='block sm:inline'>${mensaje}</span>
        `;
    
        form.appendChild(alerta);
        setTimeout(() => {           
            alerta.remove();
        }, 3000);
    }
}
function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}
function mostrarSpinner() {

    limpiarHTML();
    
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    `;
    resultado.appendChild(divSpinner);
}