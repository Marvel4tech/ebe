import React from 'react'
import { getInitials } from '../../utils/helper'

const ProfileInfo = ({ userInfo, onLogout }) => {

  return (
    <div className=' flex items-center gap-3'>
        <div className=' w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>
            {getInitials(userInfo?.fullName)}
        </div>
        <div>
            <p className=' font-medium text-sm hidden md:block'>
                {userInfo?.fullName}
            </p>
            <button className=' text-sm text-black border-2 border-slate-100 py-2 px-4 rounded md:border-0 md:underline md:p-0 ' onClick={onLogout}>
                Logout
            </button>
        </div>
    </div>
  )
}

export default ProfileInfo