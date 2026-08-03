# Changelog

Todas las fechas en hora de Colombia (America/Bogota).

## [Auditoría - sin cambios de código] - 2026-08-02

Tras detectar y corregir en el Bot Tecnovigilancia un bug de espacios en blanco en los títulos del Google Form (que hacía que campo() no encontrara los valores y devolviera "—"), se auditó este bot para descartar el mismo problema.

Verificado: los 7 nombres de campo usados en campo() dentro de construirMensajeDesdeEvento(e) (Nombre del reportante, Profesión del reportante, Edad del paciente, Diagnóstico del paciente, Medicamentos sospechosos, Servicio donde ocurrió el evento, Descripción análisis del evento) coinciden de forma exacta, sin espacios sobrantes, con los títulos reales de las preguntas del Google Form. El Form tiene como destino la hoja de cálculo correcta. El trigger onFormSubmit hacia notificarNuevaRespuesta está correctamente configurado como único trigger activo. Prueba de solo lectura contra el último caso real del formulario, usando construirMensajeDesdeEvento de producción sin invocar envío: todos los campos salieron poblados correctamente.

Conclusión: no se detectó el mismo bug que en Tecnovigilancia. No se requirió ningún cambio de código. No se enviaron mensajes de prueba al grupo de WhatsApp ni correos durante esta auditoría.

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
