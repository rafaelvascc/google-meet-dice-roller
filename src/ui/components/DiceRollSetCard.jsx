import React, { useState, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Accordion from 'react-bootstrap/Accordion';
import Popover from 'react-bootstrap/Popover';
import Tooltip from 'react-bootstrap/Tooltip';
import Overlay from 'react-bootstrap/Overlay';
import Card from 'react-bootstrap/Card';
import UserDiceRollItemForm from './UserDiceRollItemForm.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import NewDiceRollForm from './NewDiceRollForm.jsx';
import DeleteConfirmationForm from './DeleteConfirmationForm.jsx'
import { useDispatch } from 'react-redux';
import { diceRollSetDeleted } from '../../reducers/action-creators'
import { Col, Form, Row } from 'react-bootstrap';

const DiceRollSetCard = (props) => {
    if (!props || !props.set) {
        throw "No dice roll set provided when building DiceRollSetCard";
    }
    const dispatch = useDispatch();

    const [removeSetTooltipVisible, setRemoveSetTooltipVisible] = useState(false);
    const [removeSetPopoverVisible, setRemoveSetPopoverVisible] = useState(false);
    const removeSetPopoverTimeoutRef = useRef(null);
    const removeSetPopoverBtnRef = useRef(null);

    const [addDiceRollTooltipVisible, setAddDiceRollTooltipVisible] = useState(false);
    const [addDiceRollPopoverVisible, setAddDiceRollPopoverVisible] = useState(false);
    const addDiceRollPopoverTimeoutRef = useRef(null);
    const addDiceRollPopoverBtnRef = useRef(null);

    const onBtnRemoveSetMouseEnter = (event) => {
        removeSetPopoverTimeoutRef.current = setTimeout(() => {
            setRemoveSetTooltipVisible(true);
        }, 300);
    }

    const onBtnRemoveSetMouseLeave = (event) => {
        if (removeSetPopoverTimeoutRef.current) {
            clearTimeout(removeSetPopoverTimeoutRef.current);
        }
        setRemoveSetTooltipVisible(false);
    }

    const onBtnRemoveSetClick = (event) => {
        event.stopPropagation();
        if (addDiceRollPopoverVisible) {
            setAddDiceRollPopoverVisible(false);
        }
        setRemoveSetTooltipVisible(false);
        setRemoveSetPopoverVisible(!removeSetPopoverVisible);
    }

    const removeDiceRollSetPopover = (innerProps) => (
        <Popover onClick={(event) => event.stopPropagation()} id='popover-basic' {...innerProps}>
            <Popover.Title as='h3'>Remove Dice Roll Set</Popover.Title>
            <Popover.Content>
                <DeleteConfirmationForm
                    onBtnConfirmClick={() => {
                        setRemoveSetPopoverVisible(false);
                        dispatch(diceRollSetDeleted(props.set.name));
                    }}
                    onBtnCancelClick={() => setRemoveSetPopoverVisible(false)} />
            </Popover.Content>
        </Popover>
    );

    const onBtnAddDiceMouseEnter = (event) => {
        addDiceRollPopoverTimeoutRef.current = setTimeout(() => {
            setAddDiceRollTooltipVisible(true);
        }, 300);
    }

    const onBtnAddDiceSetMouseLeave = (event) => {
        if (addDiceRollPopoverTimeoutRef.current) {
            clearTimeout(addDiceRollPopoverTimeoutRef.current);
        }
        setAddDiceRollTooltipVisible(false);
    }

    const onBtnAddDiceClick = (event) => {
        event.stopPropagation();
        if (removeSetPopoverVisible) {
            setRemoveSetPopoverVisible(false);
        }
        setAddDiceRollTooltipVisible(true);
        setAddDiceRollPopoverVisible(!addDiceRollPopoverVisible);
    }

    const addDicePopover = (innerProps) => (
        <Popover onClick={(event) => event.stopPropagation()} id='popover-basic' {...innerProps}>
            <Popover.Title as='h3'>Add Dice Roll To Set</Popover.Title>
            <Popover.Content>
                <NewDiceRollForm set={props.set} onBtnConfirmClick={() => setAddDiceRollPopoverVisible(false)} onBtnCancelClick={() => setAddDiceRollPopoverVisible(false)} />
            </Popover.Content>
        </Popover>
    );

    return (
        <Card>
            <Accordion.Toggle className="dice-set-header" as={Card.Header} eventKey={props.index.toString()}>
                {props.set.name}
                <ButtonGroup>
                    <Button
                        style={{ marginRight: "5px" }}
                        ref={addDiceRollPopoverBtnRef}
                        onClick={onBtnAddDiceClick}
                        onMouseEnter={onBtnAddDiceMouseEnter}
                        onMouseLeave={onBtnAddDiceSetMouseLeave}
                        variant="primary"
                        className='btn-fa-circle-sm'>
                        <FontAwesomeIcon icon={faPlus} />
                    </Button>
                    <Button
                        ref={removeSetPopoverBtnRef}
                        onClick={onBtnRemoveSetClick}
                        onMouseEnter={onBtnRemoveSetMouseEnter}
                        onMouseLeave={onBtnRemoveSetMouseLeave}
                        variant="danger"
                        className='btn-fa-circle-sm'>
                        <FontAwesomeIcon icon={faMinus} />
                    </Button>
                </ButtonGroup>
                <Overlay target={addDiceRollPopoverBtnRef.current} show={addDiceRollTooltipVisible && !addDiceRollPopoverVisible} placement="bottom">
                    {(props) => <Tooltip id="remove-dice-roll-set-tooltip" {...props}>Click to add a dice roll command to this dice roll set</Tooltip>}
                </Overlay>
                <Overlay target={addDiceRollPopoverBtnRef.current} show={addDiceRollPopoverVisible} placement="bottom">
                    {(props) => addDicePopover(props)}
                </Overlay>
                <Overlay target={removeSetPopoverBtnRef.current} show={removeSetTooltipVisible && !removeSetPopoverVisible} placement="bottom">
                    {(props) => <Tooltip id="remove-dice-roll-set-tooltip" {...props}>Click to remove this dice roll set</Tooltip>}
                </Overlay>
                <Overlay target={removeSetPopoverBtnRef.current} show={removeSetPopoverVisible} placement="bottom">
                    {(props) => removeDiceRollSetPopover(props)}
                </Overlay>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={props.index.toString()}>
                <Card.Body style={{paddingTop: "8px", paddingBottom: "8px", paddingRight: "16px", paddingLeft: "16px"}}>
                    <Form.Row style={{marginBottom: "0px"}}>
                        <Form.Group as={Col} sm={4} controlId="diceLabel" style={{marginBottom: "0px"}}>
                            <Form.Label>Label</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} sm={6} controlId="diceCmd" style={{marginBottom: "0px"}}>
                            <Form.Label>Command</Form.Label>
                        </Form.Group>
                    </Form.Row>
                    {props.set.items.length > 0 && props.set.items.map((item, i) => {
                        return (
                            <UserDiceRollItemForm key={item.label} set={props.set} item={item} index={i} />
                        )
                    })}
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    );
}

export default DiceRollSetCard;