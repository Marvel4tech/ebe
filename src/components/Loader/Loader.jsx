import React from 'react'
import Loading from "../../assets/images/loading.jpg"

const Loader = () => {
  return (
    <div className=' flex justify-center items-center mt-20'>
        <img src={Loading} alt="loading" className=' w-[50%]'/>
    </div>
  )
}

export default Loader