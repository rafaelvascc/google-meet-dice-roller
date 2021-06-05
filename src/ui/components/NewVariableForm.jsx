import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InvalidInputFeedbackText from './InvalidInputFeedbackText.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { variableAdded } from '../../reducers/action-creators';
import { isVariableLabelValid, isVariableValid } from '../../models/dice-roll-utils.js';

const NewVariableForm = (props) => {
    const dispatch = useDispatch();

    const [variableLabel, setVariableLabel] = useState('');
    const [variableLabelValid, setVariableLabelValid] = useState(false);
    const [variableLabelChanged, setVariableLabelChanged] = useState(false);

    const [variableExpression, setVariableExpression] = useState('');
    const [variableExpressionValid, setVariableExpressionValid] = useState(false);
    const [variableValidationMessage, setVariableValidationMessage] = useState('');
    const [variableExpressionChanged, setVariableExpressionChanged] = useState(false);

    const onBtnConfirmClick = (event) => {
        props.onBtnConfirmClick();
        dispatch(variableAdded(props.setName, variableLabel, variableExpression));
        resetAddDiceFormState();
    }

    const onBtnCancelClick = (event) => {
        resetAddDiceFormState();
        props.onBtnCancelClick();
    }

    const onTxtAddVariableLabelChange = (event) => {
        const { value } = event.target;
        !variableLabelChanged && setVariableLabelChanged(true);
        setVariableLabel(value);
        setVariableLabelValid(isVariableLabelValid(props.set, value));
    }

    const onTxtAddVariableExpressionChange = (event) => {
        const { value } = event.target;
        !variableExpressionChanged && setVariableExpressionChanged(true);
        setVariableExpression(value);
        var [isValid, validationMessage] = isVariableValid(variableLabel, value, props.set.variables);
        setVariableExpressionValid(isValid);
        if (isValid) {
            setVariableValidationMessage('');
        }
        else {
            setVariableValidationMessage(validationMessage);
        }
    }

    const resetAddDiceFormState = () => {
        setVariableLabel('');
        setVariableExpression('');
        setVariableLabelValid(false);
        setVariableLabelChanged(false);
        setVariableExpressionValid(false);
        setVariableExpressionChanged(false);
    }

    const onFormKeyUp = (event) => {
        if (variableLabelValid && variableExpressionValid && event && event.keyCode == 13) {
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
                    isValid={variableLabelChanged && variableLabelValid}
                    isInvalid={variableLabelChanged && !variableLabelValid}
                    size="sm"
                    type="text"
                    placeholder="Label"
                    onChange={onTxtAddVariableLabelChange}
                    value={variableLabel}
                />
                <InvalidInputFeedbackText visible={variableLabelChanged && !variableLabelValid} text="Variable label should be unique in the set, not be empty, and can´t contain spaces or dots" />
            </Form.Group>
            <Form.Group>
                <Form.Label size="sm">Variable/Expression</Form.Label>
                <Form.Control
                    isValid={variableExpressionChanged && variableExpressionValid}
                    isInvalid={variableExpressionChanged && !variableExpressionValid}
                    size="sm"
                    rows={6}
                    as="textarea"
                    placeholder="Variable/Expression"
                    onChange={onTxtAddVariableExpressionChange}
                    value={variableExpression}
                />
                <InvalidInputFeedbackText visible={variableExpressionChanged && !variableExpressionValid} text={variableValidationMessage || "Variable expression should be a valid number or expression, check docs for examples"} />
            </Form.Group>
            <Button variant='outline-success' disabled={!variableLabelValid || !variableExpressionValid} onClick={onBtnConfirmClick} className='btn-fa-circle-tn btn-form-popover'>
                <FontAwesomeIcon icon={faCheck} />
            </Button>
            <Button variant='outline-warning' onClick={onBtnCancelClick} className='btn-fa-circle-tn btn-form-popover'>
                <FontAwesomeIcon icon={faTimes} />
            </Button>
        </Form>
    )
}

export default NewVariableForm;