import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonWithTolltip from './ButtonWithTolltip.jsx';
import InvalidInputFeedbackText from './InvalidInputFeedbackText.jsx';
import FormPopoverContainer from './FormPopoverContainer.jsx';
import { faEdit, faCheck, faTimes, faMinus } from '@fortawesome/free-solid-svg-icons';
import DeleteConfirmationForm from './DeleteConfirmationForm.jsx';
import { isVariableLabelValid, isVariableValid, areAllVariablesValid } from '../../models/dice-roll-utils.js'
import { useDispatch } from 'react-redux';
import { variableEdited, variableDeleted } from '../../reducers/action-creators';

const UserVariableForm = (props) => {
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);

    const [label, setLabel] = useState(props.label);
    const [variableExpression, setVariable] = useState(props.expression);
    const [prevLabel, setPrevLabel] = useState(props.label);
    const [prevVariableExpression, setPrevCommad] = useState(props.expression);

    const [isLabelValid, setIsLabelValid] = useState(true);
    const [isVariableExpressionValid, setIsVariableExpressionValid] = useState(true);
    const [didLabelChange, setDidLabelChange] = useState(false);
    const [didVariableExpressionChange, setDidVariableExpressionChange] = useState(false);
    const [variableValidationMessage, setVariableValidationMessage] = useState('');

    const btnDeleteRef = useRef(null);

    const [removeVariableExpressionPopOverVisible, setRemoveVariableExpressionPopOverVisible] = useState(false);

    const onBtnEditClick = (event) => {
        setPrevLabel(label);
        setPrevCommad(variableExpression);
        setDidLabelChange(false);
        setDidVariableExpressionChange(false);
        setIsEditing(true);
    }

    const onBtnConfirmClick = (event) => {
        dispatch(variableEdited(props.setName, prevLabel, label, variableExpression));
        setPrevLabel(label);
        setPrevCommad(variableExpression);
        setDidLabelChange(false);
        setDidVariableExpressionChange(false);
        setIsEditing(false);
    }

    const onBtnCancelClick = (event) => {
        setLabel(prevLabel);
        setVariable(prevVariableExpression);
        setDidLabelChange(false);
        setDidVariableExpressionChange(false);
        setIsEditing(false);
    }

    const onLabelChange = (event) => {
        const { value } = event.target;
        setLabel(value);
        !didLabelChange && setDidLabelChange(true);
        setIsLabelValid(isVariableLabelValid(props.set, value, prevLabel));
    }

    const onVariableExpressionChange = (event) => {
        const { value } = event.target;
        setVariable(value);
        !didVariableExpressionChange && setDidVariableExpressionChange(true);
        var [isValid, validationMessage] = isVariableValid(label, value, props.set.variables);
        setIsVariableExpressionValid(isValid);
        if (isValid) {
            setVariableValidationMessage('');
        }
        else {
            setVariableValidationMessage(validationMessage);
        }
    }

    const onFormKeyUp = (event) => {
        if (isLabelValid && isVariableExpressionValid && isEditing && event && event.keyCode == 13) {
            event.stopPropagation();
            event.preventDefault();
            onBtnConfirmClick();
        }
    }

    return (
        <Form onKeyUp={onFormKeyUp} onSubmit={(event) => event.preventDefault()}>
            <Form.Row>
                <Form.Group as={Col} sm={4} style={{ marginBottom: "5px" }}>
                    <Form.Control
                        size="sm"
                        isValid={didLabelChange && isLabelValid}
                        isInvalid={didLabelChange && !isLabelValid}
                        type="text"
                        disabled={!isEditing}
                        value={label}
                        onChange={onLabelChange}
                    />
                    <InvalidInputFeedbackText visible={didLabelChange && !isLabelValid} text="Variable label should be unique in the set, not be empty, and can´t contain spaces or dots" />
                </Form.Group>
                <Form.Group as={Col} sm={6} style={{ marginBottom: "5px" }}>
                    <Form.Control
                        size="sm"
                        isValid={didVariableExpressionChange && isVariableExpressionValid}
                        isInvalid={didVariableExpressionChange && !isVariableExpressionValid}
                        type="text"
                        disabled={!isEditing}
                        value={variableExpression}
                        onChange={onVariableExpressionChange}
                    />
                    <InvalidInputFeedbackText visible={didVariableExpressionChange && !isVariableExpressionValid} text={variableValidationMessage || "Variable expression should be a valid number or expression, check docs for examples"} />
                </Form.Group>
                {isEditing ?
                    (
                        <ButtonGroup style={{ marginLeft: "9px" }}>
                            <ButtonWithTolltip
                                disabled={!isLabelValid || !isVariableExpressionValid}
                                style={{ marginRight: "5px" }}
                                onClick={onBtnConfirmClick}
                                variant="success"
                                faIcon={faCheck}
                                tooltipText={"Confirm edit"}
                            />
                            <ButtonWithTolltip
                                onClick={onBtnCancelClick}
                                variant="warning"
                                faIcon={faTimes}
                                tooltipText={"Cancel edit"}
                            />
                        </ButtonGroup>
                    ) :
                    (
                        <ButtonGroup style={{ marginLeft: "9px" }}>
                            <ButtonWithTolltip
                                style={{ marginRight: "5px" }}
                                onClick={onBtnEditClick}
                                variant="success"
                                faIcon={faEdit}
                                faStyle={{ fontSize: "16px" }}
                                tooltipText={"Click to edit this dice roll variableExpression"}
                            />
                            <ButtonWithTolltip
                                showTooltip={!removeVariableExpressionPopOverVisible}
                                getRefFunc={(ref) => btnDeleteRef.current = ref.current}
                                onClick={() => setRemoveVariableExpressionPopOverVisible(!removeVariableExpressionPopOverVisible)}
                                variant="danger"
                                faCrudIcon={faMinus}
                                faIcon={null}
                                customIcon={
                                    <svg width="20" height="20" className="svg-inline--fa fa-plus fa-w-14 fa-stack-1x fa-inverse" style={{ position: "absolute", right: "-13px" }}>
                                        <g>
                                            <text
                                                transform="matrix(0.983003 0 0 1.18038 0.00212464 -0.451036)"
                                                stroke="#000"
                                                strokeWidth="0"
                                                fontStyle="italic"
                                                fontWeight="bold"
                                                textAnchor="start"
                                                fontFamily="serif"
                                                fontSize="14"
                                                y="12.50646"
                                                x="0.18556"
                                                fill="#ffffff">
                                                (X)
                                                </text>
                                        </g>
                                    </svg>
                                }
                                tooltipText={"Click to remove this dice roll variableExpression"}
                            />
                            <FormPopoverContainer ref={btnDeleteRef} show={removeVariableExpressionPopOverVisible} title="Remove Dice Roll VariableExpression">
                                <DeleteConfirmationForm
                                    onBtnConfirmClick={() => {
                                        setRemoveVariableExpressionPopOverVisible(false);
                                        dispatch(variableDeleted(props.setName, label));
                                    }}
                                    onBtnCancelClick={() => setRemoveVariableExpressionPopOverVisible(false)}
                                />
                            </FormPopoverContainer>
                        </ButtonGroup>
                    )
                }
            </Form.Row>
        </Form>
    )
}

export default UserVariableForm;