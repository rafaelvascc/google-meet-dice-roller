import React, { useState, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonWithTolltip from './ButtonWithTolltip.jsx';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import InvalidInputFeedbackText from './InvalidInputFeedbackText.jsx';
import { faEdit, faCheck, faTimes, faMinus, faDice } from '@fortawesome/free-solid-svg-icons';
import DeleteConfirmationForm from './DeleteConfirmationForm.jsx';
import { isDiceRollLabelValid, isDiceRollCommandValid } from '../../models/dice-roll-utils.js'
import { useDispatch } from 'react-redux';
import { diceRollEdited, diceRollDeleted } from '../../reducers/action-creators';

const UserDiceRollItemForm = (props) => {
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);

    const [label, setLabel] = useState(props.item.label);
    const [command, setCommad] = useState(props.item.command);
    const [prevLabel, setPrevLabel] = useState(props.item.label);
    const [prevCommand, setPrevCommad] = useState(props.item.command);

    const [isLabelValid, setIsLabelValid] = useState(true);
    const [isCommandValid, setIsCommandValid] = useState(true);
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
        dispatch(diceRollEdited(props.set.name, prevLabel, label, command));
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
                        payload: `${props.set.name}.${label}`
                    });
                }
            })
        }
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
        setIsCommandValid(isDiceRollCommandValid(value));
    }

    const onFormKeyUp = (event) => {
        if (isLabelValid && isCommandValid && isEditing && event && event.keyCode == 13) {
            event.stopPropagation();
            event.preventDefault();
            onBtnConfirmClick();
        }
    }

    const removeDiceRollPopover = (innerProps) => (
        <Popover onClick={(event) => event.stopPropagation()} id='popover-basic' {...innerProps}>
            <Popover.Title as='h3'>Remove Dice Roll Command</Popover.Title>
            <Popover.Content>
                <DeleteConfirmationForm
                    onBtnConfirmClick={() => {
                        setRemoveDiceRollPopOverVisible(false);
                        dispatch(diceRollDeleted(props.set.name, label));
                    }}
                    onBtnCancelClick={() => setRemoveDiceRollPopOverVisible(false)} />
            </Popover.Content>
        </Popover>
    );

    return (
        <Form onKeyUp={onFormKeyUp} onSubmit={(event) => event.preventDefault()}>
            <Form.Row>
                <Form.Group as={Col} sm={4} controlId="diceLabel" style={{ marginBottom: "5px" }}>
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
                <Form.Group as={Col} sm={6} controlId="diceCmd" style={{ marginBottom: "5px" }}>
                    <Form.Control
                        size="sm"
                        isValid={didCommandChange && isCommandValid}
                        isInvalid={didCommandChange && !isCommandValid}
                        type="text"
                        disabled={!isEditing}
                        value={command}
                        onChange={onCommandChange}
                    />
                    <InvalidInputFeedbackText visible={didCommandChange && !isCommandValid} text="Dice roll command should be a valid dice roll command, check docs for examples" />
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
                            <Overlay target={btnDeleteRef.current} show={removeDiceRollPopOverVisible} placement="bottom">
                                {(props) => removeDiceRollPopover(props)}
                            </Overlay>
                        </ButtonGroup>
                    )
                }
            </Form.Row>
        </Form>
    )
}

export default UserDiceRollItemForm;