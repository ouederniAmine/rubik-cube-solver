import { useState } from "react"
import { Drawer } from "@mui/material"
import ColorInputPanel from "./ColorInputPanel"
import { StyledColorInputIcon } from "./ColorInputButton.styles"

const ColorInputButton = () => {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const openDrawer = () => {
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  return (
    <>
      <StyledColorInputIcon onClick={openDrawer} />
      <Drawer anchor="left" open={isDrawerOpen} onClose={closeDrawer}>
        <ColorInputPanel onClose={closeDrawer} />
      </Drawer>
    </>
  )
}

export default ColorInputButton