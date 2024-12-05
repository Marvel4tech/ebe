import { useState } from 'react'
import TagInput from '../../components/Input/TagInput'
import { MdClose } from "react-icons/md"
import axiosInstance from '../../utils/axiosInstance'
import { toast } from 'react-toastify'

const AddEditNotes = ({ onClose, noteData, type, getAllNotes }) => {
    const [title, setTitle] = useState(noteData?.title || "")
    const [content, setContent] = useState(noteData?.content || "")
    const [tags, setTags] = useState(noteData?.tags || [])

    const [error, setError] = useState(null)

    // Add Note
    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post("/add-note", {
                title,
                content,
                tags,
            })

            if (response.data && response.data.newNote) {
                getAllNotes()
                onClose()
                toast.success("Note Added Successfully")
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.message) {
                setError(error.response.data.message)
                toast.error("Failed to add Note")
            }
        }
    }

    // Edit Note
    const editNote = async () => {
        const noteId = noteData._id
        try {
            const response = await axiosInstance.put("/edit-note/" + noteId, {
                title,
                content,
                tags,
            })
            // Log the response to see if it is received correctly
            console.log("Response from editNote:", response);

            // METHOD 1: but didnt work in this case
            /* if (response.data && response.data.newNote) {
                getAllNotes()
                onClose()
            }
            else {
                console.log("Edit response did not include newNote:", response.data);
            } */

            
            // METHOD 2: Call getAllNotes unconditionally if the edit was successful
            if (response.status === 200) { // Check for a successful response
                getAllNotes(); // Fetch the updated notes
                onClose(); // Close the modal
                toast.success("Note updated Successfully")
            } else {
                console.log("Edit response was not successful:", response.data);
            }
        } catch (error) {
            console.error(error)
            if (error.response && error.response.data && error.response.message) {
                setError(error.response.data.message)
                toast.error("Failed to update Note")
            }
        }
    }

    const handleAddNote = () => {
        if (!title) {
            setError("Please enter a title.")
            return
        }

        if (!content) {
            setError("Please enter a content.")
            return
        }

        setError("")

        if (type === "edit") {
            editNote()
        } else {
            addNewNote()
        }
    }

  return (
    <div className=' relative'>
        <button className=' w-10 h-10 rounded-full flex items-center justify-center absolute -right-3 -top-3 hover:bg-slate-500' 
        onClick={onClose}>
            <MdClose className=' text-xl text-slate-600' />
        </button>
        <div className=' flex flex-col gap 2'>
            <label className='input-label'>
                TITLE
            </label>
            <input 
                type="text"
                className=' text-2xl outline-none text-slate-950'
                placeholder='Go To Gym At 5'
                value={title}
                onChange={({ target }) => setTitle(target.value)}
            />
        </div>
        <div className=' flex flex-col gap 2 mt-4'>
            <label className=' input-label'>
                CONTENT
            </label>
            <textarea 
                type='text'
                className=' text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                placeholder='Content'
                rows={10}
                value={content}
                onChange={({ target }) => setContent(target.value)}
            />
        </div>
        <div className=' mt-3'>
            <label className=' input-label'>
                TAGS
            </label>
            <TagInput tags={tags} setTags={setTags} />
        </div>

        { error && <p className=' text-red-500 text-xs pt-4'>{error}</p> }

        <button className=' btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>
            {type === "edit" ? "UPDATE" : "ADD"}
        </button>
    </div>
  )
}

export default AddEditNotes