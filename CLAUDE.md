# CLAUDE.md — Contexto operativo del proyecto

Este archivo documenta reglas y convenciones para cualquier asistente de IA (Claude u otro) que continúe trabajando en este repositorio.

## Qué es este proyecto

Bot de alertas por WhatsApp + correo para el Programa de Farmacovigilancia del Hospital Departamental de Villavicencio E.S.E. (HDV E.S.E.). Es un Google Apps Script container-bound, vinculado a la hoja de cálculo de respuestas del formulario Google "REPORTE FARMACOVIGILANCIA FOREAM".

Existe un proyecto hermano, "Bot Tecnovigilancia", con arquitectura idéntica pero para el programa de Tecnovigilancia. Ambos comparten la misma instancia de Green-API (`710722693364`) pero cada uno tiene su propio store de Script Properties — son completamente independientes en configuración pese a compartir instancia.

## Reglas de seguridad — NUNCA romper esto

1. Nunca enviar mensajes de prueba al grupo de producción ("Nuevo SF-HDV-SyD-InterSalud"). Todas las pruebas van exclusivamente al grupo "PRUEBA BOT".
2. Antes de ejecutar cualquier función que envíe WhatsApp o correo real, verificar:
   - Qué chatId tiene configurado `GREENAPI_GROUP_CHATID` en ese momento.
   - Que el selector de función en la barra de herramientas del editor de Apps Script muestre exactamente la función que se va a ejecutar (tomar screenshot y confirmar antes de pulsar "Ejecutar" — el dropdown de Google a veces no cierra/commitea la selección con un solo clic).
   - Después de ejecutar, confirmar en "Ejecuciones" (`/executions`) qué función realmente corrió — no confiar solo en el registro de ejecución inline, que puede corresponder a una ejecución anterior si el selector no cambió a tiempo.
3. `listarChatsGreenAPI()` es de solo lectura (usa `getChats`, no `sendMessage`) — es la función segura para descubrir chatIds sin riesgo de enviar nada.
4. Nunca hardcodear credenciales de Green-API en el código. Todo vía `PropertiesService.getScriptProperties()`.
5. Este código corre en producción real de un hospital — cualquier envío accidental de correo/WhatsApp llega a personas reales (direcciontecnica@hdv.gov.co, farmacoytecnosydvillavo@gmail.com, qfaseguramientodecalidad@gmail.com, qfasistencialvcio@syd.com.co, y el grupo de WhatsApp del comité). Actuar con la misma cautela que en cualquier sistema de producción hospitalaria.

## Convenciones de edición del código (Apps Script / Monaco editor)

El editor de Google Apps Script usa Monaco, con comportamientos distintos a VSCode al automatizarlo vía navegador:

- El auto-cierre de llaves (`{` → `{}`) es inconsistente cuando el texto se inserta mediante automatización de navegador (no como tecleo real): a veces duplica la llave de cierre, a veces no la inserta en absoluto. No asumir ningún comportamiento — verificar siempre con `get_page_text` o capturas de pantalla después de escribir bloques de código.
- Método más confiable para reescribir el archivo completo sin arriesgar llaves desbalanceadas: usar la consola de JavaScript de la página (`monaco.editor.getModels()[0].setValue(nuevoTexto)`), que reemplaza el contenido del modelo de forma atómica, sin pasar por el sistema de auto-cierre de brackets del editor.
- Después de cualquier edición grande, abrir el selector de función en la barra de herramientas y confirmar que aparecen todas las funciones esperadas como entradas de nivel superior. Si una función esperada no aparece, probablemente quedó anidada dentro de otra por un cierre de llave faltante.
- Antes de ejecutar una función, verificar el nombre mostrado en el selector con una captura de pantalla — no confiar en que el clic anterior haya "commiteado" la selección.

## Convenciones al editar en GitHub (editor CodeMirror 6)

El editor web de GitHub ("Add file → Create new file") tiene sus propias trampas distintas a las de Apps Script:

- Escribir texto largo con muchos caracteres acentuados vía automatización de teclado puede corromperse en un solo bloque de caracteres repetidos. Si eso ocurre, no reintentar tecleando — usar `document.execCommand('insertText', false, contenido)` sobre el elemento `.cm-content` (contenteditable), que inserta el texto como una operación atómica de pegado y evita esa corrupción.
- Las listas con viñetas (`-`) o numeradas (`1.`) se auto-continúan al escribir saltos de línea de forma simulada, duplicando el marcador (`- - texto`, `2. 2. texto`) en cada línea siguiente, incluso fuera de la lista. La solución robusta es la misma: usar `execCommand('insertText', ...)` en vez de simular tecleo con saltos de línea, ya que ese método no dispara el keymap de "continuar lista" (que solo se activa con eventos reales de tecla Enter).
- Verificar siempre el resultado con `get_page_text` (cuenta de líneas y contenido) antes de hacer commit.

## Convenciones de datos (formulario/hoja de cálculo)

- Los nombres de campo en `e.namedValues` deben coincidir carácter por carácter con los encabezados de columna de la hoja de respuestas (incluyendo tildes y puntuación).
- Para navegar celdas en Google Sheets sin riesgo de sobrescribir contenido, usar el Cuadro de nombres (Name Box, ej. escribir `AE8` + Enter) en vez de hacer clic directo en la grilla.
- Si aparece un banner de "nombre de columna duplicado" en la hoja, puede ser un artefacto residual de una operación anterior — verificar con una captura de pantalla fresca antes de asumir que hay corrupción real.

## Campos del mensaje de alerta

1. Nombre del reportante
2. Profesión del reportante
3. Edad del paciente en el momento del Evento Adverso (Años/Meses/Días)
4. Diagnóstico del paciente
5. Medicamentos sospechosos junto a la vía de administración y frecuencia de administración
6. Servicio donde ocurrió el evento adverso
7. Descripción/análisis del evento adverso

El mensaje no incluye enlace a la hoja de cálculo (se removió a pedido explícito del usuario) y usa emojis vía `String.fromCodePoint()` (no caracteres literales) para evitar corrupción de codificación al escribir en el editor.

## Marco regulatorio aplicable

Resolución 4816 de 2008 (tecnovigilancia/farmacovigilancia), algoritmo OMS-UMC de causalidad en farmacovigilancia, Resolución 3100 de 2019 — Colombia, INVIMA / Ministerio de Salud.

## Contexto institucional del usuario

Juan Pablo Saavedra — Químico Farmacéutico, Referente de Farmacovigilancia/Tecnovigilancia del Hospital Departamental de Villavicencio E.S.E. No mezclar este contexto (HDV Villavicencio) con el del Hospital San Juan de Dios de Puerto Carreño, Vichada (otro proyecto institucional distinto, sin relación con este bot).
