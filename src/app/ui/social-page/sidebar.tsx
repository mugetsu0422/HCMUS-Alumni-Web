import React from 'react'

const Sidebar = ({ children }) => {
  return (
    <div className="fixed h-screen bg-[#f7fafd] overflow-auto w-96  p-4 right-0">
      {children}
    </div>
  )
}

export default Sidebar
