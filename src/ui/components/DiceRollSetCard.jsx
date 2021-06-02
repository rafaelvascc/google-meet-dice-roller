import React, { useState, useRef } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonWithTolltip from './ButtonWithTolltip.jsx';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Container from 'react-bootstrap/Container';
import UserDiceRollItemForm from './UserDiceRollItemForm.jsx';
import FormPopoverContainer from './FormPopoverContainer.jsx';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import NewDiceRollForm from './NewDiceRollForm.jsx';
import NewVariableForm from './NewVariableForm.jsx';
import UserVariableForm from './UserVariableForm.jsx';
import DeleteConfirmationForm from './DeleteConfirmationForm.jsx'
import { useDispatch } from 'react-redux';
import { diceRollSetDeleted } from '../../reducers/action-creators'
import { Col, Form } from 'react-bootstrap';

const DiceRollSetCard = (props) => {
    if (!props || !props.set) {
        throw "No dice roll set provided when building DiceRollSetCard";
    }
    const dispatch = useDispatch();

    const [addVariablePopoverVisible, setAddVariablePopoverVisible] = useState(false);
    const [addDiceRollPopoverVisible, setAddDiceRollPopoverVisible] = useState(false);
    const [removeSetPopoverVisible, setRemoveSetPopoverVisible] = useState(false);

    const addVariablePopoverBtnRef = useRef(null);
    const addDiceRollPopoverBtnRef = useRef(null);
    const removeSetPopoverBtnRef = useRef(null);

    const onBtnAddVariableClick = (event) => {
        event.stopPropagation();
        hidePopovers();
        setAddVariablePopoverVisible(!addVariablePopoverVisible);
    }

    const onBtnAddCommandClick = (event) => {
        event.stopPropagation();
        hidePopovers();
        setAddDiceRollPopoverVisible(!addDiceRollPopoverVisible);
    }

    const onBtnRemoveSetClick = (event) => {
        event.stopPropagation();
        hidePopovers();
        setRemoveSetPopoverVisible(!removeSetPopoverVisible);
    }

    const hidePopovers = () => {
        setAddVariablePopoverVisible(false);
        setAddDiceRollPopoverVisible(false);
        setRemoveSetPopoverVisible(false);
    }

    return (
        <Card>
            <Accordion.Toggle className="dice-set-header" as={Card.Header} eventKey={props.setName}>
                {props.setName}
                <ButtonGroup>
                    <ButtonWithTolltip
                        style={{ marginRight: "5px" }}
                        showTooltip={!addVariablePopoverVisible}
                        getRefFunc={(ref) => addVariablePopoverBtnRef.current = ref.current}
                        onClick={onBtnAddVariableClick}
                        variant="success"
                        faIcon={faPlus}
                        tooltipText={"Click to add a variable to this dice roll set"}
                    />
                    <ButtonWithTolltip
                        style={{ marginRight: "5px" }}
                        showTooltip={!addDiceRollPopoverVisible}
                        getRefFunc={(ref) => addDiceRollPopoverBtnRef.current = ref.current}
                        onClick={onBtnAddCommandClick}
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
                <FormPopoverContainer ref={addVariablePopoverBtnRef} show={addVariablePopoverVisible} title="Add Variable To Set">
                    <NewVariableForm setName={props.setName} set={props.set} onBtnConfirmClick={() => setAddVariablePopoverVisible(false)} onBtnCancelClick={() => setAddVariablePopoverVisible(false)} />
                </FormPopoverContainer>
                <FormPopoverContainer ref={addDiceRollPopoverBtnRef} show={addDiceRollPopoverVisible} title="Add Dice Roll To Set">
                    <NewDiceRollForm setName={props.setName} set={props.set} onBtnConfirmClick={() => setAddDiceRollPopoverVisible(false)} onBtnCancelClick={() => setAddDiceRollPopoverVisible(false)} />
                </FormPopoverContainer>
                <FormPopoverContainer ref={removeSetPopoverBtnRef} show={removeSetPopoverVisible} title="Remove Dice Roll Set">
                    <DeleteConfirmationForm
                        onBtnConfirmClick={() => {
                            setRemoveSetPopoverVisible(false);
                            dispatch(diceRollSetDeleted(props.setName));
                        }}
                        onBtnCancelClick={() => setRemoveSetPopoverVisible(false)}
                    />
                </FormPopoverContainer>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={props.setName}>
                <Card.Body style={{ paddingTop: "8px", paddingBottom: "8px", paddingRight: "16px", paddingLeft: "16px" }}>
                    <Tabs defaultActiveKey="commands" id={`tabs-${props.setName}`}  style={{marginLeft: "auto"}} className="nav-pills">
                        <Tab eventKey="commands" title="Commands">
                            <Form.Row style={{ marginBottom: "0px", marginTop: "16px" }}>
                                <Form.Group as={Col} sm={4} controlId="commandLabelHeader" style={{ marginBottom: "0px" }}>
                                    <Form.Label>Label</Form.Label>
                                </Form.Group>
                                <Form.Group as={Col} sm={6} controlId="commandHeader" style={{ marginBottom: "0px" }}>
                                    <Form.Label>Command</Form.Label>
                                </Form.Group>
                            </Form.Row>
                            {
                                Object.keys(props.set.commands).map((k) => {
                                    return (
                                        <UserDiceRollItemForm key={k} setName={props.setName} set={props.set} label={k} command={props.set.commands[k]} />
                                    )
                                })
                            }
                        </Tab>
                        <Tab eventKey="variables" title="Variables">
                            <Form.Row style={{ marginBottom: "0px", marginTop: "16px" }}>
                                <Form.Group as={Col} sm={4} controlId="variableLabelHeader" style={{ marginBottom: "0px" }}>
                                    <Form.Label>Label</Form.Label>
                                </Form.Group>
                                <Form.Group as={Col} sm={6} controlId="variableHeader" style={{ marginBottom: "0px" }}>
                                    <Form.Label>Variable/Expression</Form.Label>
                                </Form.Group>
                            </Form.Row>
                            {
                                Object.keys(props.set.variables).map((k) => {
                                    return (
                                        <UserVariableForm key={k} setName={props.setName} set={props.set} label={k} expression={props.set.variables[k]} />
                                    )
                                })
                            }
                        </Tab>
                    </Tabs>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    );
}

export default DiceRollSetCard;