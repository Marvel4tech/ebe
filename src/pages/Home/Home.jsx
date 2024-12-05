import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from "react-icons/md"
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { toast, ToastContainer } from "react-toastify"
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import AddNoteImg from "../../assets/images/add-note.jpg"
import Loader from '../../components/Loader/Loader'

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({ isShown: false, type: "add", data: null })

  const [userInfo, setUserInfo] = useState(null)
  const [allNotes, setAllNotes] = useState([])
  const [isSearch, setIsSearch] = useState(false)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: noteDetails })
  }

  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user)
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear()
        navigate("/login")
      }
    }
  };

  useEffect(() => {
    getAllNotes()
    getUserInfo()
    return () => {}
  }, [])

  // Get All Notes
  const getAllNotes = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get("/get-all-notes")

      if (response.data && response.data.notes) {
      setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log("An unexpected error occured. Please try again", error)
    } finally {
      setLoading(false)
    }
  }

  // Get Delete Note
  const deleteNote = async (data) => {
    const noteId = data._id
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.status === 200) {
          toast.success("Deleted Successfully")
          getAllNotes()
      }
    } catch (error) {
      if (error.message && error.response.data && error.response.data.message) {
        console.log("An unexpected error occured. Please try again.")
        toast.error("Deletion failed")
      }
    }
  }

  // Search Notes
const onSearchNote = async (query) => {
  try {
    const response = await axiosInstance.get("/search-notes", {
      params: { query },
    })
    console.log(response.data.matchingNotes);

    if (response.data && response.data.matchingNotes) {
      setIsSearch(true)
      setAllNotes(response.data.matchingNotes || [])
    }
  } catch (error) {
    console.error("Error searching notes:", error);
    toast.error("Search failed. Please try again.");
  }
}

const handleClearSearch = () => {
  setIsSearch(false)
  getAllNotes()
}

// Pin Notes
const updateIsPinned = async (noteData) => {
  const noteId = noteData._id
  try {
    const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
      isPinned: !noteData.isPinned,
    })

    if (response.data && response.data.pinned) {
      toast.success("Pinned Status Updated Successfully")
      getAllNotes()
    }
  } catch (error) {
    console.log("failed to Pin", error)
    toast.error(error)
  }
}

  return (
    <>
      <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>

      <div className=' container mx-auto px-4'>
        <ToastContainer />
        {loading ? (
          <Loader />
        ) : allNotes.length > 0 ? ( <div className=' flex flex-col md:grid md:grid-cols-3 gap-4 mt-8'>
          {allNotes.map((allNote, i) => (
            <NoteCard key={allNote._id} 
              title={allNote.title} 
              date={allNote.createdOn} 
              content={allNote.content} 
              tags={allNote.tags}
              isPinned={allNote.isPinned} 
              onEdit={() => handleEdit(allNote)} onDelete={() => deleteNote(allNote)} onPinNote={() => updateIsPinned(allNote)}
            />
          ))}
        </div>) : 
          (<EmptyCard 
            imgSrc={AddNoteImg} 
            message={isSearch ? 
              "No notes found matching your search." : 
              "Start creating your first note! Click the 'Add' to jot down your thoughts, ideas, and reminders. Lets get started!"}  
          />) }
      </div>

      <button className=' w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 fixed right-10 
      bottom-10 z-50' onClick={() => {setOpenAddEditModal({ isShown: true, type: "add", data: null})}}>
          <MdAdd className=' text-[32px] text-white'/>
      </button>

      <Modal isOpen={openAddEditModal.isShown} onRequestClose={() => {}} style={{overlay: {backgroundColor: "rgba(0,0,0,0.2)",}}} 
      contentLabel="" className=" w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll" 
      appElement={document.getElementById('root')} >
          <AddEditNotes
            type={openAddEditModal.type}
            noteData={openAddEditModal.data}
            onClose={() => setOpenAddEditModal({ isShown:false, type: "add", data: null })}
            getAllNotes={getAllNotes}
          />
      </Modal>
    </>
  )
}

export default Home