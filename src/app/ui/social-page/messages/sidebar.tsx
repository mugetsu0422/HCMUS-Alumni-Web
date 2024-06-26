import React from 'react'
import { Drawer, Button } from '@material-tailwind/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { XLg } from 'react-bootstrap-icons'

const Sidebar = ({ children }) => {
  const [isSideBarOpen, setIsSideBarOpen] = React.useState(true)
  // to check condition to hidden or visible close button of sidebar
  const [isSmallerThan2XL, setIsSmallerThan2XL] = React.useState(false)
  const closeSideBar = () => setIsSideBarOpen((e) => !e)
  const toggleIsSideBar = () => setIsSideBarOpen((cur) => !cur)

  const handleChangeSmallScreen = () => {
    setIsSmallerThan2XL(true)
    setIsSideBarOpen(false)
  }

  const handleChangeBigScreen = () => {
    setIsSmallerThan2XL(false)
    setIsSideBarOpen(true)
  }

  React.useEffect(() => {
    window.addEventListener('resize', () => {
      window.innerWidth <= 1319
        ? handleChangeSmallScreen()
        : handleChangeBigScreen()
    })
  }, [isSideBarOpen])
  return (
    <div className="w-1/4 bg-gray-100 p-4">
      {/* {isSideBarOpen ? (
        ''
      ) : (
        <Button
          onClick={toggleIsSideBar}
          variant="text"
          placeholder={undefined}
          className="relative ml-2 p-2 z-10 top-[50%]">
          <FontAwesomeIcon icon={faChevronRight} className="text-xl" />
        </Button>
      )} */}

      {/* <Drawer
        placeholder={undefined}
        open={isSideBarOpen}
        placement="left"
        overlay={false}
        className="fixed mt-[82px] border-[#eeeeee] border-r-2 border-t bg-white">
        {isSmallerThan2XL && isSideBarOpen && (
          <div className="pt-4 pr-4 flex justify-end">
            <Button
              onClick={closeSideBar}
              placeholder={undefined}
              className="p-2"
              variant="text">
              <XLg className="text-xl" />
            </Button>
          </div>
        )}
        {children}
      </Drawer> */}
      <div>{children}</div>
    </div>
  )
}

export default Sidebar
