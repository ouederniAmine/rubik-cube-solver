import { useEffect, useState } from 'react'
import { Drawer } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings'
import styled from '@emotion/styled'
import SettingsContent from './SettingsContent'
import { useQueryParams } from './useQueryParams'

const StyledSettingsIcon = styled(SettingsIcon)`
  color: #ffffff;
  opacity: .5;
  position: fixed;
  top: .5rem;
  left: .5rem;
  cursor: pointer;
  &:hover {
    opacity: 1;
    transform: scale(1.2);
  }
`

const Settings = ({ threeAppActions }) => {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [settings, setSettings] = useState({
    cubeSize: undefined,
    autoRotate: undefined,
    autoRotateSpeed: undefined,
    axesEnabled: undefined
  })

  const queryParams = useQueryParams()

  useEffect(() => {
    const cubeSize = queryParams.getNumber('cubeSize', 3)
    const autoRotate = queryParams.getBool('autoRotate', true)
    const autoRotateSpeed = queryParams.getNumber('autoRotateSpeed', 1)
    const axesEnabled = queryParams.getBool('axesEnabled', false)
    threeAppActions.setCubeSize(cubeSize)
    threeAppActions.setAutoRotate(autoRotate)
    threeAppActions.setAutoRotateSpeed(autoRotateSpeed)
    threeAppActions.setAxesEnabled(axesEnabled)
    setSettings({
      cubeSize,
      autoRotate,
      autoRotateSpeed,
      axesEnabled
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const openDrawer = () => {
    setIsDrawerOpen(true)
  }

  const closeDrawer = () => {
    setIsDrawerOpen(false)
  }

  return (
    <>
      <StyledSettingsIcon onClick={openDrawer} />
      <Drawer anchor='left' open={isDrawerOpen} onClose={closeDrawer}>
        <SettingsContent
          initialValues={settings}
          saveSettings={setSettings}
          threeAppActions={threeAppActions}
        />
      </Drawer>
    </>
  )
}

export default Settings