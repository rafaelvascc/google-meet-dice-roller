import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InvalidInputFeedbackText from './InvalidInputFeedbackText.jsx';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { diceRollSetAdded } from '../../reducers/action-creators'
import { isDiceSetNameValid } from '../../models/dice-roll-utils';

const NewDiceRollSetForm = (props) => {
    const dispatch = useDispatch();
    const diceRollCollection = useSelector(state => state);
    const [newDiceRollSetName, setNewDiceRollSetName] = useState('');
    const [newDiceRollSetNameChanged, setNewDiceRollSetNameChanged] = useState(false);
    const [newDiceRollSetNameValid, setNewDiceRollSetNameValid] = useState(true);

    const onBtnConfirmClick = (event) => {
        props.onBtnConfirmClick();
        dispatch(diceRollSetAdded(newDiceRollSetName));
        setNewDiceRollSetNameValid(false);
        setNewDiceRollSetName('');
    }

    const onBtnCancelClick = (event) => {
        props.onBtnCancelClick();
    }

    const onTxtNewDiceRollSetNameChange = (event) => {
        const { value } = event.target;
        !newDiceRollSetNameChanged && setNewDiceRollSetNameChanged(true);
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
        setNewDiceRollSetNameValid(isDiceSetNameValid(diceRollCollection, value));
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
                    isValid={newDiceRollSetNameChanged && newDiceRollSetNameValid}
                />
            </Form.Group>
            <Button variant='outline-success' disabled={!newDiceRollSetNameValid} onClick={onBtnConfirmClick} className='btn-fa-circle-tn btn-form-popover'>
                <FontAwesomeIcon icon={faCheck} />
            </Button>
            <Button variant='outline-warning' onClick={onBtnCancelClick} className='btn-fa-circle-tn btn-form-popover'>
                <FontAwesomeIcon icon={faTimes} />
            </Button>
            <InvalidInputFeedbackText visible={newDiceRollSetNameChanged && !newDiceRollSetNameValid} text="Set name should be unique, not be empty and can't contains dots, white spaces, forward slashes and back slashes" />
        </Form>
    )
}

export default NewDiceRollSetForm;