import React from 'react';
import styled from 'styled-components';

export const TextField = (props) => {
    return <label>
        {props.label}
        <Input
            value={props.value}
            onChange={(e) => props.onChange && props.onChange(e.target.value)}
            hasLabel={!!props.label}
        />
    </label>;
};

TextField.defaultProps = {
    onChange: ()=>{}
};

const Input = styled.input`
    border-radius: 5px;
    height: 50px;
    min-width: 218px;
    width: 100%;
    outline: 0;
    border: none;
    box-shadow: inset 0 0 0 1px #CCC;
    font-family: Open Sans, sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #555;
    padding: 0 8px;
    display: block;
    ${props => props.hasLabel && 'margin-top: 3px;'}
    
    &:focus {
        outline: 0;
        box-shadow: 0 0 5px 3px #cce0ff;
        background-color: #e8f1ff;
    }
`;
