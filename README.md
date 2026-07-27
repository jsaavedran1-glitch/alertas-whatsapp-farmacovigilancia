# Alertas WhatsApp - Farmacovigilancia HDV

Bot de Google Apps Script que envía una alerta automática por **WhatsApp** (vía [Green-API](https://green-api.com/en/)) y por **correo electrónico** cada vez que se registra un nuevo caso en el formulario Google "REPORTE FARMACOVIGILANCIA FOREAM", del Programa de Farmacovigilancia del Hospital Departamental de Villavicencio E.S.E.

Es el proyecto análogo a "Bot Tecnovigilancia", reutilizando la misma instancia de Green-API pero con **Script Properties completamente independientes**.

## Arquitectura

- **Tipo de proyecto:** Google Apps Script *container-bound*, vinculado a la hoja de cálculo de respuestas del formulario "REPORTE FARMACOVIGILANCIA FOREAM".
- **Disparador (trigger):** instalable, tipo `On form submit` ("Al enviar el formulario"), apuntando a `notificarNuevaRespuesta(e)`.
- **Canal WhatsApp:** [Green-API](https://green-api.com/en/), instancia compartida `710722693364` con el bot de Tecnovigilancia (cada proyecto tiene su propio Script Properties, así que no hay colisión de configuración pese a compartir instancia).
- **Canal correo:** `MailApp.sendEmail` a los destinatarios institucionales fijos en el código.

## Archivos

| Archivo | Descripción |
|---|---|
| `Codigo.gs` | Lógica completa del bot: construcción del mensaje, envío WhatsApp, envío de correo, utilidades de prueba. |
| `appsscript.json` | Manifiesto del proyecto Apps Script (zona horaria, runtime V8). |
| `CLAUDE.md` | Reglas y contexto operativo para asistentes de IA que continúen este proyecto. |
| `CHANGELOG.md` | Historial de cambios. |
| `test/dry-run.js` | Script Node.js para probar la construcción del mensaje **sin** llamar a ninguna API real (sin credenciales, sin envíos). |

## Campos que incluye la alerta

1. Nombre del reportante
2. Profesión del reportante
3. Edad del paciente en el momento del Evento Adverso (Años/Meses/Días)
4. Diagnóstico del paciente
5. Medicamentos sospechosos junto a la vía de administración y frecuencia
6. Servicio donde ocurrió el evento adverso
7. Descripción/análisis del evento adverso

El mensaje de WhatsApp usa emojis (vía `String.fromCodePoint`, no caracteres literales, para evitar corrupción de codificación en editores) y **no incluye** enlace a la hoja de cálculo.

## Configuración necesaria (Script Properties)

En el proyecto de Apps Script, ir a **Configuración del proyecto → Propiedades de las secuencias de comandos** y definir:

| Propiedad | Descripción | Ejemplo |
|---|---|---|
| `GREENAPI_ID_INSTANCE` | ID de instancia de Green-API | `710722693364` |
| `GREENAPI_API_TOKEN` | Token de la instancia | *(secreto, no versionar)* |
| `GREENAPI_API_URL` | URL base de la API de esa instancia | `https://7107.api.greenapi.com` |
| `GREENAPI_GROUP_CHATID` | chatId del grupo de WhatsApp destino | `120363426937928040@g.us` (Nuevo SF-HDV-SyD-InterSalud) |
| `GREENAPI_BOT_LABEL` | Firma que antecede el mensaje | `Bot Farmacovigilancia HDV` |

**Nunca** se deben hardcodear estas credenciales en el código: todo se lee vía `PropertiesService.getScriptProperties()`.

## Disparador (trigger)

En el editor de Apps Script → ícono de reloj (Activadores) → Agregar activador:

- Función: `notificarNuevaRespuesta`
- Fuente del evento: Desde la hoja de cálculo
- Tipo de evento: Al enviar el formulario

## Funciones de utilidad / prueba

| Función | Uso | ¿Envía mensajes reales? |
|---|---|---|
| `listarChatsGreenAPI()` | Lista los chats/grupos visibles para la instancia (para obtener chatIds) | No, solo lectura |
| `testConstruccionMensaje()` | Construye el mensaje con datos ficticios y lo muestra en el log | No |
| `eventoDePrueba()` | Datos ficticios de ejemplo | No |
| `enviarEjemploAlGrupo()` | Envía el mensaje de ejemplo ficticio al grupo configurado | Sí |
| `eventoCaso1()`, `eventoCaso5()`, `eventoCaso7()` | Datos reales de casos históricos (usados para pruebas) | No |
| `enviarCasosReales()` | Envía los 3 casos reales anteriores al grupo configurado | Sí |

Antes de ejecutar cualquier función marcada como "Sí" en la columna de envío, confirmar en `GREENAPI_GROUP_CHATID` que el chatId apunta al grupo de pruebas ("PRUEBA BOT") y no al grupo de producción.

## Pruebas locales sin credenciales

```
node test/dry-run.js
```

Este script reconstruye la lógica de `construirMensajeDesdeEvento` en Node.js puro (sin `UrlFetchApp` ni `PropertiesService`) para verificar el formato del mensaje antes de tocar el proyecto de Apps Script.

## Marco regulatorio de referencia

Resolución 4816 de 2008 (Farmacovigilancia/Tecnovigilancia), algoritmo OMS-UMC de causalidad, Resolución 3100 de 2019 — aplicable al programa institucional de Farmacovigilancia del HDV E.S.E.

