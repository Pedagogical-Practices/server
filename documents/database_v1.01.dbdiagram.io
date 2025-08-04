//// ------------------
//// Entidades Centrales
//// ------------------

Table User {
  id string [pk]
  firstName string [not null]                                                                                        
  middleName string                                                                                                  
  lastName string [not null]                                                                                         
  secondLastName string  
  email string [not null, unique]
  phone string 
  password string [not null]
  roles UserRole[] [not null] // Cambiado a array para soportar múltiples roles
  createdAt datetime
  updatedAt datetime
}

Enum UserRole {
  ADMIN // Administrador del sistema (rol técnico)
  COORDINATOR // Coordinador de Prácticas (rol de gestión principal)
  TUTOR // Docente de la Universidad
  ASSESSOR // Docente/Rector/Coordinador de la Institución Educativa
  STUDENT // Estudiante en práctica
  FAMILY // Padre de familia
  VISITOR // Usuario invitado con acceso de solo lectura a datos públicos
}

Table Institution {
  id string [pk]
  name string [not null, unique]
  address string
  phone string
  email string  
  createdAt datetime
  updatedAt datetime
}

//// ---------------------------------
//// Estructura Académica y de Prácticas
//// ---------------------------------

// 'Practice' representa el curso de la malla curricular (ej. Práctica Pedagógica I)
Table Practice {
  id string [pk]
  name string [not null]
  description string
  protocols Protocol[] [ref: > Protocol.id
  ]
  createdAt datetime
  updatedAt datetime
}

// 'Group' representa la instancia de una 'Practice' en un periodo académico (ej. Grupo A, 2025-1)
Table Group {
  id string [pk]
  name string [not null] 
  practice_id string [ref: > Practice.id]
  period string [not null] 
  teacher_tutor User [not null, ref: > User.id] // Docente Tutor de la Universidad
  students User[] [not null, ref: > User.id]
  institutions Institution[] [ref: > Institution.id]
  createdAt datetime
  updatedAt datetime
}

Table Protocol {
  id string [pk]
  name string [not null]
  description string
  forms Form[] [not null, ref: > Form.id]
  productType string
  // Las fechas de entrega ahora se definen por grupo en 'GroupProtocolDeadline'
  createdAt datetime
  updatedAt datetime
}

// Tabla para definir las fechas límite de los protocolos por cada grupo
Table GroupProtocolDeadline {
  id string [pk]
  group_id string [ref: > Group.id]
  protocol_id string [ref: > Protocol.id]
  startDate datetime
  endDate datetime [not null]
}

//// ---------------------------------
//// Formularios y Entregas
//// ---------------------------------

Table Form {
  id string [pk]
  name string [not null]
  description string
  fields FormField[] [ref: > FormField.id]
  createdAt datetime
  updatedAt datetime
  // Se añade versionado para trazabilidad de cambios en formularios
  version integer [default: 1]
}

Table FormField {
  id string
  name string [not null]
  label string [not null]
  type string [not null] // e.g., 'TEXT', 'SELECT', 'MAP_URL'
  options json
  rules string[]
  defaultValue string // Para el campo MAP_URL, aquí se almacena la URL del mapa base de Google Maps
  value json
  variableName string
  hint string
  required boolean
  description string
  disabled boolean
  readonly boolean
  dataSource string
  placeholder string
  specificType string
  height string
  multiple boolean
  color string
}

Table Submission {
  id string [pk]
  group_id string [not null, ref: > Group.id]
  protocol_id string [not null, ref: > Protocol.id]
  // Se permite que una entrega sea de múltiples estudiantes (trabajo en grupo)
  student_ids User[] [not null]
  formData json [not null] // Almacena los datos del formulario llenado
  // Para los mapas, el resultado de la interacción del estudiante (si aplica) se guarda en formData.
  // La URL base del mapa está en el FormField.
  score number
  feedback string
  status SubmissionStatus [not null, default: 'SUBMITTED']
  createdAt datetime
  updatedAt datetime
}

Enum SubmissionStatus {
  SUBMITTED
  REVIEWED
  APPROVED
  NEEDS_REVISION
}


//// ---------------------------------
//// Referencia de Cambios solicitados por Stakeholders (Reunión 1 Ago)
//// ---------------------------------
//
// 1.  **Cambio de Nomenclatura `Curso` -> `Grupo` y `Práctica` -> `Curso de Malla`**:
//     - **Justificación**: Aclarar la semántica del modelo. La "Práctica" es el curso de la malla curricular, y el "Curso" es en realidad un "Grupo" de un semestre específico.
//     - **Timestamp**: 1:13:00 - 1:16:00
//     - **Implementación**: Se renombró la tabla `Groups` a `Course` y la tabla `Practice` a `Group`. Se creó una nueva tabla `Practice` para representar el curso de la malla.
//
// 2.  **Nuevos Roles de Usuario y Múltiples Roles**:
//     - **Justificación**: Se necesitan roles para "Visitante" y para el personal de la institución ("Docente Asesor", Rector, etc.). Además, un usuario puede tener múltiples roles (ej. ser Coordinador y Tutor).
//     - **Timestamp**: 10:28, 52:28, 1:18:20 - 1:20:04
//     - **Implementación**: Se añadieron los roles `VISITOR` y `ASSESSOR` al `Enum UserRole`. El campo `role` en la tabla `User` se cambió a `roles UserRole[]` para ser un array.
//
// 3.  **Asociación de Personal a Instituciones**:
//     - **Justificación**: El Rector, Coordinador y Docentes Asesores deben estar vinculados a su institución para gestionar permisos y vistas de dashboard.
//     - **Timestamp**: 54:12 - 59:24
//     - **Implementación**: Se eliminó el campo de texto de la tabla `Institution`. La relación ahora se maneja a través de la tabla `Group`, que asocia usuarios (con rol `ASSESSOR`) a una institución para una práctica específica. Se creará un dashboard por institución.
//
// 4.  **Soporte para Trabajo en Grupo en Entregas (Submissions)**:
//     - **Justificación**: Varios protocolos se realizan en grupo, por lo que una única entrega debe poder ser asociada a múltiples estudiantes.
//     - **Timestamp**: 1:08:28 - 1:09:00, 1:23:24
//     - **Implementación**: El campo `student_id` en la tabla `Submission` se cambió a `student_ids User[]` para permitir un array de referencias a usuarios.
//
// 5.  **Fechas de Entrega Flexibles por Grupo**:
//     - **Justificación**: El docente tutor debe poder definir fechas de cierre para cada protocolo de manera independiente para cada grupo, ya que pueden variar por circunstancias.
//     - **Timestamp**: 1:27:32 - 1:31:32
//     - **Implementación**: Se creó la tabla `GroupProtocolDeadline` para almacenar las fechas de inicio y fin de cada protocolo para cada grupo específico, desacoplando esta lógica de la definición del protocolo en sí.
//
// 6.  **Manejo de Formularios con Mapas**:
//     - **Justificación**: El proceso no es en tiempo real. El docente crea un mapa personalizado en Google Maps y comparte la URL. Los estudiantes editan ese mapa. El sistema debe almacenar la URL y renderizar una vista previa.
//     - **Timestamp**: 1:37:40 - 1:45:24
//     - **Implementación**: Se especificó en los comentarios que el `FormField` de tipo `MAP_URL` usará el campo `defaultValue` para almacenar la URL del mapa base. El resultado de la interacción del estudiante se guarda en `formData` dentro de `Submission`.
//
// 7.  **Historial de Prácticas del Estudiante**:
//     - **Justificación**: Un estudiante puede cursar varias prácticas, incluso simultáneamente en un mismo periodo. Debe poder ver su historial completo.
//     - **Timestamp**: 1:26:20 - 1:27:28
//     - **Implementación**: El modelo soporta esto de forma natural. Un `User` (estudiante) puede estar en múltiples `Group` a lo largo del tiempo o en el mismo periodo. Las consultas a la UI filtrarán por defecto al periodo actual, con opción de ver el historial.