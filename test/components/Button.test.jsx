import React from 'react';
import {act, fireEvent, render, screen, waitFor} from '@testing-library/react';
import {Button} from "../../src/components";
import userEvent from "@testing-library/user-event";


describe('<Button />', function () {
    it('should render', () => {
        render(<Button />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
    it('should render given text', function () {
        render(<Button value='text'/>);
        expect(screen.getByRole('button')).toHaveTextContent('text');
    });
    it('should use callback when user pushes button', async () => {
        const callback = jest.fn();
        render(<Button onClick={callback} value='text'/>);
        userEvent.click(screen.getByRole('button'));
        await expect(callback).toHaveBeenCalled();
    });
    it('should render with style', function () {
        render(<Button />);
        expect(screen.getByRole('button')).toHaveStyle(`
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
          font-family: Open Sans,sans-serif;
          font-weight: 700;
        `);
    });
});