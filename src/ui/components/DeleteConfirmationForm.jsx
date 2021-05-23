import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const DeleteConfirmationForm = (props) => {
    const onBtnConfirmClick = (event) => {
        props.onBtnConfirmClick();
    }

    const onBtnCancelClick = (event) => {
        props.onBtnCancelClick();
    }

    return (
        <Form inline>
            <Form.Label>Confirm Remove?</Form.Label>
            <Button variant='outline-success' onClick={onBtnConfirmClick} className='btn-fa-circle-tn btn-form-popover'>
                <FontAwesomeIcon icon={faCheck} />
            </Button>
            <Button variant='outline-warning' onClick={onBtnCancelClick} className='btn-fa-circle-tn btn-form-popover'>
                <FontAwesomeIcon icon={faTimes} />
            </Button>
        </Form>
    )
}

export default DeleteConfirmationForm;