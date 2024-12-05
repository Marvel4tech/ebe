import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'
import { toast } from 'react-toastify'

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("")

  const navigate = useNavigate()

  //const onLogout = () => {
    //localStorage.clear()
    //toast.success("Logout Successfully")
    //navigate("/login") 
  //}

  const onLogout = () => {
    localStorage.clear();
    toast.success("Logout Successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000); // Delay navigation by 1 second
  }

  const handleSearch = () => {
    if (searchQuery) {
      console.log("Searching for:", searchQuery);
      onSearchNote(searchQuery)
    }
  }

  const onClearSearch = () => {
    setSearchQuery("")
    handleClearSearch()
  }

  return (
    <div className=' bg-white flex flex-col md:flex-row justify-between px-6 py-2 drop-shadow'>
        <h2 className=' text-xl font-medium text-black py-2'>Notes</h2>
        <div className=' flex justify-between gap-14'>
          <SearchBar 
            value={searchQuery} 
            onChange={({ target }) => setSearchQuery(target.value)}
            onClearSearch={onClearSearch}
            handleSearch={handleSearch}
          />
          {userInfo ? (
              <ProfileInfo userInfo={userInfo} onLogout={onLogout} /> 
            ) : (
              <button className=' text-sm text-blue-600 border border-blue-600 hover:text-white hover:bg-blue-700 px-3 rounded' onClick={() => navigate("/login")}>Login</button>  // Login link when user not logged in
            ) 
          }
        </div>
    </div>
  )
}

export default Navbar