import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { diceRollSetAdded } from '../../reducers/action-creators'

const NewDiceRollSetForm = (props) => {
    const dispatch = useDispatch();
    const diceRollCollection = useSelector(state => state);
    const [newDiceRollSetName, setNewDiceRollSetName] = useState('');
    const [newDiceRollSetNameValid, setNewDiceRollSetNameValid] = useState(true);

    const onBtnConfirmClick = (event) => {
        props.onBtnConfirmClick();
        dispatch(diceRollSetAdded(newDiceRollSetName));
        setNewDiceRollSetName('');
        setNewDiceRollSetNameValid(false);
    }

    const onBtnCancelClick = (event) => {
        props.onBtnCancelClick();
    }

    const onTxtNewDiceRollSetNameChange = (event) => {
        const { value } = event.target;
        setNewDiceRollSetName(value);
    }

    const onFormKeyUp = (event) => {
        if (newDiceRollSetNameValid && event && event.keyCode == 13) {
            event.stopPropagation();
            event.preventDefault();
            onBtnConfirmClick();
        }
    }

    const validateNewDiceRollSetName = (value) => {
        //Early exit
        if (!value) {
            setNewDiceRollSetNameValid(false);
            return;
        }

        const isUnique = !hasDiceRollSet(value);
        setNewDiceRollSetNameValid(isUnique);
    }

    const hasDiceRollSet = (name) => {
        return diceRollCollection.some(e => {
            return e.name.toLowerCase().trim() === name.toLowerCase().trim();
        });
    }

    useEffect(() => {
        validateNewDiceRollSetName(newDiceRollSetName);
    },
        [newDiceRollSetName, diceRollCollection]);

    return (
        <Form onKeyUp={onFormKeyUp} onSubmit={(event) => event.preventDefault()} inline>
            <Form.Group controlId="txtNewDiceRollSetName">
                <Form.Control
                    style={{ width: "150px" }}
                    required
                    size='sm'
                    placeholder='Set Name'
                    value={newDiceRollSetName}
                    onChange={onTxtNewDiceRollSetNameChange}
                    isValid={newDiceRollSetNameValid}
                />
                <Form.Control.Feedback type='invalid'>Set name should be unique and not be empty</Form.Control.Feedback>
            </Form.Group>
            <Button variant='outline-success' disabled={!newDiceRollSetNameValid} onClick={onBtnConfirmClick} className='btn-fa-circle-tn btn-form-popover'>
                <FontAwesomeIcon icon={faCheck} />
            </Button>
            <Button variant='outline-warning' onClick={onBtnCancelClick} className='btn-fa-circle-tn btn-form-popover'>
                <FontAwesomeIcon icon={faTimes} />
            </Button>
        </Form>
    )
}

export default NewDiceRollSetForm;