import React from 'react'
import { Drawer, Button } from '@material-tailwind/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

function CloseSideBar({ closeSideBar }) {
  return (
    <Button
      onClick={closeSideBar}
      placeholder={undefined}
      className="p-2"
      variant="text">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        className="bi bi-x-lg"
        viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
      </svg>
    </Button>
  )
}

const Sidebar = ({ children }) => {
  const [isSideBarOpen, setIsSideBarOpen] = React.useState(true)
  // to check condition to hidden or visible close button of sidebar
  const [isSmallerThanXL, setIsSmallerThanXL] = React.useState(false)
  const closeSideBar = () => setIsSideBarOpen(false)
  const toggleIsSideBar = () => setIsSideBarOpen((cur) => !cur)

  const handleChangeSmallScreen = () => {
    setIsSmallerThanXL(true)
    setIsSideBarOpen(false)
  }

  const handleChangeBigScreen = () => {
    setIsSmallerThanXL(false)
    setIsSideBarOpen(true)
  }

  React.useEffect(() => {
    window.addEventListener('resize', () => {
      window.innerWidth <= 1536
        ? handleChangeSmallScreen()
        : handleChangeBigScreen() // 1536 = 2xl (tailwind)
    })
  }, [isSideBarOpen])
  return (
    <div className="fixed sm:right-0 top-[50%]">
      {isSideBarOpen ? (
        ''
      ) : (
        <Button
          onClick={toggleIsSideBar}
          variant="text"
          placeholder={undefined}
          className="relative p-2">
          <FontAwesomeIcon icon={faChevronLeft} className="text-xl" />
        </Button>
      )}

      <Drawer
        placeholder={undefined}
        open={isSideBarOpen}
        placement="right"
        overlay={false}
        className="fixed h-screen top-[4.75rem] bg-[#f7fafd] overflow-auto scrollbar-webkit w-80 p-4 right-0">
        {isSideBarOpen && isSmallerThanXL ? (
          <CloseSideBar closeSideBar={closeSideBar} />
        ) : (
          ''
        )}
        {children}
      </Drawer>
    </div>
  )
}

export default Sidebar
