export const getNotes = () => {
  const notes = localStorage.getItem("notes");
  return notes ? JSON.parse(notes) : [];
};

export const saveNotes = (notes) => {
  localStorage.setItem("notes", JSON.stringify(notes));
};

export const addNote = (note) => {
  const notes = getNotes();
  const updatedNotes = [note, ...notes];
  saveNotes(updatedNotes);
  return updatedNotes;
};

export const deleteNote = (id) => {
  const notes = getNotes();
  const updatedNotes = notes.filter(n => n.id !== id);
  saveNotes(updatedNotes);
  return updatedNotes;
};

// สร้างไว้ให้ backend 