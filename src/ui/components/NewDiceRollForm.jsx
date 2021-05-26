import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InvalidInputFeedbackText from './InvalidInputFeedbackText.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { diceRollAdded } from '../../reducers/action-creators'
import { isDiceRollLabelValid, isDiceRollCommandValid } from '../../models/dice-roll-utils.js'
import _ from 'lodash';

const NewDiceRollForm = (props) => {
    const dispatch = useDispatch();

    const [diceRollLabel, setDiceRollLabel] = useState('');
    const [diceRollLabelValid, setDiceRollLabelValid] = useState(false);
    const [diceRollLabelChanged, setDiceRollLabelChanged] = useState(false);

    const [diceRollCommand, setDiceRollCommand] = useState('');
    const [diceRollCommandValid, setDiceRollCommandValid] = useState(false);
    const [diceRollCommandChanged, setDiceRollCommandChanged] = useState(false);

    const onBtnConfirmClick = (event) => {
        props.onBtnConfirmClick();
        dispatch(diceRollAdded(props.set.name, diceRollLabel, diceRollCommand));
        resetAddDiceFormState();
    }

    const onBtnCancelClick = (event) => {
        resetAddDiceFormState();
        props.onBtnCancelClick();
    }

    const onTxtAddDiceRollLabelChange = (event) => {
        const { value } = event.target;
        !diceRollLabelChanged && setDiceRollLabelChanged(true);
        setDiceRollLabel(value);
        setDiceRollLabelValid(isDiceRollLabelValid(props.set, value));
    }

    const onTxtAddDiceRollCommandChange = (event) => {
        const { value } = event.target;
        !diceRollCommandChanged && setDiceRollCommandChanged(true);
        setDiceRollCommand(value);
        setDiceRollCommandValid(isDiceRollCommandValid(value));
    }

    const resetAddDiceFormState = () => {
        setDiceRollLabel('');
        setDiceRollCommand('');
        setDiceRollLabelValid(false);
        setDiceRollLabelChanged(false);
        setDiceRollCommandValid(false);
        setDiceRollCommandChanged(false);
    }

    const onFormKeyUp = (event) => {
        if (diceRollLabelValid && diceRollCommandValid && event && event.keyCode == 13) {
            event.stopPropagation();
            event.preventDefault();
            onBtnConfirmClick();
        }
    }

    return (
        <Form onKeyUp={onFormKeyUp} onSubmit={(event) => event.preventDefault()}>
            <Form.Group>
                <Form.Label size="sm">Label</Form.Label>
                <Form.Control
                    isValid={diceRollLabelChanged && diceRollLabelValid}
                    isInvalid={diceRollLabelChanged && !diceRollLabelValid}
                    size="sm"
                    type="text"
                    placeholder="Label"
                    onChange={onTxtAddDiceRollLabelChange}
                    value={diceRollLabel}
                />
                <InvalidInputFeedbackText visible={diceRollLabelChanged && !diceRollLabelValid} text="Dice roll command label should be unique in the set, not be empty, and can´t contain spaces or dots" />
            </Form.Group>
            <Form.Group>
                <Form.Label size="sm">Command</Form.Label>
                <Form.Control
                    isValid={diceRollCommandChanged && diceRollCommandValid}
                    isInvalid={diceRollCommandChanged && !diceRollCommandValid}
                    size="sm"
                    type="text"
                    placeholder="Command"
                    onChange={onTxtAddDiceRollCommandChange}
                    value={diceRollCommand}
                />
                <InvalidInputFeedbackText visible={diceRollCommandChanged && !diceRollCommandValid} text="Dice roll command should be a valid dice roll command, check docs for examples" />
            </Form.Group>
            <Button variant='outline-success' disabled={!diceRollLabelValid || !diceRollCommandValid} onClick={onBtnConfirmClick} className='btn-fa-circle-tn btn-form-popover'>
                <FontAwesomeIcon icon={faCheck} />
            </Button>
            <Button variant='outline-warning' onClick={onBtnCancelClick} className='btn-fa-circle-tn btn-form-popover'>
                <FontAwesomeIcon icon={faTimes} />
            </Button>
        </Form>
    )
}

export default NewDiceRollForm;