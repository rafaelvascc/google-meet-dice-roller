import React, { useState, useRef } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonWithTolltip from './ButtonWithTolltip.jsx';
import Accordion from 'react-bootstrap/Accordion';
import Popover from 'react-bootstrap/Popover';
import Overlay from 'react-bootstrap/Overlay';
import Card from 'react-bootstrap/Card';
import UserDiceRollItemForm from './UserDiceRollItemForm.jsx';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import NewDiceRollForm from './NewDiceRollForm.jsx';
import DeleteConfirmationForm from './DeleteConfirmationForm.jsx'
import { useDispatch } from 'react-redux';
import { diceRollSetDeleted } from '../../reducers/action-creators'
import { Col, Form } from 'react-bootstrap';

const DiceRollSetCard = (props) => {
    if (!props || !props.set) {
        throw "No dice roll set provided when building DiceRollSetCard";
    }
    const dispatch = useDispatch();

    const [addDiceRollPopoverVisible, setAddDiceRollPopoverVisible] = useState(false);
    const [removeSetPopoverVisible, setRemoveSetPopoverVisible] = useState(false);

    const addDiceRollPopoverBtnRef = useRef(null);
    const removeSetPopoverBtnRef = useRef(null);

    const onBtnAddDiceClick = (event) => {
        event.stopPropagation();
        removeSetPopoverVisible && setRemoveSetPopoverVisible(false);
        setAddDiceRollPopoverVisible(!addDiceRollPopoverVisible);
    }

    const onBtnRemoveSetClick = (event) => {
        event.stopPropagation();
        addDiceRollPopoverVisible && setAddDiceRollPopoverVisible(false);
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
                    <ButtonWithTolltip
                        style={{ marginRight: "5px" }}
                        showTooltip={!addDiceRollPopoverVisible}
                        getRefFunc={(ref) => addDiceRollPopoverBtnRef.current = ref.current}
                        onClick={onBtnAddDiceClick}
                        variant="primary"
                        faIcon={faPlus}
                        tooltipText={"Click to add a dice roll command to this dice roll set"}
                    />
                    <ButtonWithTolltip
                        showTooltip={!removeSetPopoverVisible}
                        getRefFunc={(ref) => removeSetPopoverBtnRef.current = ref.current}
                        onClick={onBtnRemoveSetClick}
                        variant="danger"
                        faIcon={faMinus}
                        tooltipText={"Click to remove this dice roll set"}
                    />
                </ButtonGroup>
                <Overlay target={addDiceRollPopoverBtnRef.current} show={addDiceRollPopoverVisible} placement="bottom">
                    {(props) => addDicePopover(props)}
                </Overlay>
                <Overlay target={removeSetPopoverBtnRef.current} show={removeSetPopoverVisible} placement="bottom">
                    {(props) => removeDiceRollSetPopover(props)}
                </Overlay>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={props.index.toString()}>
                <Card.Body style={{ paddingTop: "8px", paddingBottom: "8px", paddingRight: "16px", paddingLeft: "16px" }}>
                    <Form.Row style={{ marginBottom: "0px" }}>
                        <Form.Group as={Col} sm={4} controlId="diceLabel" style={{ marginBottom: "0px" }}>
                            <Form.Label>Label</Form.Label>
                        </Form.Group>
                        <Form.Group as={Col} sm={6} controlId="diceCmd" style={{ marginBottom: "0px" }}>
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