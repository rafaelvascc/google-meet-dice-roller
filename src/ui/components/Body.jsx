import React, { useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Popover from 'react-bootstrap/Popover';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'

const Body = () => {
    const [newSetFormValid, setNewSetFormValid] = useState(false);

    const popover = (
        <Popover id='popover-basic'>
            <Popover.Title as='h3'>New Dice Rolling Set</Popover.Title>
            <Popover.Content>
                <Form inline>
                    <Form.Control
                        required
                        size='sm'
                        placeholder='Set Name'
                    />                    
                    <Button size='sm' variant='outline-success' className='btn-fa-circle-sm btn-form-popover'><FontAwesomeIcon icon={faCheck} /></Button>
                    <Button size='sm' variant='outline-warning' className='btn-fa-circle-sm btn-form-popover'><FontAwesomeIcon icon={faTimes} /></Button>
                </Form>
            </Popover.Content>
        </Popover>
    );

    return (
        <>
            <Navbar bg='light' className='justify-content-between'>
                <Navbar.Brand>My dice rolling sets</Navbar.Brand>
                <OverlayTrigger trigger='click' placement='bottom' overlay={popover}>
                    <Button className='btn-fa-circle-sm'><FontAwesomeIcon icon={faPlus} /></Button>
                </OverlayTrigger>
            </Navbar>
        </>
    )
}

export default Body;