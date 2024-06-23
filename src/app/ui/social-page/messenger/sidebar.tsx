import React from 'react'
import { Drawer, Button } from '@material-tailwind/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { XLg } from 'react-bootstrap-icons'

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
    <div className="relative left-0">
      {isSideBarOpen ? (
        ''
      ) : (
        <Button
          onClick={toggleIsSideBar}
          //variant="text"
          placeholder={undefined}
          className="relative ml-2 p-2 z-10">
          <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
        </Button>
      )}

      <Drawer
        placeholder={undefined}
        open={isSideBarOpen}
        placement="left"
        overlay={false}
        className="fixed mt-[82px] border-[#eeeeee] border-r-2 border-t bg-white"
        size={360}>
        {isSideBarOpen && isSmallerThanXL ? (
          <Button
            onClick={closeSideBar}
            placeholder={undefined}
            className="p-2"
            variant="text">
            <XLg />
          </Button>
        ) : (
          ''
        )}
        {children}
      </Drawer>
    </div>
  )
}

export default Sidebar
