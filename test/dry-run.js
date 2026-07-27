// test/dry-run.js
//
// Reconstruye la logica de construirMensajeDesdeEvento() de Codigo.gs en Node.js puro,
// sin PropertiesService ni UrlFetchApp, para verificar el formato del mensaje
// SIN tocar el proyecto de Apps Script ni enviar nada real.
//
// Uso: node test/dry-run.js

function construirMensajeDesdeEvento(e) {
  const valores = (e && e.namedValues) ? e.namedValues : {};
  function campo(nombre) {
    return (valores[nombre] && valores[nombre][0]) ? valores[nombre][0] : "-";
  }
  const emojiAlerta = String.fromCodePoint(0x1F6A8);
  const emojiPersona = String.fromCodePoint(0x1F464);
  const emojiProfesion = String.fromCodePoint(0x1F393);
  const emojiEdad = String.fromCodePoint(0x1F382);
  const emojiDiagnostico = String.fromCodePoint(0x1F4CB);
  const emojiMedicamento = String.fromCodePoint(0x1F48A);
  const emojiServicio = String.fromCodePoint(0x1F3E5);
  const emojiDescripcion = String.fromCodePoint(0x1F4DD);

  const mensaje = emojiAlerta + " NUEVO CASO DE FARMACOVIGILANCIA " + emojiAlerta + "\n\n" +
    emojiPersona + " Nombre del Reportante: " + campo("Nombre del reportante") + "\n" +
    emojiProfesion + " Profesion del Reportante: " + campo("Profesión del reportante") + "\n" +
    emojiEdad + " Edad del Paciente: " + campo("Edad del paciente en el momento del Evento Adverso Años/Meses/Días") + "\n" +
    emojiDiagnostico + " Diagnostico del Paciente: " + campo("Diagnóstico del paciente") + "\n" +
    emojiMedicamento + " Medicamento Sospechoso (via / frecuencia): " + campo("Medicamentos sospechosos junto a la vía de administración (IV, SC, IM, etc.) y frecuencia de administración de los medicamentos formulados (6, 8, 12 H, dosis única o cada cuántos días).") + "\n" +
    emojiServicio + " Servicio donde Ocurrio el Evento: " + campo("Servicio donde ocurrió el evento adverso") + "\n" +
    emojiDescripcion + " Descripcion del Evento: " + campo("Descripción análisis del evento adverso");

  return mensaje;
}

function eventoDePrueba() {
  return { namedValues: {
    "Nombre del reportante": ["Juan Perez"],
    "Profesión del reportante": ["Enfermero Jefe"],
    "Edad del paciente en el momento del Evento Adverso Años/Meses/Días": ["45 anios"],
    "Diagnóstico del paciente": ["Hipertension arterial"],
    "Medicamentos sospechosos junto a la vía de administración (IV, SC, IM, etc.) y frecuencia de administración de los medicamentos formulados (6, 8, 12 H, dosis única o cada cuántos días).": ["Losartan - Oral - cada 12 horas"],
    "Servicio donde ocurrió el evento adverso": ["Urgencias"],
    "Descripción análisis del evento adverso": ["Paciente presento hipotension sintomatica 30 minutos despues de la administracion del medicamento."]
  } };
}

function eventoSinDatos() {
  // Simula el caso de ejecutar la funcion sin un evento real de formulario (e === undefined).
  return undefined;
}

function main() {
  console.log("=== Dry run: caso de prueba con datos completos ===\n");
  console.log(construirMensajeDesdeEvento(eventoDePrueba()));

  console.log("\n\n=== Dry run: caso sin evento (todos los campos en '-') ===\n");
  console.log(construirMensajeDesdeEvento(eventoSinDatos()));

  console.log("\n\nOK: construccion de mensaje verificada sin llamar ninguna API externa.");
}

main();
