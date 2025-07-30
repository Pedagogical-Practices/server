Table User {
   id string [pk]
   name string [not null]
   email string [not null, unique]
   password string [not null]
   role UserRole [not null]
   createdAt datetime
   updatedAt datetime
}

Enum UserRole {
  ADMIN
  TEACHER_DIRECTIVE
  STUDENT
  FAMILY
}

Table Form {
  id string [pk]
  name string [not null]
  description string
  fields string [ref: > FormField.id] // Se mantiene como referencia a FormField.id, asumiendo que FormField es una colección separada.
  createdAt datetime
  updatedAt datetime
}

Table FormField {
  id string
  name string [not null]
  label string [not null]
  type string [not null]
  options json
  rules string[]
  defaultValue string
  value json
  variableName string
  hint string
  required boolean
  chapter string
  question string
  questionNumber string
  consistencyCondition string
  inconsistencyMessage string
  errorType string
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
 
Table Institution {
  id string [pk]
  name string [not null, unique]
  address string
  phone string
  email string
  courses string [ref: > Course.id] // Se mantiene según tu indicación, aunque no esté en el esquema Mongoose actual.
  createdAt datetime
  updatedAt datetime
}

Table Course {
  id string [pk]
  name string [not null]
  description string
  startDate datetime [not null]
  endDate datetime [not null]
  protocols string[] [ref: > Protocol.id] // Corregido a array de referencias.
  createdAt datetime
  updatedAt datetime
}

Table Protocol {
  id string [pk]
  name string [not null]
  description string
  form_id string [not null, ref: > Form.id]
  productType string
  createdAt datetime
  updatedAt datetime
}

Table Practice {
  id string [pk]  
  course_id string [not null, ref: > Course.id] // Añadido de nuevo, ya que es requerido en el esquema Mongoose.
  student_id string [not null, ref: > User.id] 
  teacher_id string [not null, ref: > User.id] 
  status PracticeStatus [not null]
  protocols string[] [ref: > Protocol.id] // Corregido a array de referencias.
  submissions string[] [ref: > Submission.id] // Corregido a array de referencias.
  institution string [ref: > Institution.id] // Se mantiene según tu indicación.
  createdAt datetime
  updatedAt datetime
}

Enum PracticeStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  ARCHIVED
  ASSIGNED
  REVIEWED
  APPROVED
  REJECTED
  CANCELLED
  FAILED
  ON_HOLD
  NOT_STARTED
  IN_REVIEW
  READY_FOR_REVIEW
}

Table Submission {
  id string [pk]
  practice_id string [not null, ref: > Practice.id] 
  protocol_id string [not null, ref: > Protocol.id] 
  formData json [not null]
  locationData json
  score number
  feedback string
  createdAt datetime
  updatedAt datetime
}