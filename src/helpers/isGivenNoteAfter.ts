import { UpdateNoteDto } from "src/note/dto/update-note.dto";
import { Note } from "src/note/schemas/notes.schema";

export function isGivenNoteAfter(notaActual: Note, nuevaNota: UpdateNoteDto) {
    const fechaNota1 = new Date(notaActual.lastModified);
    const fechaNota2 = new Date(nuevaNota.lastModified);
    
    if (fechaNota1 < fechaNota2) {
        return true;
    } else {
        return false;
    }
}