// Un bloque es un párrafo o una lista. Dentro del texto, [texto](url) se
// convierte en enlace y las URL sueltas (https://…) también (ver
// components/LegalDocumento.tsx).
export type LegalBloque = string | { lista: string[] };

export interface LegalSeccion {
  titulo: string;
  bloques: LegalBloque[];
}

export interface LegalPagina {
  slug: string;
  titulo: string;
  /** Una frase para <meta name="description"> en el HTML pre-renderizado. */
  descripcion: string;
  actualizado: string;
  secciones: LegalSeccion[];
}

// Datos del titular: los marcadores [NOMBRE], [NIF] y [DIRECCIÓN] hay que
// sustituirlos por los reales antes de dar los textos por definitivos.
const TITULAR = "[NOMBRE], con NIF [NIF] y domicilio en [DIRECCIÓN]";
const CONTACTO = "info@oponow.com";
const ACTUALIZADO = "7 de octubre de 2026";
const POLITICA_API_GOOGLE =
  "https://developers.google.com/terms/api-services-user-data-policy";

export const LEGAL_PAGINAS: Record<string, LegalPagina> = {
  privacidad: {
    slug: "privacidad",
    titulo: "Política de privacidad",
    descripcion:
      "Qué datos personales recoge Oponow, para qué los usa, qué datos obtiene de Google (inicio de sesión y Google Calendar), con quién los comparte, cuánto tiempo los conserva y cómo ejercer tus derechos.",
    actualizado: ACTUALIZADO,
    secciones: [
      {
        titulo: "1. Responsable del tratamiento",
        bloques: [
          `El responsable del tratamiento de los datos personales que se recogen a través de oponow.com y de la aplicación de Oponow es ${TITULAR}.`,
          `Para cualquier cuestión sobre privacidad o para ejercer tus derechos puedes escribir a ${CONTACTO}.`,
          "Oponow es una plataforma de preparación de oposiciones: temario digital, tests de práctica basados en exámenes oficiales y una agenda de estudio. Esta política explica qué datos personales tratamos para prestar ese servicio.",
        ],
      },
      {
        titulo: "2. Qué datos recogemos y de dónde",
        bloques: [
          "Solo recogemos los datos necesarios para que funcione el servicio. Los obtenemos de ti directamente, de Google si decides usar sus servicios con Oponow y de forma automática cuando usas la plataforma.",
          {
            lista: [
              "Datos de la cuenta: tu correo electrónico y tu contraseña. La contraseña nunca se guarda en claro: solo almacenamos una huella criptográfica (hash Argon2id) que no permite recuperarla.",
              "Inicio de sesión con Google (opcional): el identificador de tu cuenta de Google y tu correo electrónico, junto con la indicación de Google de si está verificado. Google también nos envía tu nombre y tu foto de perfil, pero no los guardamos. Más detalle en la sección «Datos obtenidos de Google».",
              "Verificación en dos pasos por correo: cuando inicias sesión con contraseña desde un navegador o dispositivo nuevo, te enviamos un código de 6 dígitos. Guardamos solo una huella criptográfica del código, su caducidad y el número de intentos. Si lo introduces correctamente, guardamos un identificador aleatorio de ese navegador o dispositivo (y el tipo de navegador que informa) para no volver a pedírtelo durante 30 días.",
              "Datos de sesión: identificadores de sesión (guardados solo como huella criptográfica), el tipo de navegador o dispositivo desde el que entras y las fechas de inicio y caducidad de la sesión.",
              "Datos de estudio: los tests que haces, las respuestas que eliges, si son correctas, tus puntuaciones y las fechas, para mostrarte tu progreso y repasar tus fallos.",
              "Agenda de estudio: las tareas que creas (título, descripción opcional, fecha y si están completadas).",
              "Google Calendar (opcional): si conectas tu calendario, los datos que se describen en la sección «Datos obtenidos de Google».",
              "Suscripción: el plan contratado, la oposición elegida, las fechas de inicio, fin y periodo de prueba, el estado de la suscripción y su identificador en la pasarela de pago. Oponow no guarda los datos de tu tarjeta.",
              "Registro de acceso al temario: cuando abres un bloque del temario de pago guardamos la fecha y hora, el bloque consultado, tu dirección IP y tu correo electrónico, para detectar y acreditar usos indebidos del contenido.",
              "Datos técnicos: como cualquier servicio web, nuestros proveedores de alojamiento registran de forma automática datos de las peticiones (dirección IP, fecha y hora, dirección solicitada y tipo de navegador) por motivos de seguridad y funcionamiento.",
            ],
          },
          "No recogemos categorías especiales de datos (salud, ideología, etc.), no usamos herramientas de analítica ni de publicidad y no elaboramos perfiles con fines comerciales.",
        ],
      },
      {
        titulo: "3. Para qué usamos tus datos y con qué base legal",
        bloques: [
          {
            lista: [
              "Crear y gestionar tu cuenta, permitirte iniciar sesión (con contraseña o con Google) y prestarte el servicio contratado (temario, tests, progreso y agenda). Base legal: ejecución del contrato que aceptas al registrarte (art. 6.1.b RGPD).",
              "Proteger tu cuenta con la verificación en dos pasos y mantener tus sesiones seguras. Base legal: ejecución del contrato e interés legítimo en la seguridad del servicio (art. 6.1.b y 6.1.f RGPD).",
              "Sincronizar tus tareas de estudio con Google Calendar, solo si lo activas tú. Base legal: tu consentimiento, que das al conectar el calendario y puedes retirar en cualquier momento (art. 6.1.a RGPD).",
              "Gestionar la suscripción y los cobros. Base legal: ejecución del contrato y cumplimiento de obligaciones legales, como las fiscales (art. 6.1.b y 6.1.c RGPD).",
              "Prevenir el fraude y la redistribución no autorizada del contenido de pago. Base legal: interés legítimo en proteger el contenido y el servicio (art. 6.1.f RGPD).",
              "Enviarte correos necesarios para el servicio, como los códigos de verificación y avisos sobre tu cuenta o tu suscripción. Base legal: ejecución del contrato. No te enviaremos comunicaciones comerciales sin tu consentimiento previo.",
            ],
          },
        ],
      },
      {
        titulo: "4. Datos obtenidos de Google",
        bloques: [
          "Oponow solo accede a datos de Google si tú decides usar alguna de estas dos funciones, que son opcionales: iniciar sesión con tu cuenta de Google y conectar Google Calendar a la agenda de estudio.",
          "Permisos (scopes) que solicita Oponow:",
          {
            lista: [
              "Inicio de sesión con Google: «openid», «email» y «profile». Nos permiten conocer el identificador de tu cuenta de Google, tu correo electrónico y si está verificado. Google incluye también tu nombre y tu foto de perfil, que Oponow no guarda.",
              "Google Calendar: «https://www.googleapis.com/auth/calendar.events», que permite ver y editar eventos de tus calendarios. Oponow solo lo usa sobre tu calendario principal y solo para lo que se describe a continuación. Este permiso solo se solicita si pulsas «Conectar Google Calendar» en la agenda.",
            ],
          },
          "Para qué usamos cada dato:",
          {
            lista: [
              "El identificador de tu cuenta de Google y tu correo sirven para crear tu cuenta de Oponow o para identificarte cuando vuelves a entrar. Si ya tenías una cuenta de Oponow con el mismo correo y Google confirma que está verificado, se vincula a esa cuenta.",
              "Con el permiso de Google Calendar, Oponow crea, actualiza y elimina en tu calendario principal los eventos que corresponden a las tareas de estudio que tú creas, modificas o borras en la agenda de Oponow.",
              "También lee los eventos de tu calendario principal en el rango de fechas que estás viendo (título, fecha y hora de inicio, si duran todo el día y, en los creados por Oponow, el identificador de la tarea) para mostrártelos junto a tus tareas. Esos eventos no se guardan en Oponow: se muestran y se descartan. Lo único que guardamos es el identificador del evento que corresponde a cada tarea creada por Oponow, para poder actualizarlo o borrarlo después.",
            ],
          },
          "Lo que no hacemos con los datos de Google: no los vendemos, no los usamos para publicidad ni para elaborar perfiles, no los usamos para desarrollar ni entrenar modelos de inteligencia artificial y no permitimos que ninguna persona los lea, salvo que nos des tu permiso expreso para un caso concreto (por ejemplo, para resolver una incidencia que nos plantees), cuando sea necesario por seguridad o cuando lo exija la ley.",
          "Con quién se comparten: con nadie, salvo con los proveedores que alojan la plataforma y su base de datos, que actúan como encargados del tratamiento y solo los tratan para prestarnos el servicio (ver la sección «Encargados del tratamiento y transferencias internacionales»), o cuando lo exija la ley.",
          "Cómo se guardan y protegen: el token de acceso a tu Google Calendar (refresh token) se guarda cifrado con AES-256-GCM, con una clave que solo conoce el servidor de Oponow. Los tokens de acceso temporales solo se mantienen en la memoria del servidor mientras son válidos (como máximo, una hora). Todas las comunicaciones con Google y con Oponow van cifradas (HTTPS) y la base de datos aplica controles de acceso por usuario.",
          "Cuánto tiempo se conservan: el identificador de tu cuenta de Google y tu correo, mientras tengas tu cuenta de Oponow. La conexión con Google Calendar (el token cifrado), hasta que la desconectes, revoques el acceso desde Google o elimines tu cuenta; si Google invalida el token, la conexión se borra automáticamente. Los identificadores de los eventos creados por Oponow, mientras exista la tarea correspondiente o tu cuenta.",
          "Cómo revocar el acceso y pedir el borrado:",
          {
            lista: [
              "Desde Oponow: en la agenda, pulsa «Desconectar Google Calendar». Oponow revoca el acceso ante Google y borra la conexión guardada.",
              "Desde tu cuenta de Google, en cualquier momento: https://myaccount.google.com/permissions.",
              `Para que borremos todos los datos obtenidos de Google, o tu cuenta completa, escribe a ${CONTACTO}. Los eventos que Oponow creó en tu calendario son tuyos: puedes borrarlos desde Google Calendar, y se borran también si eliminas la tarea en Oponow mientras el calendario está conectado.`,
            ],
          },
          `El uso y la transferencia a cualquier otra aplicación de la información recibida de las API de Google por parte de Oponow se ajustará a la [Política de datos de usuario de los servicios de API de Google](${POLITICA_API_GOOGLE}), incluidos los requisitos de Uso Limitado.`,
        ],
      },
      {
        titulo: "5. Encargados del tratamiento y transferencias internacionales",
        bloques: [
          "No cedemos tus datos a terceros, salvo obligación legal. Para prestar el servicio utilizamos estos proveedores, que tratan los datos por cuenta de Oponow y bajo contrato de encargo conforme al artículo 28 del RGPD:",
          {
            lista: [
              "Vercel Inc. (Estados Unidos): alojamiento de la web oponow.com.",
              "Render Services, Inc. (Estados Unidos): alojamiento del servidor de la aplicación (api.oponow.com), con servidores en Estados Unidos.",
              "Supabase, Inc. (Estados Unidos): base de datos, alojada en Amazon Web Services en Estados Unidos (región de Oregón).",
              "Hostinger International Ltd. (Unión Europea): correo electrónico de Oponow (info@oponow.com), desde el que se envían los códigos de verificación y los avisos de la cuenta.",
              "Pasarela de pago: cuando se active el cobro con tarjeta, el proveedor de pagos tratará los datos necesarios para procesarlo. Oponow no guarda los datos de tu tarjeta.",
            ],
          },
          "Google LLC trata los datos de inicio de sesión con Google y de Google Calendar como responsable independiente, de acuerdo con su propia política de privacidad: https://policies.google.com/privacy.",
          "Algunos de estos proveedores están en Estados Unidos, lo que implica una transferencia internacional de datos. Estas transferencias se realizan con las garantías previstas en el RGPD: el Marco de Privacidad de Datos UE-EE. UU. cuando el proveedor está adherido o, en su defecto, las cláusulas contractuales tipo aprobadas por la Comisión Europea.",
        ],
      },
      {
        titulo: "6. Cuánto tiempo conservamos los datos",
        bloques: [
          {
            lista: [
              "Cuenta, progreso de estudio y agenda: mientras mantengas tu cuenta. Al eliminarla se borran todos los datos asociados a ella.",
              "Sesiones: 30 días desde el último inicio o renovación de la sesión.",
              "Dispositivos de confianza de la verificación en dos pasos: 30 días.",
              "Códigos de verificación: caducan a los 10 minutos y solo valen una vez; el registro del intento (sin el código) se conserva como registro de seguridad mientras exista la cuenta.",
              "Registro de acceso al temario: mientras exista la cuenta, como evidencia frente a usos indebidos del contenido.",
              "Datos de facturación: el tiempo que exija la normativa fiscal y mercantil, aunque elimines tu cuenta.",
              "Registros técnicos de los proveedores de alojamiento: según sus plazos, que en general son de semanas.",
            ],
          },
          "Cuando ya no sean necesarios, los datos se eliminan o se anonimizan.",
        ],
      },
      {
        titulo: "7. Tus derechos",
        bloques: [
          "Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad, así como retirar el consentimiento que hayas dado (por ejemplo, para Google Calendar) sin que ello afecte a la licitud del tratamiento anterior.",
          `Para ejercerlos, escribe a ${CONTACTO} desde el correo asociado a tu cuenta, indicando el derecho que quieres ejercer. Si no podemos comprobar tu identidad por ese medio, podremos pedirte información adicional. Te responderemos en el plazo máximo de un mes.`,
          "Si consideras que no hemos tratado tus datos correctamente, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (C/ Jorge Juan, 6, 28001 Madrid, https://www.aepd.es).",
        ],
      },
      {
        titulo: "8. Cookies y almacenamiento en el navegador",
        bloques: [
          "Oponow solo usa cookies técnicas, estrictamente necesarias para el funcionamiento del servicio, que no requieren consentimiento:",
          {
            lista: [
              "oponow_refresh_token: mantiene tu sesión iniciada. Caduca a los 30 días. Es inaccesible para JavaScript (httpOnly) y solo se envía al servidor de autenticación.",
              "oponow_dispositivo: recuerda durante 30 días que ya verificaste este navegador con el código del correo. También es httpOnly.",
            ],
          },
          "No usamos cookies de analítica ni de publicidad. En las pantallas de inicio de sesión, el botón «Continuar con Google» lo proporciona Google, que puede usar sus propias cookies de acuerdo con su política de privacidad.",
          "Más información en la [Política de cookies](/legal/cookies).",
        ],
      },
      {
        titulo: "9. Seguridad",
        bloques: [
          "Aplicamos medidas técnicas y organizativas adecuadas al riesgo: comunicaciones cifradas (HTTPS), contraseñas guardadas con Argon2id, tokens de sesión y de dispositivo guardados solo como huella criptográfica, cifrado AES-256-GCM de los tokens de Google, verificación en dos pasos por correo en dispositivos nuevos y control de acceso en la base de datos para que cada usuario solo pueda acceder a sus propios datos.",
        ],
      },
      {
        titulo: "10. Menores de edad",
        bloques: [
          `Oponow está dirigido a personas mayores de 14 años. Si tienes menos de 14 años no puedes registrarte sin el consentimiento de tus padres o tutores. Si detectamos una cuenta de un menor de 14 años sin ese consentimiento, la eliminaremos. Si eres padre, madre o tutor y crees que tu hijo o hija nos ha facilitado datos, escríbenos a ${CONTACTO}.`,
        ],
      },
      {
        titulo: "11. Cambios en esta política",
        bloques: [
          "Podemos actualizar esta política para reflejar cambios en el servicio o en la normativa. Publicaremos siempre la versión vigente en esta página, con su fecha de última actualización, y te avisaremos por correo o en la propia aplicación si los cambios son relevantes.",
          `Última actualización: ${ACTUALIZADO}.`,
        ],
      },
    ],
  },

  terminos: {
    slug: "terminos",
    titulo: "Términos y condiciones",
    descripcion:
      "Condiciones de uso de Oponow, la plataforma de preparación de oposiciones: cuenta, inicio de sesión, suscripción, uso del contenido e integración opcional con Google Calendar.",
    actualizado: ACTUALIZADO,
    secciones: [
      {
        titulo: "1. Titular y objeto del servicio",
        bloques: [
          `Oponow (oponow.com) es un servicio de ${TITULAR}. Contacto: ${CONTACTO}.`,
          "Oponow ofrece acceso a temario digital, a un banco de tests de práctica basados en exámenes oficiales y a una agenda de estudio para preparar oposiciones. Existe un nivel de acceso gratuito limitado (un tema por oposición y un test diario) y planes de pago con acceso completo al temario y tests ilimitados de la oposición elegida.",
        ],
      },
      {
        titulo: "2. Registro, inicio de sesión y seguridad de la cuenta",
        bloques: [
          "Para usar Oponow necesitas una cuenta. Puedes crearla con tu correo electrónico y una contraseña, o iniciar sesión con tu cuenta de Google.",
          "Cuando inicias sesión con contraseña desde un navegador o dispositivo nuevo, te enviamos un código de verificación a tu correo electrónico. Ese navegador o dispositivo queda recordado durante 30 días.",
          "Eres responsable de mantener la confidencialidad de tu contraseña y del acceso a tu correo, y de la actividad que se realice desde tu cuenta. Avísanos en cuanto detectes un uso no autorizado.",
          "Debes ser mayor de 14 años, o contar con el consentimiento de tus padres o tutores, para crear una cuenta.",
        ],
      },
      {
        titulo: "3. Suscripción, prueba gratuita y cancelación",
        bloques: [
          "La suscripción de pago incluye un periodo de prueba gratuito (actualmente 7 días) durante el cual puedes cancelar sin coste alguno. Pasado ese periodo, se cobrará automáticamente el importe correspondiente al ciclo elegido (mensual o anual) hasta que canceles.",
          "Puedes cancelar tu suscripción en cualquier momento desde tu cuenta; la cancelación surtirá efecto al final del periodo ya pagado, sin penalización ni permanencia.",
        ],
      },
      {
        titulo: "4. Integración con Google Calendar",
        bloques: [
          "La agenda de estudio puede conectarse, si tú lo decides, a tu Google Calendar para que tus tareas de estudio aparezcan en tu calendario y para ver tus eventos junto a ellas. La conexión es opcional y puedes desconectarla en cualquier momento desde la agenda o desde https://myaccount.google.com/permissions.",
          "Lo que hace Oponow con los datos de Google se explica en la [Política de privacidad](/legal/privacidad), en la sección «Datos obtenidos de Google».",
        ],
      },
      {
        titulo: "5. Uso permitido del contenido",
        bloques: [
          "El acceso al temario y a los tests es personal e intransferible. Queda prohibido descargar, capturar, redistribuir o compartir el contenido de pago con terceros no suscritos.",
          "Para proteger el contenido, Oponow registra internamente (correo electrónico y dirección IP) el acceso a cada bloque de temario. Este registro se usa únicamente como evidencia interna ante un uso indebido detectado, tal y como se describe en la [Política de privacidad](/legal/privacidad).",
        ],
      },
      {
        titulo: "6. Naturaleza del contenido",
        bloques: [
          "El temario y las preguntas de Oponow son un material de apoyo al estudio, no un sustituto de las bases oficiales de la convocatoria ni del BOE. Es responsabilidad del usuario consultar siempre la convocatoria vigente publicada por el organismo correspondiente.",
        ],
      },
      {
        titulo: "7. Baja de la cuenta",
        bloques: [
          `Puedes pedir la eliminación de tu cuenta en cualquier momento escribiendo a ${CONTACTO}. Al eliminarla se borran tus datos, salvo los que debamos conservar por obligación legal, tal y como se indica en la [Política de privacidad](/legal/privacidad).`,
        ],
      },
      {
        titulo: "8. Modificación de estos términos",
        bloques: [
          "Oponow podrá actualizar estos términos para reflejar cambios en el servicio o en la normativa aplicable. Los cambios sustanciales se notificarán a los usuarios registrados con antelación razonable.",
          `Última actualización: ${ACTUALIZADO}.`,
        ],
      },
    ],
  },

  "aviso-legal": {
    slug: "aviso-legal",
    titulo: "Aviso legal",
    descripcion: "Datos identificativos del titular de Oponow, propiedad intelectual y responsabilidad sobre el contenido.",
    actualizado: ACTUALIZADO,
    secciones: [
      {
        titulo: "1. Datos identificativos",
        bloques: [
          `En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de que este sitio web (oponow.com) es titularidad de ${TITULAR}. Para cualquier consulta puede escribirse a ${CONTACTO}.`,
        ],
      },
      {
        titulo: "2. Objeto",
        bloques: [
          "Oponow es una plataforma online de preparación de oposiciones que ofrece temario digital y bancos de tests basados en exámenes oficiales de convocatorias públicas.",
          "El acceso y uso de este sitio web atribuye la condición de usuario e implica la aceptación de las condiciones incluidas en este Aviso legal, en la [Política de privacidad](/legal/privacidad), en la [Política de cookies](/legal/cookies) y en los [Términos y condiciones](/legal/terminos).",
        ],
      },
      {
        titulo: "3. Propiedad intelectual e industrial",
        bloques: [
          "El diseño de la plataforma, los textos, marcas, logotipos y demás elementos gráficos de Oponow, así como el resumen, estructura y presentación del temario, son propiedad de Oponow o de sus licenciantes, salvo cuando se indique lo contrario.",
          "El contenido de las preguntas de test se basa en exámenes de convocatorias oficiales publicadas por los organismos correspondientes. Oponow no reclama la titularidad de dichas convocatorias oficiales; su reproducción se realiza al amparo del carácter de dominio público o uso permitido de los documentos administrativos de acceso público, con fines exclusivamente educativos.",
          "Queda prohibida la reproducción, distribución o comunicación pública total o parcial de los contenidos de esta plataforma sin autorización expresa, salvo para el uso personal del usuario suscrito.",
        ],
      },
      {
        titulo: "4. Exclusión de responsabilidad",
        bloques: [
          "El contenido de Oponow tiene carácter divulgativo y de apoyo al estudio. No constituye una fuente oficial: la convocatoria, las bases y el temario vigentes publicados en el BOE (o boletín autonómico correspondiente) prevalecen siempre sobre cualquier resumen o adaptación disponible en esta plataforma.",
          "Oponow no garantiza la ausencia de errores en los contenidos ni el resultado de ningún proceso selectivo, y no se hace responsable de las decisiones que el usuario tome basándose exclusivamente en el contenido de la plataforma.",
        ],
      },
    ],
  },

  cookies: {
    slug: "cookies",
    titulo: "Política de cookies",
    descripcion: "Qué cookies usa Oponow (solo técnicas, sin analítica ni publicidad) y cómo gestionarlas.",
    actualizado: ACTUALIZADO,
    secciones: [
      {
        titulo: "1. Qué son las cookies",
        bloques: [
          "Las cookies son pequeños archivos que un sitio web guarda en el navegador del usuario. Oponow utiliza un enfoque minimalista: no usa cookies de publicidad ni de seguimiento.",
        ],
      },
      {
        titulo: "2. Cookies que utilizamos",
        bloques: [
          "Solo usamos cookies técnicas, estrictamente necesarias para prestar el servicio, que no requieren consentimiento según el artículo 22.2 de la LSSI-CE:",
          {
            lista: [
              "oponow_refresh_token: mantiene tu sesión iniciada. Caduca a los 30 días. Es httpOnly (inaccesible para JavaScript) y solo se envía al servidor de autenticación de Oponow.",
              "oponow_dispositivo: recuerda durante 30 días que ya verificaste este navegador con el código enviado a tu correo, para no pedírtelo en cada inicio de sesión. También es httpOnly.",
            ],
          },
          "No usamos cookies de analítica ni de publicidad. Si en el futuro se incorporan, se actualizará este texto y se pedirá el consentimiento correspondiente antes de instalarlas.",
          "En las pantallas de inicio de sesión, el botón «Continuar con Google» lo carga Google, que puede usar sus propias cookies según su política: https://policies.google.com/technologies/cookies.",
        ],
      },
      {
        titulo: "3. Cómo desactivar las cookies",
        bloques: [
          "Puedes configurar tu navegador para bloquear o eliminar las cookies. Al ser cookies estrictamente necesarias, bloquearlas impedirá mantener la sesión iniciada y hará que se te pida el código de verificación en cada inicio de sesión.",
          `Última actualización: ${ACTUALIZADO}.`,
        ],
      },
    ],
  },
};
