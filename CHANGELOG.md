# Changelog

Todas las fechas en hora de Colombia (America/Bogota).

## [1.2.0] - 2026-07-26

### Cambiado
- Se removió la línea "Revisar caso completo aquí:" y el enlace a la hoja de cálculo del mensaje de WhatsApp.
- Se agregaron emojis al mensaje (título y cada campo), usando `String.fromCodePoint()` para evitar corrupción de codificación.
- `GREENAPI_GROUP_CHATID` actualizado al chatId de producción "Nuevo SF-HDV-SyD-InterSalud" (`120363426937928040@g.us`), tras confirmarlo vía `listarChatsGreenAPI()`.

### Agregado
- `eventoCaso1()`, `eventoCaso5()`, `eventoCaso7()`: datos reales de 3 casos históricos del formulario, usados para pruebas de extremo a extremo.
- `enviarCasosReales()`: envía los 3 casos reales anteriores al grupo configurado, con `Utilities.sleep(2000)` entre envíos.
- Disparador instalable confirmado: `notificarNuevaRespuesta` en evento "Al enviar el formulario" desde la hoja de cálculo vinculada.

## [1.1.0] - 2026-07-26

### Agregado
- `listarChatsGreenAPI()`: función de solo lectura para descubrir chatIds de grupos de WhatsApp visibles para la instancia.
- `eventoDePrueba()`, `testConstruccionMensaje()`, `enviarEjemploAlGrupo()`: utilidades de prueba con datos ficticios.
- Pruebas realizadas exclusivamente contra el grupo "PRUEBA BOT" (`120363412506101174@g.us`).

## [1.0.0] - 2026-07-26

### Agregado
- Versión inicial: `notificarNuevaRespuesta(e)`, `construirMensajeDesdeEvento(e)`, `enviarAlertaWhatsApp(mensaje)`.
- Integración con Green-API (instancia compartida con el bot de Tecnovigilancia, Script Properties independientes).
- Envío de correo a destinatarios institucionales vía `MailApp.sendEmail`.
- 7 campos del formulario incluidos en el mensaje: reportante, profesión, edad, diagnóstico, medicamento sospechoso, servicio, descripción del evento.
