import { useEffect, useState } from 'react';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import styles from './styles/NotePage.module.css';
import styleUtils from './styles/utils.module.css';
import * as NoteApi from "./network/note_api";
import AddEditNoteDialog from './components/AddEditNoteDialog';
import { FaPlus } from "react-icons/fa"

function App() {
  const [notes, setNote] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);

  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel|null>(null);

  useEffect(() => {
    async function loadNote() {
      try {
		setNotesLoading(true);
		setShowNotesLoadingError(false);
        const notes = await NoteApi.fetchNotes();
        setNote(notes);
      } catch (error) {
        console.error(error);
        // alert(error);
		setShowNotesLoadingError(true);
      } finally {
		setNotesLoading(false);
	  }
    }
    loadNote();
  }, []);
 
  async function deleteNote(note: NoteModel) {
    try {
      await NoteApi.deleteNote(note._id);
      setNote(notes.filter(existingNote => existingNote._id !== note._id));
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  const noteGrid =  
	<Row xs={1} md={2} xl={3} className={`g-4 ${styles.noteGrid}`}>
	{notes.map(note => (
		<Col>
		<Note 
			note={note} 
			className={styles.note}
			onNoteClicked={setNoteToEdit}
			onDeleteNoteClicked={deleteNote}
		/>
		</Col>
	))}
	</Row> 

  return (
    <Container className={styles.notesPage}>
      <Button 
        className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
        onClick={() => {setShowAddNoteDialog(true)}}>
        <FaPlus />
        Add new note
      </Button>
      { notesLoading && <Spinner animation='border' variant='primary' /> /* if notesLoading then <Spinner/> */}
	  { showNotesLoadingError && <p>Something went wrong. Please refresh the page.</p>}
	  { !notesLoading && !showNotesLoadingError && 
	  <>
		{ Note.length > 0
			? noteGrid
			: <p>You don't have any notes yet</p>
		}
	  </>}
      { showAddNoteDialog && 
        <AddEditNoteDialog 
          onDismiss={() => {
            setShowAddNoteDialog(false);
          }}
          onNoteSaved={(newNote) => {
            setNote([...notes, newNote]);
            setShowAddNoteDialog(false);
          }}
        /> 
      } 
      {noteToEdit &&
      <AddEditNoteDialog
        noteToEdit={noteToEdit}
        onDismiss={() => setNoteToEdit(null)}
        onNoteSaved={(updateNote) => {
          setNote(notes.map(existingNote => existingNote._id === updateNote._id ? updateNote : existingNote));
          setNoteToEdit(null);
        }}
      />
      }    
    </Container>
  );
}

export default App;
