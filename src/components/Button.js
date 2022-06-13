import styled from 'styled-components'

const ButtonInput = styled.button`
  margin : auto;
  width: 75px;
  height: 33px;
  background: #D9D9D9;
  border :none;
  border-radius: 7px;
  &:hover {
    box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
  }
`

export default function Button(props){
  return (
      <ButtonInput disabled={props.disabled} onClick={props.onClick} >
        {props.title}
      </ButtonInput>

  )
}
