//variables
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const container = document.querySelector(".container");

//eventos

window.addEventListener("load", () => {
  formulario.addEventListener("submit", buscarClima);
});

//funciones

function buscarClima(e) {
  e.preventDefault();

  const ciudad = document.querySelector("#ciudad").value;
  const pais = document.querySelector("#pais").value;

  if (ciudad === "" || pais === "") {
    mensajeError("Ambos campos son obligatrios");
    return;
  }

  //consultar API
  consultarClima(ciudad, pais);
}

function mensajeError(msg) {
  const divMensaje2 = document.querySelector(".bg-red-100");

  if (!divMensaje2) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add(
      "bg-red-100",
      "border-red-400",
      "text-red-700",
      "px-4",
      "py-3",
      "rounded",
      "max-w-md",
      "mx-auto",
      "mt-6",
      "text-center"
    );

    divMensaje.innerHTML = `
    <strong class="font-bold">Error</strong>
    <span class="block">${msg}</span>
    `;

    container.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

function consultarClima(ciudad, pais) {
  const key = "7b2fb86f78cdde22e83a8fcaf50d7cac";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${key}`;
  spinner();
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((datos) => {
      if (datos.cod === "404") {
        mensajeError("Ciudad no existe");
        return;
      }
      limpiarHTML(); //limpiar div resultado
      mostrarHTML(datos); //mostrar datos en el resultado
    })
    .catch((error) => console.log(error));
}

function mostrarHTML(datos) {
  const {
    name,
    main: { temp, temp_max, temp_min },
  } = datos;

  const centigrados = KelvinACentigrados(temp);
  const max = KelvinACentigrados(temp_max);
  const min = KelvinACentigrados(temp_min);

  //scripting crear div temperatura actual
  const nombreCiudad = document.createElement("p");
  nombreCiudad.innerHTML = `Clima en ${name}`;
  nombreCiudad.classList.add("text-2xl");

  //scripting crear div temperatura actual
  const tempActual = document.createElement("p");
  tempActual.innerHTML = `${centigrados} &#8451;`;
  tempActual.classList.add("font-bold", "text-6xl");

  //scripting crear div temperatura maximo
  const tempMaxima = document.createElement("p");
  tempMaxima.innerHTML = `Máx: ${max} &#8451;`;
  tempMaxima.classList.add("text-xl");

  //scripting crear div temperatura minimo
  const temMinima = document.createElement("p");
  temMinima.innerHTML = `Mín: ${min} &#8451;`;
  temMinima.classList.add("text-xl");

  //scripting poner los div total
  const divResultado = document.createElement("div");
  divResultado.classList.add("text-center", "text-white");
  divResultado.appendChild(nombreCiudad);
  divResultado.appendChild(tempActual);
  divResultado.appendChild(tempMaxima);
  divResultado.appendChild(temMinima);

  resultado.appendChild(divResultado);
}

function KelvinACentigrados(grados) {
  return parseInt(grados - 273.15);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function spinner() {
  limpiarHTML();
  const divSpinner = document.createElement("div");
  divSpinner.classList.add("spinner");
  divSpinner.innerHTML = `
  <div class="double-bounce1"></div>
  <div class="double-bounce2"></div>
  `;

  resultado.appendChild(divSpinner);
}
