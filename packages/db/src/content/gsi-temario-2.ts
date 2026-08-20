// Ampliación del temario de Gestión de Sistemas e Informática (GSI) —
// mismo criterio y fuente que content/gsi-temario.ts (BOE-A-2025-26906,
// Anexo III, texto administrativo de dominio público). Redacción propia.

export const GSI_TEMA4_BLOQUE1 = `## Identificación y firma electrónica: marco normativo
La identificación y la firma electrónica permiten acreditar la identidad de una persona o la autenticidad e integridad de un documento en el ámbito digital. El Reglamento eIDAS (y su revisión eIDAS 2.0) es el marco europeo que armoniza estos servicios entre los Estados miembros, distinguiendo entre firma electrónica simple, avanzada y cualificada según su nivel de garantía jurídica.

## Certificados digitales y claves
Un certificado digital vincula una clave pública con la identidad de su titular, emitido y garantizado por una autoridad de certificación. La infraestructura de clave pública (PKI) es el conjunto de hardware, software, políticas y procedimientos necesarios para crear, gestionar, distribuir y revocar estos certificados. Las claves pueden ser privadas (solo las conoce el titular, usadas para firmar), públicas (distribuidas libremente, usadas para verificar) o concertadas (acordadas entre las partes para un intercambio puntual).

## Formatos de firma y protocolos de directorio
Los formatos de firma electrónica más habituales en el ámbito público son XAdES (sobre XML), CAdES (sobre CMS/binario) y PAdES (sobre PDF), cada uno con distintos niveles de longevidad y validación. Los protocolos de directorio como LDAP (Lightweight Directory Access Protocol) y el estándar X.500 permiten consultar y gestionar de forma centralizada información de identidad (usuarios, certificados, permisos) en una organización.

## Mecanismos de identificación
El DNI electrónico incorpora un chip con certificados digitales para identificación y firma. Las "Smart Cards" son tarjetas con circuito integrado usadas para autenticación fuerte. Los mecanismos biométricos (huella, reconocimiento facial) identifican a la persona por rasgos físicos únicos. El European Digital Identity Wallet es la iniciativa europea para una cartera digital única que permita identificarse y compartir credenciales de forma segura en toda la UE.`;

export const GSI_TEMA9_BLOQUE1 = `## Técnicas de diseño de software
El diseño de software moderno se apoya en principios como la modularidad (dividir el sistema en componentes independientes), el bajo acoplamiento (minimizar las dependencias entre módulos) y la alta cohesión (que cada módulo tenga una responsabilidad clara y bien delimitada). Los patrones de diseño recogen soluciones probadas a problemas recurrentes de arquitectura software.

## DevOps
DevOps es una cultura y conjunto de prácticas que integran el desarrollo de software (Dev) y las operaciones de sistemas (Ops), buscando ciclos de entrega más cortos, frecuentes y fiables. Se apoya en la automatización de todo el ciclo de vida: integración, pruebas, despliegue y monitorización.

## Git y control de versiones
Git es el sistema de control de versiones distribuido más usado: cada copia local del repositorio contiene el historial completo de cambios, permitiendo trabajar sin conexión y fusionar el trabajo de varias personas mediante ramas (branches) que después se integran (merge). Plataformas como GitLab o GitHub añaden sobre Git funciones de colaboración: revisión de código, gestión de incidencias y automatización.

## CI/CD, contenedores y microservicios
La integración continua (CI) automatiza la compilación y las pruebas cada vez que se sube código nuevo, detectando errores pronto. El despliegue continuo (CD) automatiza además la publicación de esos cambios en producción. Los contenedores (Docker y similares) empaquetan una aplicación con todas sus dependencias en una unidad ligera y portable entre entornos. Una arquitectura de microservicios divide una aplicación en servicios pequeños e independientes que se comunican entre sí, frente al enfoque monolítico tradicional — facilita escalar y desplegar cada parte por separado, a cambio de mayor complejidad operativa.`;
