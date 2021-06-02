import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonWithTolltip from './ButtonWithTolltip.jsx';
import InvalidInputFeedbackText from './InvalidInputFeedbackText.jsx';
import FormPopoverContainer from './FormPopoverContainer.jsx';
import { faEdit, faCheck, faTimes, faMinus, faDice } from '@fortawesome/free-solid-svg-icons';
import DeleteConfirmationForm from './DeleteConfirmationForm.jsx';
import { isDiceRollLabelValid, isDiceRollCommandValid } from '../../models/dice-roll-utils.js'
import { useDispatch } from 'react-redux';
import { diceRollEdited, diceRollDeleted } from '../../reducers/action-creators';
import DiceRollResultSet from '../../models/dice-roll-result-set';
import { store } from 'react-notifications-component';

const UserDiceRollItemForm = (props) => {
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);

    const [label, setLabel] = useState(props.label);
    const [command, setCommad] = useState(props.command);
    const [prevLabel, setPrevLabel] = useState(props.label);
    const [prevCommand, setPrevCommad] = useState(props.command);

    const [isLabelValid, setIsLabelValid] = useState(true);
    const [isCommandValid, setIsCommandValid] = useState(true);
    const [commandValidationMessage, setCommandValidationMessage] = useState('');
    const [didLabelChange, setDidLabelChange] = useState(false);
    const [didCommandChange, setDidCommandChange] = useState(false);

    const btnDeleteRef = useRef(null);

    const [removeDiceRollPopOverVisible, setRemoveDiceRollPopOverVisible] = useState(false);

    const onBtnEditClick = (event) => {
        setPrevLabel(label);
        setPrevCommad(command);
        setDidLabelChange(false);
        setDidCommandChange(false);
        setIsEditing(true);
    }

    const onBtnConfirmClick = (event) => {
        dispatch(diceRollEdited(props.setName, prevLabel, label, command));
        setPrevLabel(label);
        setPrevCommad(command);
        setDidLabelChange(false);
        setDidCommandChange(false);
        setIsEditing(false);
    }

    const onBtnCancelClick = (event) => {
        setLabel(prevLabel);
        setCommad(prevCommand);
        setDidLabelChange(false);
        setDidCommandChange(false);
        setIsEditing(false);
    }

    const onBtnRollClick = (event) => {
        if (chrome && chrome.tabs) {
            chrome.tabs.query({
                active: true,
                currentWindow: true,
                url: "*://meet.google.com/*"
            }, tabs => {
                if (tabs.length > 0) {
                    var firstMeetTabId = tabs[0].id;
                    chrome.tabs.sendMessage(firstMeetTabId, {
                        type: "onBtnRollClick",
                        payload: `${props.setName}.${label}`
                    });
                }
                else {
                    showRollDiceResultOnAPopup();
                }
            })
        }
        else {
            showRollDiceResultOnAPopup();
        }
    }

    const showRollDiceResultOnAPopup = () => {
        const cmd = props.set.commands[label];
        const variables = props.set.variables;
        const result = DiceRollResultSet.fromUserCommandLine(cmd, variables);
        const strResult = result.asPresentationString(`${props.setName}.${label}`, true);
        store.addNotification({
            title: `${props.setName}.${label}`,
            message: strResult,
            type: "info",
            insert: "top",
            container: "top-right",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 15000,
                onScreen: true
            }
        });
    }

    const onLabelChange = (event) => {
        const { value } = event.target;
        setLabel(value);
        !didLabelChange && setDidLabelChange(true);
        setIsLabelValid(isDiceRollLabelValid(props.set, value, prevLabel));
    }

    const onCommandChange = (event) => {
        const { value } = event.target;
        setCommad(value);
        !didCommandChange && setDidCommandChange(true);
        const [isCommandValid, validationMessage] = isDiceRollCommandValid(value);
        setIsCommandValid(isCommandValid);
        if (isCommandValid) {
            setCommandValidationMessage('');
        }
        else {
            setCommandValidationMessage(validationMessage);
        }
    }

    const onFormKeyUp = (event) => {
        if (isLabelValid && isCommandValid && isEditing && event && event.keyCode == 13) {
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
                    <InvalidInputFeedbackText visible={didLabelChange && !isLabelValid} text="Dice roll command label should be unique in the set, not be empty, and can't contain spaces or dots" />
                </Form.Group>
                <Form.Group as={Col} sm={6} style={{ marginBottom: "5px" }}>
                    <Form.Control
                        size="sm"
                        isValid={didCommandChange && isCommandValid}
                        isInvalid={didCommandChange && !isCommandValid}
                        type="text"
                        disabled={!isEditing}
                        value={command}
                        onChange={onCommandChange}
                    />
                    <InvalidInputFeedbackText visible={didCommandChange && !isCommandValid} text={commandValidationMessage || "Dice roll command should be a valid dice roll command, check docs for examples"} />
                </Form.Group>
                {isEditing ?
                    (
                        <ButtonGroup style={{ marginLeft: "9px" }}>
                            <ButtonWithTolltip
                                disabled={!isLabelValid || !isCommandValid}
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
                                onClick={onBtnRollClick}
                                variant="primary"
                                faIcon={faDice}
                                faStyle={{ fontSize: "16px" }}
                                tooltipText={"Roll dice!"}
                            />
                            <ButtonWithTolltip
                                style={{ marginRight: "5px" }}
                                onClick={onBtnEditClick}
                                variant="success"
                                faIcon={faEdit}
                                faStyle={{ fontSize: "16px" }}
                                tooltipText={"Click to edit this dice roll command"}
                            />
                            <ButtonWithTolltip
                                showTooltip={!removeDiceRollPopOverVisible}
                                getRefFunc={(ref) => btnDeleteRef.current = ref.current}
                                onClick={() => setRemoveDiceRollPopOverVisible(!removeDiceRollPopOverVisible)}
                                variant="danger"
                                faIcon={faMinus}
                                tooltipText={"Click to remove this dice roll command"}
                            />
                            <FormPopoverContainer ref={btnDeleteRef} show={removeDiceRollPopOverVisible} title="Remove Dice Roll Command">
                                <DeleteConfirmationForm
                                    onBtnConfirmClick={() => {
                                        setRemoveDiceRollPopOverVisible(false);
                                        dispatch(diceRollDeleted(props.setName, label));
                                    }}
                                    onBtnCancelClick={() => setRemoveDiceRollPopOverVisible(false)}
                                />
                            </FormPopoverContainer>
                        </ButtonGroup>
                    )
                }
            </Form.Row>
        </Form>
    )
}

export default UserDiceRollItemForm;