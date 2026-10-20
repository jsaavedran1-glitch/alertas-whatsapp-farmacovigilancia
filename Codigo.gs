function notificarNuevaRespuesta(e) {
  var destinatarios = "direcciontecnica@hdv.gov.co,farmacoytecnosydvillavo@gmail.com,qfaseguramientodecalidad@gmail.com,qfasistencialvcio@syd.com.co";
  var asunto = "NUEVO CASO DE FARMACOVIGILANCIA";
  var mensaje = construirMensajeDesdeEvento(e);
  enviarAlertaWhatsApp(mensaje);
  MailApp.sendEmail(destinatarios, asunto, mensaje);
}

function construirMensajeDesdeEvento(e) {
  var valores = (e && e.namedValues) ? e.namedValues : {};
  function campo(nombre) {
    return (valores[nombre] && valores[nombre][0]) ? valores[nombre][0] : "-";
  }
  var emojiAlerta = String.fromCodePoint(0x1F6A8);
  var emojiPersona = String.fromCodePoint(0x1F464);
  var emojiProfesion = String.fromCodePoint(0x1F393);
  var emojiEdad = String.fromCodePoint(0x1F382);
  var emojiDiagnostico = String.fromCodePoint(0x1F4CB);
  var emojiMedicamento = String.fromCodePoint(0x1F48A);
  var emojiServicio = String.fromCodePoint(0x1F3E5);
  var emojiDescripcion = String.fromCodePoint(0x1F4DD);
  var mensaje = emojiAlerta + " NUEVO CASO DE FARMACOVIGILANCIA " + emojiAlerta + String.fromCharCode(10) + String.fromCharCode(10) +
    emojiPersona + " Nombre del Reportante: " + campo("Nombre del reportante") + String.fromCharCode(10) +
    emojiProfesion + " Profesion del Reportante: " + campo("Profesión del reportante") + String.fromCharCode(10) +
    emojiEdad + " Edad del Paciente: " + campo("Edad del paciente en el momento del Evento Adverso Años/Meses/Días") + String.fromCharCode(10) +
    emojiDiagnostico + " Diagnostico del Paciente: " + campo("Diagnóstico del paciente") + String.fromCharCode(10) +
    emojiMedicamento + " Medicamento Sospechoso (via / frecuencia): " + campo("Medicamentos sospechosos junto a la vía de administración (IV, SC, IM, etc.) y frecuencia de administración de los medicamentos formulados (6, 8, 12 H, dosis única o cada cuántos días).") + String.fromCharCode(10) +
    emojiServicio + " Servicio donde Ocurrio el Evento: " + campo("Servicio donde ocurrió el evento adverso") + String.fromCharCode(10) +
    emojiDescripcion + " Descripcion del Evento: " + campo("Descripción análisis del evento adverso");
  return mensaje;
}

function enviarAlertaWhatsApp(mensaje) {
  var props = PropertiesService.getScriptProperties();
  var idInstance = props.getProperty("GREENAPI_ID_INSTANCE");
  var apiToken = props.getProperty("GREENAPI_API_TOKEN");
  var chatId = props.getProperty("GREENAPI_GROUP_CHATID");
  if (!idInstance || !apiToken || !chatId) {
    Logger.log("Faltan credenciales de Green-API en Propiedades del script.");
    return;
  }
  var firmaBot = props.getProperty("GREENAPI_BOT_LABEL") || "Bot Farmacovigilancia HDV";
  var pieBot = "_Bot dise\u00f1ado por el QF Juan Pablo Saavedra \u00b7 Servicio Farmac\u00e9utico HDV_";
  var mensajeFirmado = "*" + firmaBot + "*" + String.fromCharCode(10) + String.fromCharCode(10) + mensaje + String.fromCharCode(10) + String.fromCharCode(10) + pieBot;
  var url = props.getProperty("GREENAPI_API_URL") + "/waInstance" + idInstance + "/sendMessage/" + apiToken;
  var payload = { chatId: chatId, message: mensajeFirmado };
  var options = { method: "post", contentType: "application/json", payload: JSON.stringify(payload), muteHttpExceptions: true };
  var response = UrlFetchApp.fetch(url, options);
  Logger.log(response.getContentText());
}

function listarChatsGreenAPI() {
  var props = PropertiesService.getScriptProperties();
  var idInstance = props.getProperty("GREENAPI_ID_INSTANCE");
  var apiToken = props.getProperty("GREENAPI_API_TOKEN");
  var url = props.getProperty("GREENAPI_API_URL") + "/waInstance" + idInstance + "/getChats/" + apiToken;
  var response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
  var chats = JSON.parse(response.getContentText());
  chats.forEach(function(c) {
    if (String(c.id).indexOf("@g.us") > -1) Logger.log((c.name || "(sin nombre)") + " -> " + c.id);
  });
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

function testConstruccionMensaje() {
  var mensajePrueba = construirMensajeDesdeEvento(eventoDePrueba());
  Logger.log(mensajePrueba);
}

function enviarEjemploAlGrupo() {
  var mensaje = construirMensajeDesdeEvento(eventoDePrueba());
  enviarAlertaWhatsApp(mensaje);
}

function eventoCaso1() {
  return { namedValues: {
    "Nombre del reportante": ["CAMILO ARTURO MORALES HERNANDEZ"],
    "Profesión del reportante": ["ENFERMERO"],
    "Edad del paciente en el momento del Evento Adverso Años/Meses/Días": ["-"],
    "Diagnóstico del paciente": ["ECV TROMBOLIZADO"],
    "Medicamentos sospechosos junto a la vía de administración (IV, SC, IM, etc.) y frecuencia de administración de los medicamentos formulados (6, 8, 12 H, dosis única o cada cuántos días).": ["IV"],
    "Servicio donde ocurrió el evento adverso": ["UCIC C"],
    "Descripción análisis del evento adverso": ["PACIENTE A QUIEN SE ADMINISTRA 150 MCG DE MIDAZOLAM PARA ENTUBACION Y 7 MG DE MIDAZOLAM SIN GENERAL EFECTO DESEADO"]
  } };
}

function eventoCaso5() {
  return { namedValues: {
    "Nombre del reportante": ["Esteban aguilar"],
    "Profesión del reportante": ["Anestesiolgo"],
    "Edad del paciente en el momento del Evento Adverso Años/Meses/Días": ["-"],
    "Diagnóstico del paciente": ["Emabarazo a termino"],
    "Medicamentos sospechosos junto a la vía de administración (IV, SC, IM, etc.) y frecuencia de administración de los medicamentos formulados (6, 8, 12 H, dosis única o cada cuántos días).": ["Subaracnoideo"],
    "Servicio donde ocurrió el evento adverso": ["Sala de cieugia"],
    "Descripción análisis del evento adverso": ["Anestesia raquídea fallida a pesar de realizar técnica sin ninguna dificultad anatómica ni clínica."]
  } };
}

function eventoCaso7() {
  return { namedValues: {
    "Nombre del reportante": ["ARNULFO AGUIRRE VARGAS"],
    "Profesión del reportante": ["MEDICO GENERAL"],
    "Edad del paciente en el momento del Evento Adverso Años/Meses/Días": ["-"],
    "Diagnóstico del paciente": ["TROMBOCITOPENIA (D691)"],
    "Medicamentos sospechosos junto a la vía de administración (IV, SC, IM, etc.) y frecuencia de administración de los medicamentos formulados (6, 8, 12 H, dosis única o cada cuántos días).": ["TROMBOLADE"],
    "Servicio donde ocurrió el evento adverso": ["HOSPITALIZACION GENERAL"],
    "Descripción análisis del evento adverso": ["NO HAY RESPUESTA AL TRATAMIENTO A PESAR DE AUMENTO A DOSIS MAXIMA"]
  } };
}

function enviarCasosReales() {
  var casos = [eventoCaso1(), eventoCaso5(), eventoCaso7()];
  for (var i = 0; i < casos.length; i++) {
    var mensaje = construirMensajeDesdeEvento(casos[i]);
    enviarAlertaWhatsApp(mensaje);
    Utilities.sleep(2000);
  }
}
