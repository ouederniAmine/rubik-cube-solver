import { Divider,Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { StyledSettingsPanel, StyledSettingsPanelHeader, StyledSettingsPanelBody } from "./SettingsPanel.styles"
import { useThreeAppActions } from "./context"

import ToggleButton from '@mui/material/ToggleButton';
import * as React from 'react';
import Button from '@mui/material/Button';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';







const ColorInputPanel = ({ onClose }) => {

  const threeAppActions = useThreeAppActions()

  const resetCube = () => {
    threeAppActions.emptycube()
  }
  const resetToogle = () => {

    threeAppActions.setInputState(false)
    
  }

  const scramble = () => {
    threeAppActions.scramble()    
  }
  const handleToogleChange = (event, newView) => {
    threeAppActions.setInputState(true)
    threeAppActions.setColor(newView)
  }
 
  return (
    <StyledSettingsPanel>
      <StyledSettingsPanelHeader>
        <Typography variant="subtitle1" gutterBottom>Color Input</Typography>
        <CloseIcon onClick={onClose} />
      </StyledSettingsPanelHeader>
      <Divider />
      <StyledSettingsPanelBody>
        <br></br>
      <h3>Toogle the color</h3>
      <ToggleButtonGroup
      size="large"  
      onChange={handleToogleChange}  
      exclusive
    >
      <ToggleButton    value="white" aria-label="list">
        <div style={{width:"70px" , height:"70px" , background:'white'}}></div>
      </ToggleButton>
      <ToggleButton value="red" aria-label="module">
      <div style={{width:"70px" , height:"70px" , background:'red'}}></div>

      </ToggleButton>
      <ToggleButton value="yellow" aria-label="quilt">
      <div style={{width:"70px" , height:"70px" , background:'yellow'}}></div>

      </ToggleButton>
    </ToggleButtonGroup>
    
    <ToggleButtonGroup
      size="large" 
      onChange={handleToogleChange}    
      exclusive
    >
      <ToggleButton value="green" aria-label="list">
      <div style={{width:"70px" , height:"70px" , background:'green'}}></div>

      </ToggleButton>
      <ToggleButton value="orange" aria-label="module">
      <div style={{width:"70px" , height:"70px" , background:'orange'}}></div>

      </ToggleButton>
      <ToggleButton value="blue" aria-label="quilt">
      <div style={{width:"70px" , height:"70px" , background:'blue'}}></div>

      </ToggleButton>
    </ToggleButtonGroup>
    <br></br>
    
    <Button size="large" onClick={resetCube}>Empty Cube</Button>
    <Button size="large" onClick={scramble}>Solve it</Button>
    <Button size="large" onClick={resetToogle}>Input Done</Button>

      </StyledSettingsPanelBody>
    </StyledSettingsPanel>
  )
}

export default ColorInputPanel
