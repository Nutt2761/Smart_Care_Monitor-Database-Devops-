const permissions = {

  admin: [
    "viewPatients",
    "addPatient",
    "deletePatient",
    "addNote",
    "manageUsers",
    "viewNotes",
    "editNote"
  ],

  doctor: [
    "viewPatients",
    "addPatient",
    "deletePatient",
    "addNote",
    "editNote"
  ],

  nurse: [
    "viewPatients",
    "addNote"
  ]

};

export default permissions;