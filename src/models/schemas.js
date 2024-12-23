const userSchema = {
  _id: "user_id",
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  password: "password",
  designation: "dr|user|admin",
  isVerified: true | false,
  profileImage: "profile_image_url",
  createdAt: "timestamp",
  updatedAt: "timestamp",
};
const sessionSchema = {
  _id: "session_id",
  sessionTitle: "sessionTitle",
  userId: "user_id",
  drId: "dr_id",
  createdAt: "timestamp",
  updatedAt: "timestamp",
  messages: ["message_id", "message_id", "message_id"],
};

const messageSchema = {
  _id: "message_id",
  sessionId: "session_id",
  userId: "user_id",
  type: "text|file|image|video|audio|pdf",
  content: "Message text for text type",
  isUser: true | false,
  file: {
    url: "file_url",
    name: "file_name",
    type: "image|video|audio|pdf",
    size: 1024,
    fileContent: "text content of the file",
  },
  createdAt: "timestamp",
  updatedAt: "timestamp",
};

const savedInteractionsSchema = {
  _id: "interaction_id",
  userId: "user_id",
  interactions: ["session_id", "session_id", "session_id"],
  createdAt: "timestamp",
  updatedAt: "timestamp",
};

const trainingSessionSchema = {
  _id: "training_session_id",
  userId: "user_id",
  title: "title",
  type: "website" | "youtube" | "books" | "social media" | "manual" | "other",
  content: {
    url: "url",
    content: "text",
  },
  status: "readyToUse" | "inProgress" | "notStarted",
  percentageCompleted: 0,
  lastUpdatedAt: "timestamp",
  createdAt: "timestamp",
  updatedAt: "timestamp",
};

const cloneSchema = {
  _id: "clone_id",
  title: "title",
  drId: "dr_id",
  trainingSessionIds: [
    "training_session_id",
    "training_session_id",
    "training_session_id",
  ],
  status: "readyToUse" | "inProgress" | "notStarted",
  percentageCompleted: 0,
  createdAt: "timestamp",
  updatedAt: "timestamp",
};

const drSchema = {
  _id: "dr_id",
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  password: "password",
  designation: "dr",
  isVerified: true | false,
  specialization: "specialization",
  yearsOfExperience: "yearsOfExperience",
  education: "education",
  createdAt: "timestamp",
  updatedAt: "timestamp",
};

const patientSchema = {
  _id: "patient_id",
  name: "Jane Doe",
  email: "patient@example.com",
  phone: "0987654321",
  age: 35,
  gender: "Female",
  medicalHistory: ["diabetes", "hypertension"],
  profileImage: "image_url",
  createdAt: "timestamp",
  updatedAt: "timestamp",
};
