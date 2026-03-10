const permissions = {

  admin: [
    "viewPatients",
    "manageUsers",
    "viewNotes"
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