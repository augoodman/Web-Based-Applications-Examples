import React from 'react';
import styled from 'styled-components';

export const Button = (props) => {
    return <StyleButton onClick={props.onClick}>
            {props.value}
    </StyleButton>;
};

Button.defaultProps = {
    value: '',
    onClick: ()=>{}
};

const StyleButton = styled.button`
  height: 50px;
  border-radius: 5px;
  font-size: 16px;
  outline: 0;
  padding: 0 50px;
  border: none;
  color: #fff;
  box-sizing: border-box;
  appearance: none;
  background-color: #3498db;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  font-family: Open Sans, sans-serif;
  font-weight: 700;

    &:focus{
        outline: 0;
        color: #fff;
    }
    &:hover{
        background: linear-gradient(0deg, rgba(52, 152, 219, 1) 0%, rgba(52, 152, 219, 1) 35%,
        rgba(125, 183, 222, 1) 100%);
    }
    &:active{
        box-shadow: inset 2px 3px 6px -2px black;
        background: #2E85C0;
    }
`;