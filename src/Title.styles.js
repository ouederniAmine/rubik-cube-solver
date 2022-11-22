import styled from "@emotion/styled"

export const StyledTitle = styled.div`
  position: fixed;
  top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;  
  width: 100%;
  font-style: Bold;
  font-size: 3rem;
  font-family: 'Libre Baskerville', serif;
  color: #ffffff;
  opacity: 5;
  &:hover {
    opacity: 1;
    transform: scale(1.2) translate(-.2rem, -.2rem);
  }
`
