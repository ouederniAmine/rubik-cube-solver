import ColorLensIcon from '@mui/icons-material/ColorLens';
import styled from "@emotion/styled"

export const StyledColorInputIcon = styled(ColorLensIcon)`
  color: #ffffff;
  opacity: .5;
  position: fixed;
  top: 2.5rem;
  left: .5rem;
  cursor: pointer;
  &:hover {
    opacity: 1;
    transform: scale(1.2);
  }
`
