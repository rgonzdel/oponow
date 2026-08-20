// Segundo bloque de contenido para los 5 temas de Correos ya sembrados
// (ver content/correos-temario.ts), ampliando cada uno con subtemas
// complementarios que no se solapan con el primer bloque. Mismo criterio
// de fuentes (estructura reconstruida de fuentes públicas consistentes, no
// un anexo BOE literal — Correos es una sociedad estatal, no un cuerpo de
// la AGE) y redacción propia que el resto de content/*.ts de este proyecto.

export const CORREOS_TEMA1_PARTE2 = `## Obligaciones del servicio postal universal
Como operador designado, Correos está obligado a garantizar una recogida y un reparto con una frecuencia mínima en todos los días laborables de la semana, salvo circunstancias excepcionales, en la totalidad del territorio nacional, incluidas las zonas rurales, de baja densidad de población y los territorios insulares. Esta obligación de cobertura universal, junto con las tarifas asequibles y uniformes para el servicio postal básico, es lo que justifica que Correos reciba, en determinados casos, financiación pública compensatoria por el coste neto de prestar un servicio que, en las zonas menos rentables, no sería económicamente viable para un operador puramente privado.

## Embalaje y etiquetado de los envíos
Un embalaje adecuado protege el contenido durante todo el proceso de clasificación y transporte, que incluye manipulación mecánica y varios traslados entre centros. El etiquetado debe incluir con claridad la dirección completa del destinatario y, en la mayoría de envíos con seguimiento, un código de barras o QR que identifica de forma única el envío en el sistema informático de Correos, permitiendo registrar automáticamente su paso por cada punto de la cadena logística sin necesidad de introducir manualmente los datos en cada etapa.

## Envíos internacionales
Los envíos con destino fuera de España se someten, además de a la normativa postal, a los trámites aduaneros del país de destino cuando corresponde (típicamente para paquetería con valor declarado, no para correspondencia ordinaria). Correos coopera con las administraciones aduaneras y con la Unión Postal Universal (UPU), el organismo internacional que armoniza las normas del servicio postal entre sus países miembros, para asegurar la interoperabilidad de las redes postales de todo el mundo y unas reglas comunes mínimas de calidad de servicio.`;

export const CORREOS_TEMA2_PARTE2 = `## Seguimiento (tracking) de envíos
El seguimiento permite a remitente y destinatario conocer en cada momento la fase en la que se encuentra un envío: admisión, en tránsito entre centros, en reparto o entregado. Cada escaneo del código del envío en un punto de control (al recogerlo, al clasificarlo, al cargarlo en un vehículo, al entregarlo) genera automáticamente un evento visible en el sistema de seguimiento, accesible normalmente a través de la web o la aplicación móvil de Correos introduciendo el número de envío.

## Gestión de incidencias en el reparto
Cuando un envío no puede entregarse en el primer intento —por ausencia del destinatario, dirección incompleta o errónea, o rechazo del envío— el personal de reparto sigue un protocolo definido: dejar un aviso indicando cómo y dónde recoger el envío, reintentar la entrega en un momento posterior según la política vigente, o derivar el envío a un punto de conveniencia cercano para que el destinatario lo recoja cuando le resulte más cómodo. Si tras los intentos previstos el envío sigue sin poder entregarse, se devuelve al remitente.

## Tipos de contrato de transporte de paquetería
Los grandes clientes de comercio electrónico suelen operar bajo contratos específicos de paquetería, con condiciones de precio, plazos de recogida y niveles de servicio distintos de los de un envío ocasional realizado en oficina. Estos contratos incluyen habitualmente acuerdos de nivel de servicio (SLA) que fijan compromisos concretos, como el plazo máximo de entrega o el porcentaje admisible de incidencias, y penalizaciones si el operador no los cumple.`;

export const CORREOS_TEMA5_PARTE2 = `## Centros de tratamiento automatizado
Un centro de tratamiento automatizado combina cintas transportadoras, lectores ópticos de caracteres (OCR) y sistemas de clasificación mecánica para dirigir cada envío hacia la salida correspondiente a su destino, procesando grandes volúmenes en poco tiempo. Los envíos cuya dirección la máquina no logra leer con suficiente fiabilidad —por letra manuscrita poco clara, etiquetas dañadas o direcciones incompletas— se derivan automáticamente a un puesto de clasificación manual, donde una persona operadora introduce o corrige los datos necesarios para completar el encaminamiento.

## Planificación de rutas de reparto
Cada unidad de reparto organiza su territorio en rutas o carteros, agrupando calles y portales de forma que la distancia y el tiempo recorridos sean lo más eficientes posible. La planificación de rutas tiene en cuenta el volumen habitual de envíos de cada zona, las franjas horarias en que es más probable encontrar al destinatario y, cada vez más, herramientas informáticas de optimización que recalculan el orden de entrega más eficiente según los envíos concretos del día.

## Trazabilidad y control de calidad del reparto
Cada escaneo que el personal de reparto realiza con su terminal móvil en el momento de la entrega —o de la incidencia, si no puede completarla— alimenta indicadores de calidad de servicio: porcentaje de entregas en primer intento, tiempo medio de tránsito desde la admisión hasta la entrega, o incidencias por zona. Estos indicadores permiten detectar rutas o centros con peor desempeño y priorizar allí las mejoras operativas.`;

export const CORREOS_TEMA10_PARTE2 = `## El secreto de las comunicaciones postales
El artículo 18.3 de la Constitución garantiza el secreto de las comunicaciones, salvo resolución judicial, y ese principio se proyecta directamente sobre la correspondencia postal: ningún envío puede abrirse, interceptarse o inspeccionarse en su contenido salvo en los supuestos y con las garantías que fija la ley (por ejemplo, una investigación judicial autorizada). El personal de Correos que en el ejercicio de sus funciones accede a información sobre remitentes, destinatarios o contenido de los envíos está sujeto a un deber de confidencialidad reforzado por esta garantía constitucional.

## Supervisión del sector postal
La Comisión Nacional de los Mercados y la Competencia (CNMC) supervisa el sector postal español: vigila que las tarifas del servicio postal universal sean asequibles y no discriminatorias, resuelve conflictos entre operadores postales y entre estos y las personas usuarias, y vela por el cumplimiento de las condiciones bajo las que se presta el servicio universal. Cualquier persona usuaria que no vea resuelta satisfactoriamente una reclamación ante el propio operador postal puede acudir después a la CNMC.

## Responsabilidad del operador postal
El operador postal responde ante el remitente o el destinatario por la pérdida, el robo, el deterioro o el retraso injustificado de un envío, con límites de indemnización que varían según la modalidad contratada: un envío ordinario tiene una cobertura mínima, mientras que un envío certificado o asegurado permite reclamar una indemnización mayor, proporcional al valor declarado o a las tarifas establecidas para cada modalidad, siempre que la reclamación se presente dentro del plazo que fija la normativa aplicable.`;

export const CORREOS_TEMA11_PARTE2 = `## Vigilancia de la salud y reconocimientos médicos
La Ley de Prevención de Riesgos Laborales obliga a la empresa a garantizar a su plantilla una vigilancia periódica de su estado de salud en función de los riesgos inherentes a su puesto, con carácter voluntario para la persona trabajadora salvo excepciones tasadas (como cuando el reconocimiento es imprescindible para evaluar los efectos de las condiciones de trabajo sobre la salud, o para verificar que el estado de salud no constituye un peligro para el propio trabajador, para terceros o para otras personas relacionadas con la empresa).

## Señalización y equipos de protección
La señalización de seguridad advierte de riesgos, prohibiciones u obligaciones mediante formas y colores normalizados: el rojo para prohibición o material de lucha contra incendios, el amarillo para advertencia de peligro, el azul para obligación (como el uso obligatorio de un equipo de protección concreto) y el verde para salvamento o situación de seguridad. Los equipos de protección individual (EPI) —guantes, calzado de seguridad, chaleco reflectante en reparto motorizado o a pie— deben usarse siempre que el puesto lo exija, y la empresa está obligada a proporcionarlos de forma gratuita y a formar sobre su uso correcto.

## Delegados de prevención y comités de seguridad
La representación de los trabajadores en materia de prevención se canaliza a través de los delegados de prevención, elegidos entre y por los propios representantes del personal, que vigilan el cumplimiento de la normativa preventiva y pueden proponer mejoras. En empresas con un número suficiente de personas trabajadoras se constituye además un comité de seguridad y salud, órgano paritario (representantes de la empresa y de la plantilla a partes iguales) que participa periódicamente en la planificación y el seguimiento de la actividad preventiva.`;
