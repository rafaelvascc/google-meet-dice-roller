import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import Popover from 'react-bootstrap/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faCheck, faTimes, faMinus } from '@fortawesome/free-solid-svg-icons';
import DeleteConfirmationForm from './DeleteConfirmationForm.jsx';
import { isDiceRollLabelValid, isDiceRollCommandValid } from '../../models/dice-roll-utils.js'
import { useDispatch } from 'react-redux';
import { diceRollEdited, diceRollDeleted } from '../../reducers/action-creators'

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

    const [editTooltipVisible, setEditTooltipVisible] = useState(false);
    const [deleteTooltipVisible, setDeleteTooltipVisible] = useState(false);
    const [confirmEditTooltipVisible, setConfirmEditTooltipVisible] = useState(false);
    const [cancelEditTooltipVisible, setCancelEditTooltipVisible] = useState(false);

    const btnEditRef = useRef(null);
    const btnDeleteRef = useRef(null);
    const btnConfirmRef = useRef(null);
    const btnCancelRef = useRef(null);
    const btnEditTooltipTimeoutRef = useRef(null);
    const btnDeleteTooltipTimeoutRef = useRef(null);
    const btnConfirmTooltipTimeoutRef = useRef(null);
    const btnCancelTooltipTimeoutRef = useRef(null);

    const [removeDiceRollPopOverVisible, setRemoveDiceRollPopOverVisible] = useState(false);

    const onBtnMouseEnter = (tooltipTimeoutRef, setTooltipVisibleFunc) => {
        tooltipTimeoutRef.current = setTimeout(() => {
            setTooltipVisibleFunc(true);
        }, 300);
    }

    const onBtnMouseLeave = (tooltipTimeoutRef) => {
        if (tooltipTimeoutRef.current) {
            clearTimeout(tooltipTimeoutRef.current);
        }
        hideAllToolTips();
    }

    const onBtnEditClick = (event) => {
        hideAllToolTips();
        setPrevLabel(label);
        setPrevCommad(command);
        setDidLabelChange(false);
        setDidCommandChange(false);
        setIsEditing(true);
    }

    const onBtnDeleteClick = (event) => {
        hideAllToolTips();
        setRemoveDiceRollPopOverVisible(!removeDiceRollPopOverVisible);
    }

    const onBtnConfirmClick = (event) => {
        hideAllToolTips();
        dispatch(diceRollEdited(props.set.name, prevLabel, label, command));
        setPrevLabel(label);
        setPrevCommad(command);
        setDidLabelChange(false);
        setDidCommandChange(false);
        setIsEditing(false);
    }

    const onBtnCancelClick = (event) => {
        hideAllToolTips();
        setLabel(prevLabel);
        setCommad(prevCommand);
        setDidLabelChange(false);
        setDidCommandChange(false);
        setIsEditing(false);
    }

    const onLabelChange = (event) => {
        const { value } = event.target;
        setLabel(value);
        if (!didLabelChange) {
            setDidLabelChange(true);
        }
        setIsLabelValid(isDiceRollLabelValid(props.set, value, prevLabel));
    }

    const onCommandChange = (event) => {
        const { value } = event.target;
        setCommad(value);
        if (!didCommandChange) {
            setDidCommandChange(true);
        }
        setIsCommandValid(isDiceRollCommandValid(value));
    }

    const hideAllToolTips = () => {
        setEditTooltipVisible(false);
        setDeleteTooltipVisible(false);
        setConfirmEditTooltipVisible(false);
        setCancelEditTooltipVisible(false);
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
                <Form.Group as={Col} sm={4} controlId="diceLabel" style={{marginBottom: "5px"}}>
                    <Form.Control
                        size="sm"
                        isValid={didLabelChange && isLabelValid}
                        isInvalid={didLabelChange && !isLabelValid}
                        type="text"
                        disabled={!isEditing}
                        value={label}
                        onChange={onLabelChange}
                    />
                    <div style={didLabelChange && !isLabelValid ? { "display": "block" } : { "display": "none" }} className='invalid-feedback'>Dice roll command label should be unique in the set, not be empty, and can't contain spaces or dots</div>
                </Form.Group>
                <Form.Group as={Col} sm={6} controlId="diceCmd" style={{marginBottom: "5px"}}>
                    <Form.Control
                        size="sm"
                        isValid={didCommandChange && isCommandValid}
                        isInvalid={didCommandChange && !isCommandValid}
                        type="text"
                        disabled={!isEditing}
                        value={command}
                        onChange={onCommandChange}
                    />
                    <div style={didCommandChange && !isCommandValid ? { "display": "block" } : { "display": "none" }} className='invalid-feedback'>Dice roll command should be a valid dice roll command, check docs for examples</div>
                </Form.Group>
                {isEditing ?
                    (
                        <>
                            <ButtonGroup>
                                <Button
                                    size="sm"   
                                    disabled={!isLabelValid || !isCommandValid}
                                    ref={btnConfirmRef}
                                    style={{ marginRight: "5px" }}
                                    onClick={onBtnConfirmClick}
                                    onMouseEnter={(event) => onBtnMouseEnter(btnConfirmTooltipTimeoutRef, setConfirmEditTooltipVisible)}
                                    onMouseLeave={(event) => onBtnMouseLeave(btnConfirmTooltipTimeoutRef)}
                                    onBlur={(event) => onBtnMouseLeave(btnConfirmTooltipTimeoutRef)}
                                    variant="success"
                                    className='btn-fa-circle-sm'>
                                    <FontAwesomeIcon icon={faCheck} />
                                </Button>
                                <Button
                                    size="sm"
                                    ref={btnCancelRef}
                                    style={{ marginRight: "5px" }}
                                    onClick={onBtnCancelClick}
                                    onMouseEnter={(event) => onBtnMouseEnter(btnCancelTooltipTimeoutRef, setCancelEditTooltipVisible)}
                                    onMouseLeave={(event) => onBtnMouseLeave(btnCancelTooltipTimeoutRef)}
                                    onBlur={(event) => onBtnMouseLeave(btnCancelTooltipTimeoutRef)}
                                    variant="warning"
                                    className='btn-fa-circle-sm'>
                                    <FontAwesomeIcon icon={faTimes} />
                                </Button>
                            </ButtonGroup>
                            <Overlay target={btnConfirmRef.current} show={confirmEditTooltipVisible} placement="bottom">
                                {(props) => <Tooltip id="confirm-edit-dice-roll-tooltip" {...props}>Confirm edit</Tooltip>}
                            </Overlay>
                            <Overlay target={btnCancelRef.current} show={cancelEditTooltipVisible} placement="bottom">
                                {(props) => <Tooltip id="cancel-edit-dice-roll-tooltip" {...props}>Cancel edit</Tooltip>}
                            </Overlay>
                        </>
                    ) :
                    (
                        <>
                            <ButtonGroup>
                                <Button
                                    size="sm"
                                    ref={btnEditRef}
                                    style={{ marginRight: "5px"}}
                                    onClick={onBtnEditClick}
                                    onMouseEnter={(event) => onBtnMouseEnter(btnEditTooltipTimeoutRef, setEditTooltipVisible)}
                                    onMouseLeave={(event) => onBtnMouseLeave(btnEditTooltipTimeoutRef)}
                                    onBlur={(event) => onBtnMouseLeave(btnEditTooltipTimeoutRef)}
                                    variant="success"
                                    className='btn-fa-circle-sm'>
                                    <FontAwesomeIcon icon={faEdit} style={{ fontSize: "16px" }}/>
                                </Button>
                                <Button 
                                    size="sm"
                                    ref={btnDeleteRef}
                                    style={{ marginRight: "5px" }}
                                    onClick={onBtnDeleteClick}
                                    onMouseEnter={(event) => onBtnMouseEnter(btnDeleteTooltipTimeoutRef, setDeleteTooltipVisible)}
                                    onMouseLeave={(event) => onBtnMouseLeave(btnDeleteTooltipTimeoutRef)}
                                    onBlur={(event) => onBtnMouseLeave(btnDeleteTooltipTimeoutRef)}
                                    variant="danger"
                                    className='btn-fa-circle-sm'>
                                    <FontAwesomeIcon icon={faMinus} />
                                </Button>
                            </ButtonGroup>
                            <Overlay target={btnEditRef.current} show={editTooltipVisible} placement="bottom">
                                {(props) => <Tooltip id="edit-dice-roll-tooltip" {...props}>Click to edit this dice roll command</Tooltip>}
                            </Overlay>
                            <Overlay target={btnDeleteRef.current} show={deleteTooltipVisible && !removeDiceRollPopOverVisible} placement="bottom">
                                {(props) => <Tooltip id="delete-dice-roll-tooltip" {...props}>Click to remove this dice roll command</Tooltip>}
                            </Overlay>
                            <Overlay target={btnDeleteRef.current} show={removeDiceRollPopOverVisible} placement="bottom">
                                {(props) => removeDiceRollPopover(props)}
                            </Overlay>
                        </>
                    )
                }
            </Form.Row>
        </Form>
    )
}

export default UserDiceRollItemForm;