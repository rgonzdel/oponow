// Ampliación del temario de TAI más allá de la Constitución (Bloque I,
// tema 1) ya sembrada en content/ce-titulos-2-10.ts. Numeración y títulos
// oficiales del Anexo V de la Resolución de 18 de diciembre de 2025
// (BOE-A-2025-26262, BOE núm. 306), texto administrativo de dominio
// público. Redacción propia.
//
// Nota: los 11 temas ya sembrados (Tema 1 a Tema 11) desarrollan en
// profundidad la Constitución Española, que en el Anexo V oficial es solo
// el primer epígrafe combinado del Bloque I (junto con la Corona) — no
// hay conflicto de numeración porque estos temas nuevos cubren los
// Bloques II a IV, terreno no tocado todavía.

export const TAI_BLOQUE2_TEMA1_INFORMATICA_BASICA = `## Elementos de un sistema de información
Un sistema de información combina hardware, software, datos y personas para capturar, procesar, almacenar y distribuir información. Sus elementos constitutivos son la entrada (captura de datos), el procesamiento (transformación según reglas definidas), la salida (resultados), el almacenamiento y la retroalimentación (control sobre el propio proceso).

## Representación de la información
Internamente, toda la información se representa en binario (bits, agrupados en bytes de 8 bits). A partir del byte, las unidades de medida crecen en potencias de 1.024 en el uso tradicional (kilobyte, megabyte, gigabyte, terabyte) o de 1.000 en el Sistema Internacional estricto, de ahí la distinción entre KB/KiB y equivalentes que a veces genera confusión.

## Arquitectura de ordenadores
La arquitectura de Von Neumann, base de la mayoría de ordenadores actuales, describe un sistema con una unidad central de proceso (CPU, que integra la unidad de control y la unidad aritmético-lógica), memoria principal (donde conviven instrucciones y datos) y dispositivos de entrada/salida, todos comunicados por buses de datos, direcciones y control.

## Componentes internos de un equipo microinformático
La placa base interconecta todos los componentes: el procesador (CPU), la memoria RAM (volátil, memoria de trabajo), el almacenamiento no volátil (SSD o HDD), la fuente de alimentación y los buses de expansión (PCIe y similares) para tarjetas gráficas, de red u otras. El chipset de la placa base gestiona la comunicación entre CPU, memoria y periféricos.`;

export const TAI_BLOQUE2_TEMA4_SISTEMAS_OPERATIVOS = `## Características y elementos constitutivos
Un sistema operativo es el software que gestiona los recursos hardware de un equipo y ofrece servicios a las aplicaciones. Sus elementos principales son el núcleo o kernel (gestión de procesos, memoria y dispositivos), el sistema de archivos (organización del almacenamiento) y la interfaz de usuario (línea de comandos o gráfica).

## Sistemas Windows
Windows es el sistema operativo propietario de Microsoft, con interfaz gráfica como paradigma principal desde sus inicios. Organiza el almacenamiento en unidades (C:, D:...) y carpetas, gestiona los permisos mediante cuentas de usuario y grupos, y su registro (Registro de Windows) centraliza la configuración del sistema y las aplicaciones instaladas.

## Sistemas Unix y Linux
Unix es la familia de sistemas operativos que originó conceptos hoy universales: sistema de archivos jerárquico único (todo cuelga de la raíz "/"), permisos de lectura/escritura/ejecución por usuario-grupo-otros, y el principio de que "todo es un fichero" (incluidos los dispositivos). Linux es un núcleo de tipo Unix, de código abierto, sobre el que se construyen distribuciones (Ubuntu, Red Hat, Debian) que añaden gestores de paquetes y entornos de escritorio.

## Sistemas operativos para dispositivos móviles
Android (basado en el núcleo Linux) e iOS son los sistemas dominantes en dispositivos móviles. Ambos aplican un modelo de aplicaciones en espacios aislados (sandboxing) con permisos concedidos explícitamente por la persona usuaria, y una gestión de energía más agresiva que los sistemas de escritorio.`;

export const TAI_BLOQUE3_TEMA2_LENGUAJES_PROGRAMACION = `## Representación de tipos de datos
Todo lenguaje de programación define tipos de datos básicos: enteros, de coma flotante (números decimales), caracteres, cadenas de texto y booleanos (verdadero/falso). Los lenguajes con tipado estático (como Java o C) exigen declarar el tipo de cada variable en tiempo de compilación; los de tipado dinámico (como Python o JavaScript) lo infieren en tiempo de ejecución.

## Operadores y estructuras de control
Los operadores aritméticos (+, -, *, /), relacionales (==, <, >) y lógicos (AND, OR, NOT) permiten construir expresiones. Las instrucciones condicionales (if/else, switch) ejecutan un bloque u otro según se cumpla o no una condición. Los bucles (for, while) repiten un bloque de instrucciones mientras se cumpla una condición o para cada elemento de una colección.

## Recursividad
Una función es recursiva cuando se llama a sí misma para resolver un problema dividiéndolo en subproblemas más pequeños del mismo tipo, hasta llegar a un caso base que se resuelve directamente sin más llamadas. Es una alternativa elegante a los bucles para problemas con estructura naturalmente recursiva (recorrer un árbol, calcular un factorial), aunque un mal diseño puede agotar la pila de llamadas.

## Procedimientos, funciones, parámetros y estructura de un programa
Un procedimiento o función agrupa instrucciones reutilizables bajo un nombre, opcionalmente recibiendo parámetros de entrada y devolviendo un resultado. Los vectores (arrays) almacenan colecciones de elementos del mismo tipo accesibles por índice; los registros (structs o similares) agrupan campos de distinto tipo bajo un mismo nombre. Un programa típico se estructura en declaración de variables, definición de funciones y un punto de entrada principal que las orquesta.`;

export const TAI_BLOQUE3_TEMA7_APLICACIONES_WEB = `## Desarrollo web front-end y en servidor
El front-end es la parte de una aplicación web que se ejecuta en el navegador de la persona usuaria (interfaz, interacción); el back-end o desarrollo en servidor procesa la lógica de negocio y el acceso a datos, devolviendo respuestas al navegador. Una aplicación web moderna combina ambos, comunicados típicamente mediante peticiones HTTP a una API.

## HTML, XML y sus derivaciones
HTML (HyperText Markup Language) estructura el contenido de una página web mediante etiquetas (elementos) anidadas: encabezados, párrafos, enlaces, imágenes, formularios. XML (eXtensible Markup Language) es un metalenguaje de marcado más general, usado para intercambiar datos estructurados entre sistemas; XHTML fue un intento de reformular HTML siguiendo las reglas estrictas de XML.

## Navegadores y lenguajes de programación web
El navegador interpreta HTML (estructura), CSS (presentación) y JavaScript (comportamiento/interactividad) para renderizar la página. En el lado servidor, lenguajes como PHP, Python, Java o Node.js (JavaScript en servidor) procesan las peticiones y generan las respuestas, a menudo a través de un framework que estandariza rutas, plantillas y acceso a datos.

## Lenguajes de script
Un lenguaje de script se ejecuta de forma interpretada (sin compilación previa a código máquina) y suele emplearse para automatizar tareas o añadir comportamiento dinámico. JavaScript en el navegador y en Node.js, Python o los scripts de shell (Bash, PowerShell) son ejemplos habituales en el trabajo diario de administración de sistemas.`;

export const TAI_BLOQUE4_TEMA5_SEGURIDAD_SISTEMAS = `## Seguridad física y lógica
La seguridad física protege los equipos y el acceso a ellos (control de acceso a un CPD, protección ante incendios o cortes de suministro); la seguridad lógica protege la información y los sistemas mediante mecanismos software: autenticación, cifrado, control de acceso a ficheros y aplicaciones.

## Amenazas y vulnerabilidades
Una vulnerabilidad es una debilidad de un sistema que puede ser explotada; una amenaza es cualquier circunstancia con potencial de causar daño aprovechando esa vulnerabilidad. Las amenazas más comunes incluyen malware, ingeniería social (phishing), ataques de denegación de servicio y explotación de software desactualizado o mal configurado.

## Técnicas criptográficas y protocolos seguros
El cifrado simétrico usa la misma clave para cifrar y descifrar (rápido, pero requiere compartir la clave de forma segura); el asimétrico usa un par de claves pública/privada (la pública cifra, solo la privada correspondiente descifra), más lento pero resuelve el problema del intercambio de claves. Protocolos como TLS (que da la "S" a HTTPS) combinan ambos: asimétrico para el intercambio inicial de claves, simétrico para el resto de la comunicación por rendimiento.

## Firma digital e infraestructura de un CPD
La firma digital usa la clave privada de quien firma para generar un sello verificable con su clave pública, garantizando autenticidad e integridad del documento firmado. Un centro de proceso de datos (CPD) requiere climatización adecuada, sistemas de alimentación ininterrumpida (SAI), extinción de incendios específica para equipos electrónicos y sistemas de gestión de incidencias que registren y escalen cualquier anomalía detectada.`;

export const TAI_BLOQUE4_TEMA7_TCPIP_OSI = `## El modelo OSI
El modelo de referencia OSI (Open Systems Interconnection) de ISO divide la comunicación en redes en 7 capas: física (transmisión de bits), enlace (tramas, direccionamiento físico), red (direccionamiento lógico y enrutamiento), transporte (comunicación extremo a extremo, fiabilidad), sesión (gestión de diálogos), presentación (formato/cifrado de datos) y aplicación (servicios a los programas de usuario final).

## El modelo TCP/IP
El modelo TCP/IP, base real de Internet, simplifica el esquema OSI en 4 capas: acceso a red (equivalente a física+enlace), internet (equivalente a red, protocolo IP), transporte (TCP/UDP) y aplicación (equivalente a sesión+presentación+aplicación de OSI). Es el modelo que efectivamente implementan los sistemas operativos y dispositivos de red actuales.

## Protocolos TCP y UDP
TCP (Transmission Control Protocol) es orientado a conexión: garantiza entrega ordenada y sin pérdidas mediante confirmaciones y retransmisiones, a costa de más sobrecarga — adecuado para navegación web o correo. UDP (User Datagram Protocol) no garantiza entrega ni orden, pero es más ligero y rápido — adecuado para streaming o videollamadas, donde perder algún paquete es preferible a introducir retrasos.

## Direccionamiento IP
Cada dispositivo en una red IP tiene una dirección que lo identifica: IPv4 usa 32 bits (formato decimal con puntos, ej. 192.168.1.1, con un espacio de direcciones ya agotado a nivel global) e IPv6 usa 128 bits para resolver ese agotamiento. La máscara de subred determina qué parte de la dirección identifica la red y cuál el equipo dentro de ella.`;
