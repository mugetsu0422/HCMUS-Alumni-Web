import React from 'react'

const Sidebar = ({ children }) => {
  return (
    <div className="fixed h-screen overflow-auto w-72 bg-blue-gray-50 p-4 right-0">
      {children}
    </div>
  )
}

export default Sidebar
