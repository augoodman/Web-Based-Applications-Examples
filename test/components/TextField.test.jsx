import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { TextField } from "../../src/components";
import userEvent from "@testing-library/user-event";


describe('<TextField />', function () {
    it('should render', function () {
        render(<TextField />);
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
    it('should render given value', function () {
        render(<TextField value="Hello"/>);
        expect(screen.getByRole('textbox')).toHaveProperty('value', 'Hello');
    });
    it('should use callback when user inputs text', async function () {
        const callback = jest.fn((value)=>{
            expect(value).toStrictEqual('a');
        });
        render(<TextField onChange={callback} />);
        await act(()=>userEvent.type(screen.getByRole('textbox'), 'a'));
        expect(callback).toHaveBeenCalled();
    });
    it('should render a given label', function () {
        render(<TextField label="This is a label" />);
        expect(screen.getByText('This is a label')).toBeInTheDocument();
    });
    it('should render with style', function () {
        render(<TextField />);
        expect(screen.getByRole('textbox')).toHaveStyle(`
            border-radius: 5px;
            height: 50px;
            min-width: 218px;
            width: 100%;
            outline: 0;
            box-shadow: inset 0 0 0 1px #CCC;
            font-family: Open Sans,sans-serif;
            font-size: 16px;
            font-weight: 700;
            color: #555;
            padding: 0 8px;
            display: block;
        `);
    });
    it('should render a margin top of 3px when provided a label', function () {
        render(<TextField label="Whatever" />);
        expect(screen.getByRole('textbox')).toHaveStyle(`
            margin-top: 3px;
        `);
    });
});