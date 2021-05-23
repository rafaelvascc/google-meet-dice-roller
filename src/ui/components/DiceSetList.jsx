import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import Overlay from 'react-bootstrap/Overlay';
import Accordion from 'react-bootstrap/Accordion';
import Popover from 'react-bootstrap/Popover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import NewDiceRollSetForm from './NewDiceRollSetForm.jsx';
import DiceRollSetCard from './DiceRollSetCard.jsx';

const DiceSetList = (props) => {
    const diceRollCollection = useSelector(state => state);
    const [newSetTooltipVisible, setNewSetTooltipVisible] = useState(false);
    const [newSetPopoverVisible, setNewSetPopoverVisible] = useState(false);
    const newSetPopoverBtnRef = useRef(null);

    const onBtnNewSetMouseEnter = (event) => {
        setNewSetTooltipVisible(true);
    }

    const onBtnNewSetMouseLeave = (event) => {
        setNewSetTooltipVisible(false);
    }

    const onBtnNewSetClick = (event) => {
        setNewSetPopoverVisible(!newSetPopoverVisible);
    }

    const newDiceRollSetPopover = (props) => {
        return (
            <Popover id='popover-basic' {...props}>
                <Popover.Title as='h3'>New Dice Roll Set</Popover.Title>
                <Popover.Content>
                    <NewDiceRollSetForm onBtnConfirmClick={() => setNewSetPopoverVisible(false)} onBtnCancelClick={() => setNewSetPopoverVisible(false)} />
                </Popover.Content>
            </Popover>
        )
    }

    return (
        <>
            <Navbar bg='light' className='justify-content-between'>
                <Navbar.Brand>My dice roll sets</Navbar.Brand>
                <Button
                    ref={newSetPopoverBtnRef}
                    onClick={onBtnNewSetClick}
                    onMouseEnter={onBtnNewSetMouseEnter}
                    onMouseLeave={onBtnNewSetMouseLeave}
                    variant="primary"
                    className='btn-fa-circle-sm'>
                    <FontAwesomeIcon icon={faPlus} />
                </Button>
                <Overlay target={newSetPopoverBtnRef.current} show={newSetTooltipVisible && !newSetPopoverVisible} placement="bottom">
                    {(props) => <Tooltip {...props} id="new-dice-roll-set-tooltip">Click to create a new dice roll set</Tooltip>}
                </Overlay>
                <Overlay target={newSetPopoverBtnRef.current} show={newSetPopoverVisible} placement="bottom">
                    {(props) => newDiceRollSetPopover(props)}
                </Overlay>
            </Navbar>
            {
                diceRollCollection.length > 0 &&
                <Accordion>
                    {diceRollCollection.map((s, i) => {
                        return (
                            <DiceRollSetCard key={i} set={s} index={i} />
                        )
                    })}
                </Accordion>
            }
        </>
    )
}

export default DiceSetList;