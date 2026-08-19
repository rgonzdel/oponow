// Contenido original para el Cuerpo de Gestión de Sistemas e Informática de
// la Administración del Estado (B/GSI). El temario oficial (numeración y
// epígrafes) procede del punto 6 ("Programa") del Anexo III de la
// Resolución de 23 de diciembre de 2025 de la Secretaría de Estado de
// Función Pública (BOE-A-2025-26906, BOE núm. 313), texto administrativo
// de dominio público. La redacción de cada bloque es propia.

export const GSI_TEMA1_BLOQUE1 = `## Los contratos del sector público: marco normativo
La contratación de las Administraciones Públicas se rige por la Ley 9/2017, de Contratos del Sector Público (LCSP), que traspone al ordenamiento español las directivas europeas sobre contratación pública. Sus principios comunes son la libertad de acceso a las licitaciones, la publicidad y transparencia de los procedimientos, la no discriminación e igualdad de trato entre candidatos, y la salvaguarda de la libre competencia, todo ello orientado a una eficiente utilización de los fondos públicos.

## Requisitos para contratar con la Administración
Para poder contratar con el sector público, una empresa o profesional debe tener personalidad jurídica y, en su caso, capacidad de obrar; no estar incurso en ninguna prohibición de contratar (por ejemplo, haber sido condenado por determinados delitos, o estar en concurso de acreedores); acreditar solvencia económica, financiera y técnica o profesional adecuada al objeto del contrato (o, en los casos que exige la ley, estar clasificado); y, cuando el contrato lo exija, disponer de la habilitación empresarial o profesional necesaria.

## Procedimientos de contratación
La LCSP regula varios procedimientos de adjudicación: el abierto (cualquier empresario interesado puede presentar proposición, es el procedimiento ordinario), el restringido (solo pueden presentar proposición los empresarios seleccionados previamente por la Administración), el negociado (los términos del contrato se negocian con uno o varios candidatos, reservado a supuestos tasados por la ley) y el diálogo competitivo (para contratos especialmente complejos, donde la Administración dialoga con los candidatos para definir la solución que mejor satisface sus necesidades antes de invitar a presentar oferta).

## Tipos de contratos
Los contratos administrativos típicos son de obras (ejecución o reforma de una obra), de suministro (adquisición, arrendamiento o leasing de bienes muebles, incluidos equipos y licencias informáticas), de servicios (prestaciones de hacer distintas de las de obra o suministro, como el desarrollo o mantenimiento de software) y de concesión (de obras o de servicios), en los que el contratista asume el riesgo operacional de la explotación.`;

export const GSI_TEMA5_BLOQUE1 = `## Ciberseguridad: conceptos generales
La ciberseguridad es el conjunto de medidas técnicas, organizativas y legales orientadas a proteger los sistemas de información frente a amenazas que comprometan su confidencialidad, integridad o disponibilidad —las tres propiedades clásicas conocidas como la tríada CID—. En el ámbito de la Administración Pública, se rige por el Esquema Nacional de Seguridad (ENS), que fija los principios básicos y requisitos mínimos que deben cumplir los sistemas que tratan información de las Administraciones.

## Seguridad en el nivel de aplicación
Las aplicaciones web son uno de los vectores de ataque más habituales. Entre las vulnerabilidades más frecuentes están la inyección de código (SQL injection: manipular una consulta a base de datos insertando código malicioso en un campo de entrada mal validado), el Cross-Site Scripting o XSS (inyectar scripts que se ejecutan en el navegador de otro usuario) y el Cross-Site Request Forgery o CSRF (forzar a un usuario autenticado a ejecutar acciones no deseadas). La defensa pasa por validar y depurar toda entrada de datos, usar consultas parametrizadas, aplicar el principio de mínimo privilegio y mantener actualizado el software.

## Tipos de ataques
Entre los más comunes: el phishing (suplantación de identidad, normalmente por correo electrónico, para obtener credenciales o datos); el malware (software malicioso: virus, gusanos, troyanos, ransomware que cifra los datos y exige un rescate); los ataques de denegación de servicio o DoS/DDoS (saturar un sistema para dejarlo inaccesible, distribuidos desde múltiples orígenes en el caso DDoS); y el ataque de fuerza bruta (probar sistemáticamente combinaciones de credenciales hasta acertar).

## La Estrategia Nacional de Ciberseguridad
Es el marco de referencia que fija los objetivos y líneas de acción del Estado español en la materia: proteger los sistemas de información y telecomunicaciones del sector público y las infraestructuras críticas, impulsar la seguridad y resiliencia de las redes, potenciar las capacidades de detección, respuesta y recuperación ante incidentes, y fomentar la cultura de ciberseguridad entre ciudadanos y organizaciones. Se coordina, entre otros organismos, con el CCN-CERT (Centro Criptológico Nacional) para el ámbito público y el INCIBE para el privado y la ciudadanía.`;

export const GSI_TEMA8_BLOQUE1 = `## Inteligencia artificial: concepto y clasificación
La inteligencia artificial (IA) es la disciplina que desarrolla sistemas capaces de realizar tareas que, hechas por una persona, requerirían inteligencia: percibir, razonar, aprender y decidir. Dentro de la IA, el machine learning (aprendizaje automático) engloba los algoritmos que aprenden patrones a partir de datos en lugar de seguir reglas programadas explícitamente. El deep learning (aprendizaje profundo) es un tipo de machine learning basado en redes neuronales con múltiples capas, especialmente eficaz en tareas como el reconocimiento de imágenes o el procesamiento de lenguaje.

## Campos de aplicación
El NLP o procesamiento de lenguaje natural permite a los sistemas entender y generar texto humano (traducción automática, asistentes conversacionales, resumen de documentos). La visión artificial permite interpretar imágenes y vídeo (reconocimiento facial, inspección automática). Los sistemas expertos codifican el conocimiento de una persona experta en un dominio concreto mediante reglas para apoyar la toma de decisiones. La robótica combina IA con actuadores físicos para que un sistema interactúe con el entorno. Los agentes inteligentes son sistemas que perciben su entorno y actúan sobre él de forma autónoma para lograr un objetivo.

## Aspectos éticos y marco normativo
El uso de IA plantea riesgos que la normativa busca mitigar: sesgos en los datos de entrenamiento que se trasladan a las decisiones del sistema, falta de transparencia en modelos complejos ("caja negra"), y el impacto sobre la privacidad y los derechos fundamentales. El Reglamento europeo de IA (Ley de IA) clasifica los sistemas por nivel de riesgo —inaceptable, alto, limitado y mínimo— y establece obligaciones crecientes según ese nivel, prohibiendo directamente los usos de riesgo inaceptable (como la puntuación social generalizada) y exigiendo requisitos estrictos de transparencia, supervisión humana y gestión de riesgos para los sistemas de alto riesgo.

## Casos de uso en las Administraciones Públicas
La IA se aplica ya en la AGE en asistentes conversacionales para atención ciudadana, herramientas de apoyo a la traducción y resumen de documentos, detección de fraude, y sistemas de ayuda a la decisión en procedimientos administrativos masivos —siempre, según exige la normativa, con supervisión humana efectiva en las decisiones que afecten a derechos de las personas.`;
