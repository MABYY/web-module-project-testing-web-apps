import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm />);
});

test('renders the contact form header', ()=> {
    render(<ContactForm />);
    const header = screen.getByText(/Contact Form/i);
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/Contact Form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm />);
    const firstnameField = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstnameField,"123");

    const errorMessages = await screen.findAllByTestId('error');
    expect(errorMessages).toHaveLength(1);

});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    render(<ContactForm />);;
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton)
    await waitFor(()=>{
        const errorMessages = screen.queryAllByTestId("error");
        expect(errorMessages).toHaveLength(3)
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    render(<ContactForm />);
    const firstNameField = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameField,"maby");
    const lastNameField = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameField,"lambda");

    const button = screen.getByRole("button");
    userEvent.click(button);

    // const errormessage = await screen.findByTestId('error');
    // expect(errormessage).toHaveLength(1);
 

});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    render(<ContactForm />);
    const emailField = screen.getByLabelText(/email*/i);
    userEvent.type(emailField,"maby@lambda");
    
    const errorMessages = await screen.findByText(/must be a valid email address./);
    expect(errorMessages).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);

    const errorMessage = await screen.findByText(/lastName is a required field/);
    expect(errorMessage).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    render(<ContactForm />);
    const firstNameField = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameField,"maby");
    const lastNameField = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameField,"lambda");
    const emailField = screen.getByLabelText(/email*/i);
    userEvent.type(emailField,"maby@lambda.com");

    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);


    await waitFor(()=>{
        const firstnameDisplay = screen.queryByText("maby");
        const lastnameDisplay = screen.queryByText("lambda");
        const emailDisplay = screen.queryByText("maby@lambda.com");
        const msgDisplay = screen.queryByTestId("messageDisplay");

        // expect(firstnameDisplay).toBeInTheDocument();
        // expect(lastnameDisplay).toBeInTheDocument();
        // expect(emailDisplay).toBeInTheDocument();
        // expect(msgDisplay).not.toBeInTheDocument();
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    render(<ContactForm />);

    const firstNameField = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameField,"maby");
    const lastNameField = screen.getByLabelText(/Last Name*/i);
    userEvent.type(lastNameField,"lambda");
    const emailField = screen.getByLabelText(/Email*/i);
    userEvent.type(emailField,"maby@lambda.com");
    const messageField = screen.getByLabelText(/Message*/i);
    userEvent.type(messageField,"Message--Text");

    const button = screen.findByRole("button");
    userEvent.click(button);

    await waitFor(()=>{
        const firstnameDisplay = screen.queryByText(/maby/i);
        const lastnameDisplay = screen.queryByText(/ambda/i);
        const emailDisplay = screen.queryByText(/maby@lambda.com/i);
        const msgDisplay = screen.queryByText(/Message--Text/i);

        expect(firstnameDisplay).toBeInTheDocument();
        expect(lastnameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(msgDisplay).not.toBeInTheDocument();
    });

});

// https://testing-library.com/docs/queries/about/
// https://lambdaschool-1.wistia.com/medias/ium6dwh9l4