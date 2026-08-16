export interface LegalSeccion {
  titulo: string;
  parrafos: string[];
}

export interface LegalPagina {
  slug: string;
  titulo: string;
  secciones: LegalSeccion[];
}

// Borrador genérico — pendiente de revisión por un abogado antes de darlo
// por definitivo. Los datos identificativos entre [corchetes] hay que
// rellenarlos con los reales del titular antes de publicar.
export const LEGAL_PAGINAS: Record<string, LegalPagina> = {
  "aviso-legal": {
    slug: "aviso-legal",
    titulo: "Aviso legal",
    secciones: [
      {
        titulo: "1. Datos identificativos",
        parrafos: [
          "En cumplimiento del deber de información recogido en el artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos: este sitio web (oponow.com) es titularidad de [Razón social / nombre del titular pendiente], con NIF [pendiente] y domicilio en [pendiente]. Para cualquier consulta puede escribirse a [email de contacto pendiente].",
        ],
      },
      {
        titulo: "2. Objeto",
        parrafos: [
          "Oponow es una plataforma online de preparación de oposiciones que ofrece temario digital y bancos de tests basados en exámenes oficiales de convocatorias públicas.",
          "El acceso y uso de este sitio web atribuye la condición de usuario e implica la aceptación de las condiciones incluidas en este Aviso Legal, en la Política de Privacidad, en la Política de Cookies y en los Términos y Condiciones.",
        ],
      },
      {
        titulo: "3. Propiedad intelectual e industrial",
        parrafos: [
          "El diseño de la plataforma, los textos, marcas, logotipos y demás elementos gráficos de Oponow, así como el resumen, estructura y presentación del temario, son propiedad de Oponow o de sus licenciantes, salvo cuando se indique lo contrario.",
          "El contenido de las preguntas de test se basa en exámenes de convocatorias oficiales publicadas por los organismos correspondientes. Oponow no reclama la titularidad de dichas convocatorias oficiales; su reproducción se realiza al amparo del carácter de dominio público o uso permitido de los documentos administrativos de acceso público, con fines exclusivamente educativos.",
          "Queda prohibida la reproducción, distribución o comunicación pública total o parcial de los contenidos de esta plataforma sin autorización expresa, salvo para el uso personal del usuario suscrito.",
        ],
      },
      {
        titulo: "4. Exclusión de responsabilidad",
        parrafos: [
          "El contenido de Oponow tiene carácter divulgativo y de apoyo al estudio. No constituye una fuente oficial: la convocatoria, las bases y el temario vigentes publicados en el BOE (o boletín autonómico correspondiente) prevalecen siempre sobre cualquier resumen o adaptación disponible en esta plataforma.",
          "Oponow no garantiza la ausencia de errores en los contenidos ni el resultado de ningún proceso selectivo, y no se hace responsable de las decisiones que el usuario tome basándose exclusivamente en el contenido de la plataforma.",
        ],
      },
    ],
  },
  privacidad: {
    slug: "privacidad",
    titulo: "Política de privacidad",
    secciones: [
      {
        titulo: "1. Responsable del tratamiento",
        parrafos: [
          "[Razón social / nombre del titular pendiente], con NIF [pendiente] y domicilio en [pendiente], es el responsable del tratamiento de los datos personales recogidos a través de oponow.com. Contacto: [email de contacto pendiente].",
        ],
      },
      {
        titulo: "2. Datos que recogemos",
        parrafos: [
          "Datos de cuenta: correo electrónico y contraseña (almacenada siempre cifrada, nunca en texto plano).",
          "Datos de uso: intentos de test, respuestas, progreso por tema y, si el usuario los crea, las tareas de su agenda de estudio.",
          "Datos de facturación: en caso de suscripción de pago, los datos necesarios para procesar el cobro se gestionan a través de la pasarela de pago correspondiente; Oponow no almacena el número completo de la tarjeta.",
          "Datos técnicos: dirección IP y marca de tiempo de acceso al contenido del temario, con fines de prevención de fraude y de uso indebido del contenido (ver Términos y Condiciones).",
        ],
      },
      {
        titulo: "3. Finalidad y base legal",
        parrafos: [
          "Prestar el servicio (crear la cuenta, mostrar el temario y los tests según el plan contratado, gestionar la suscripción): ejecución de un contrato (art. 6.1.b RGPD).",
          "Prevenir el acceso o la redistribución no autorizada del contenido de pago: interés legítimo (art. 6.1.f RGPD).",
          "Enviar comunicaciones relacionadas con el servicio (confirmaciones, avisos de la cuenta): ejecución del contrato o interés legítimo, según el caso.",
        ],
      },
      {
        titulo: "4. Conservación",
        parrafos: [
          "Los datos de la cuenta se conservan mientras el usuario mantenga su cuenta activa. Tras solicitar la baja, se conservarán únicamente durante el plazo exigido por la normativa aplicable (por ejemplo, obligaciones fiscales sobre las facturas emitidas) y después se eliminarán o anonimizarán.",
        ],
      },
      {
        titulo: "5. Destinatarios",
        parrafos: [
          "Los datos no se ceden a terceros salvo obligación legal. Se comparten los estrictamente necesarios con proveedores que actúan como encargados del tratamiento (por ejemplo, la pasarela de pago o el proveedor de alojamiento en la nube), bajo contrato de encargo conforme al artículo 28 RGPD.",
        ],
      },
      {
        titulo: "6. Derechos de la persona usuaria",
        parrafos: [
          "Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo a [email de contacto pendiente], indicando el derecho que deseas ejercer y adjuntando copia de un documento que acredite tu identidad.",
          "También tienes derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) si consideras que el tratamiento no se ajusta a la normativa vigente.",
        ],
      },
    ],
  },
  cookies: {
    slug: "cookies",
    titulo: "Política de cookies",
    secciones: [
      {
        titulo: "1. Qué son las cookies",
        parrafos: [
          "Las cookies son pequeños archivos que un sitio web guarda en el navegador del usuario. Oponow utiliza un enfoque minimalista: no usa cookies de publicidad ni de seguimiento de terceros.",
        ],
      },
      {
        titulo: "2. Cookies que utilizamos",
        parrafos: [
          "Cookie técnica de sesión (httpOnly): guarda el token necesario para mantener tu sesión iniciada. Es estrictamente necesaria para el funcionamiento del servicio (permitirte acceder a tu cuenta) y no requiere consentimiento según el artículo 22.2 LSSI-CE, al ser exclusivamente técnica.",
          "No se utilizan cookies de análisis ni de publicidad en el momento de publicación de esta política. Si en el futuro se incorporan, se actualizará este texto y se solicitará el consentimiento correspondiente antes de instalarlas.",
        ],
      },
      {
        titulo: "3. Cómo desactivar las cookies",
        parrafos: [
          "Puedes configurar tu navegador para bloquear o eliminar las cookies. Ten en cuenta que, al ser la cookie de sesión estrictamente necesaria, bloquearla impedirá mantener la sesión iniciada en la plataforma.",
        ],
      },
    ],
  },
  terminos: {
    slug: "terminos",
    titulo: "Términos y condiciones",
    secciones: [
      {
        titulo: "1. Objeto del servicio",
        parrafos: [
          "Oponow ofrece acceso a temario digital y a un banco de tests de práctica para la preparación de oposiciones. Existe un nivel de acceso gratuito limitado (un tema por oposición y un test diario) y un plan de pago único con acceso completo al temario y tests ilimitados de la oposición elegida.",
        ],
      },
      {
        titulo: "2. Registro y cuenta",
        parrafos: [
          "Para usar Oponow es necesario crear una cuenta con un correo electrónico válido. El usuario es responsable de mantener la confidencialidad de su contraseña y de toda actividad realizada desde su cuenta.",
        ],
      },
      {
        titulo: "3. Suscripción, prueba gratuita y cancelación",
        parrafos: [
          "La suscripción de pago incluye un periodo de prueba gratuito (actualmente 7 días) durante el cual el usuario puede cancelar sin coste alguno. Pasado ese periodo, se cobrará automáticamente el importe correspondiente al ciclo elegido (mensual o anual) hasta que el usuario cancele.",
          "El usuario puede cancelar su suscripción en cualquier momento desde su cuenta; la cancelación surtirá efecto al final del periodo ya pagado, sin penalización ni permanencia.",
        ],
      },
      {
        titulo: "4. Uso permitido del contenido",
        parrafos: [
          "El acceso al temario y a los tests es personal e intransferible. Queda prohibido descargar, capturar, redistribuir o compartir el contenido de pago con terceros no suscritos.",
          "Para proteger el contenido, Oponow registra internamente (email y dirección IP) el acceso a cada bloque de temario. Este registro se usa únicamente como evidencia interna ante un uso indebido detectado, conforme a lo descrito en la Política de Privacidad.",
        ],
      },
      {
        titulo: "5. Naturaleza del contenido",
        parrafos: [
          "El temario y las preguntas de Oponow son un material de apoyo al estudio, no un sustituto de las bases oficiales de la convocatoria ni del BOE. Es responsabilidad del usuario consultar siempre la convocatoria vigente publicada por el organismo correspondiente.",
        ],
      },
      {
        titulo: "6. Modificación de estos términos",
        parrafos: [
          "Oponow podrá actualizar estos términos para reflejar cambios en el servicio o en la normativa aplicable. Los cambios sustanciales se notificarán a los usuarios registrados con antelación razonable.",
        ],
      },
    ],
  },
};
