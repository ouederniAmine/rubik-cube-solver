import { useEffect, useState } from "react"
import { Divider, FormControl, FormControlLabel, FormLabel, Slider, Switch, Typography } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import { StyledSettingsPanel, StyledSettingsPanelHeader, StyledSettingsPanelBody } from "./SettingsPanel.styles"
import { useThreeAppActions } from "./context"
const AnimationSpeedSetting = ({ value, setValue }) => {

  const handleChange = event => {
    setValue(event.target.value)
  }

  return (
    <div>
      <FormControl sx={{ width: "100%" }}>
        <FormLabel id="animation-speed-label">Animation Speed</FormLabel>
        <Slider
          aria-labelledby="animation-speed-label"
          size="small"
          min={100}
          max={5000}
          step={25}
          valueLabelDisplay="auto"
          value={value}
          onChange={handleChange}
        />
      </FormControl>
    </div>
  )
}

const AutoRotateSetting = ({ value, setValue }) => {

  const handleChange = event => {
    setValue(event.target.checked)
  }

  return (
    <div>
      <FormControl>
        <FormLabel id="auto-rotate-label">Auto Rotate</FormLabel>
        <FormControlLabel
          sx={{ mt: ".25rem" }}
          control={
            <Switch
              aria-labelledby="auto-rotate-label"
              size="small"
              checked={value}
              onClick={handleChange}
            />
          }
          label={value ? "On" : "Off"}
        />
      </FormControl>
    </div>
  )
}

const AutoRotateSpeedSetting = ({ value, setValue }) => {

  const handleChange = event => {
    setValue(event.target.value)
  }

  return (
    <div>
      <FormControl sx={{ width: "100%" }}>
        <FormLabel id="auto-rotate-speed-label">Auto Rotate Speed</FormLabel>
        <Slider
          aria-labelledby="auto-rotate-speed-label"
          size="small"
          min={0.0}
          max={10.0}
          step={0.1}
          valueLabelDisplay="auto"
          value={value}
          onChange={handleChange}
        />
      </FormControl>
    </div>
  )
}


const SettingsPanel = ({ onClose }) => {

  const threeAppActions = useThreeAppActions()
  const [settings, setSettings] = useState(threeAppActions.getSettings)

  useEffect(() => {
    threeAppActions.addSettingsChangedListener(setSettings)
    return () => threeAppActions.removeSettingsChangedListener(setSettings)
  }, [threeAppActions])

  return (
    <StyledSettingsPanel>
      <StyledSettingsPanelHeader>
        <Typography variant="subtitle1" gutterBottom>Settings</Typography>
        <CloseIcon onClick={onClose} />
      </StyledSettingsPanelHeader>
      <Divider />
      <StyledSettingsPanelBody>
        <AnimationSpeedSetting value={settings.animationSpeed} setValue={threeAppActions.setAnimationSpeed} />
        <AutoRotateSetting value={settings.autoRotate} setValue={threeAppActions.setAutoRotate} />
        <AutoRotateSpeedSetting value={settings.autoRotateSpeed} setValue={threeAppActions.setAutoRotateSpeed} />
      </StyledSettingsPanelBody>
    </StyledSettingsPanel>
  )
}

export default SettingsPanel
