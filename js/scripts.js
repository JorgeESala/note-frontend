const HOST = "localhost";
const PORT = 8080;
gettAllNotes();

function showNoteWritting(){
    document.getElementById("noteWritting").classList.remove("d-none");
    const saveButton = document.getElementById('saveButton');

    clearNoteForm();
    saveButton.removeEventListener('click', updateNote);
    saveButton.addEventListener('click', createNote);
}

function editName(name){
    document.getElementById(name).innerHTML = "New name";
    this.innerHTML="Save";
}
// opens the clicked note in the form to edit it
async function openNote(id){
    let response = await fetch(`http://${HOST}:${PORT}/api/notes/${id}`);
    let note = await response.json();   
    const saveButton = document.getElementById('saveButton');
    document.getElementsByTagName("main")[0].scrollIntoView({ behavior: "smooth" });
    
    
    saveButton.removeEventListener('click', createNote);
    saveButton.addEventListener("click", updateNote);
    document.getElementById("noteWritting").classList.remove("d-none");
    document.getElementById("inputNoteName").value = note.name;
    document.getElementById("inputId").value = id;
    document.getElementById("noteTextarea").value = note.text;
}

// Gets all the notes from the database
async function gettAllNotes(){
    
    let response = await fetch(`http://${HOST}:${PORT}/api/notes`);
    let notesList = await response.json();

    let buttonText = "";
    let buttonClass ="";
    let buttonFunction = "";
    for(let note of notesList){
      if(note.active){
        buttonText = "Archive";
        buttonClass = "btn-warning";
        buttonFunction = "archiveNote";
      }else {
        buttonText = "Activate";
        buttonClass = "btn-success";
        buttonFunction = "activateNote";
      }

        document.getElementById("noteList").innerHTML += `
        <tr>
        <th id="noteId" scope="row">${note.id}</th>
        <td id="noteName">${note.name}</td>
        <td>
          <div class="d-inline-flex justify-content-end flex-grow-1">
            <button type="button" onclick="openNote(${note.id})" class="btn btn-primary">Edit note</button>
            <button type="button" onclick="${buttonFunction}(${note.id})" class="btn ${buttonClass} ms-1">${buttonText}</button>
            <button type="button" onclick="deleteNote(${note.id})" class=" btn btn-danger ms-1">Delete</button></li>
            </div>
        </td>
      </tr>`
    }
}
// Gets all the active notes from the database
async function gettActiveNotes(){
    
  let response = await fetch(`http://${HOST}:${PORT}/api/notes/active`);
  let notesList = await response.json();
  
  for(let note of notesList){
      document.getElementById("noteList").innerHTML += `
      <tr>
      <th id="noteId" scope="row">${note.id}</th>
      <td id="noteName">${note.name}</td>
      <td>
        <div class="d-inline-flex justify-content-end flex-grow-1">
          <button type="button" onclick="openNote(${note.id})" class="btn btn-primary">Edit note</button>
          <button type="button" onclick="archiveNote(${note.id})" class="btn btn-warning ms-1">Archive</button>
          <button type="button" onclick="deleteNote(${note.id})" class="btn btn-danger ms-1">Delete</button></li>
          </div>
      </td>
    </tr>`
  }
}

// Gets all the active notes from the database
async function gettArchivedNotes(){
    
  let response = await fetch(`http://${HOST}:${PORT}/api/notes/archived`);
  let notesList = await response.json();
  
  for(let note of notesList){
      document.getElementById("noteList").innerHTML += `
      <tr>
      <th id="noteId" scope="row">${note.id}</th>
      <td id="noteName">${note.name}</td>
      <td>
        <div class="d-inline-flex justify-content-end flex-grow-1">
          <button type="button" onclick="openNote(${note.id})" class="btn btn-primary">Edit note</button>
          <button type="button" onclick="activateNote(${note.id})" class="btn btn-success ms-1">Activate</button>
          <button type="button" onclick="deleteNote(${note.id})" class="btn btn-danger ms-1">Delete</button></li>
          </div>
      </td>
    </tr>`
  }
}

async function reloadNotes(){
  document.getElementById("noteList").innerHTML = "";

  if(document.getElementById("allNotesButton").classList.contains("active")){
    gettAllNotes();
  }
  if(document.getElementById("activeNotesButton").classList.contains("active")){
    gettActiveNotes();
  }
  if(document.getElementById("archivedNotesButton").classList.contains("active")){
    gettArchivedNotes();
  }
  
}



// Creates a new Note using the form info
async function createNote(event){
  let note = {
    name: document.getElementById("inputNoteName").value,
    text: document.getElementById("noteTextarea").value
}

const options = {
    method: 'POST', 
    headers: {     
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(note) 
  };

  event.preventDefault();

  const response = await fetch(`http://${HOST}:${PORT}/api/notes`, options);
  if(response.ok){
    alert("Note \""+ note.name + "\" saved successfully");
  }else {
    alert("Something went wrong :(");
  }

  reloadNotes();
}



// Clears all the inputs
function clearNoteForm(){
  document.getElementById("inputNoteName").value = "";
  document.getElementById("noteTextarea").value = "";
}
// Deletes a note using its id
async function deleteNote(id){
  const options = {
    method: 'DELETE'
  };

  const response = await fetch(`http://${HOST}:${PORT}/api/notes/${id}`, options);
  if(response.ok){
    alert("Note \""+ id + "\" deleted successfully");
  }else {
    alert("Something went wrong :(");
  }

  reloadNotes();
}

// Updates a note in the db using the name input
async function updateNote(){
  const noteName = document.getElementById("inputNoteName").value
  const noteId = parseInt(document.getElementById("inputId").value);

  const note = {
    id: noteId,
    name: noteName,
    text:document.getElementById("noteTextarea").value
  };

  const options = {
    method: 'PUT', 
    headers: {     
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(note) 
  };

  const response = await fetch(`http://${HOST}:${PORT}/api/notes/${noteId}`, options);

  if(response.ok){
    alert("Note " + noteName + " updated successfully");
  } else {
    alert(" Something went wrong :( " + response.status);
  }
  reloadNotes();

}

// Filter buttons section

function showAllNotes(){
  const allButton = document.getElementById("allNotesButton");
  const activeButton = document.getElementById("activeNotesButton");
  const archivedButton = document.getElementById("archivedNotesButton");
  document.getElementById("noteList").innerHTML = "";

  gettAllNotes().then(() => {
    document.getElementsByTagName("table")[0].scrollIntoView({ behavior: "smooth" })
  });

  // Make the "All" button the only active if it isn't
  if(!allButton.classList.contains("active")){
    allButton.classList.add("active");
  }

  if(activeButton.classList.contains("active")){
    activeButton.classList.remove("active");
  }

  if(archivedButton.classList.contains("active")){
    archivedButton.classList.remove("active");
  }
  
}

function showActiveNotes(){
  const allButton = document.getElementById("allNotesButton");
  const activeButton = document.getElementById("activeNotesButton");
  const archivedButton = document.getElementById("archivedNotesButton");

  document.getElementById("noteList").innerHTML = "";
  gettActiveNotes().then(() => {
    document.getElementsByTagName("table")[0].scrollIntoView({ behavior: "smooth" })
  });

  // Make the "Active" button the only active if it isn't
  if(allButton.classList.contains("active")){
    allButton.classList.remove("active");
  }

  if(!activeButton.classList.contains("active")){
    activeButton.classList.add("active");
  }

  if(archivedButton.classList.contains("active")){
    archivedButton.classList.remove("active");
  }
}

function showArchivedNotes(){
  const allButton = document.getElementById("allNotesButton");
  const activeButton = document.getElementById("activeNotesButton");
  const archivedButton = document.getElementById("archivedNotesButton");

  document.getElementById("noteList").innerHTML = "";
  gettArchivedNotes().then(() => {
    document.getElementsByTagName("table")[0].scrollIntoView({ behavior: "smooth" })
  });

  // Make the "Archived" button the only active if it isn't
  if(allButton.classList.contains("active")){
    allButton.classList.remove("active");
  }

  if(activeButton.classList.contains("active")){
    activeButton.classList.remove("active");
  }

  if(!archivedButton.classList.contains("active")){
    archivedButton.classList.add("active");
  }

}

// Activate or archive note

// Activate note using the id
async function activateNote(id){
  const note = {
    id: id,
    active: true
  };

  const options = {
    method: "PUT",
    headers: {     
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(note) 
  };

  const response = await fetch(`http://${HOST}:${PORT}/api/notes/${id}`, options);
  if(response.ok){
    alert("Note activated successfully");
  } else {
    alert("Something went wrong :( " + response.status);
  }
  reloadNotes();
}

// Archive the note using the id
async function archiveNote(id){
  const note = {
    id: id,
    active: false
  };

  const options = {
    method: "PUT",
    headers: {     
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify(note) 
  };

  const response = await fetch(`http://${HOST}:${PORT}/api/notes/${id}`, options);

  if(response.ok){
    alert("Note archived successfully ");
  }else{
    alert("Something went wrong :( " + response.status);
  }
  reloadNotes();
}