import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux'
import Navbar from 'react-bootstrap/Navbar';
import Overlay from 'react-bootstrap/Overlay';
import Accordion from 'react-bootstrap/Accordion';
import Popover from 'react-bootstrap/Popover';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import NewDiceRollSetForm from './NewDiceRollSetForm.jsx';
import DiceRollSetCard from './DiceRollSetCard.jsx';
import ButtonWithTolltip from './ButtonWithTolltip.jsx';

const DiceSetList = (props) => {
    const diceRollCollection = useSelector(state => state);
    const [newSetPopoverVisible, setNewSetPopoverVisible] = useState(false);
    const newSetPopoverBtnRef = useRef(null);

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
                <ButtonWithTolltip
                    showTooltip={!newSetPopoverVisible}
                    getRefFunc={(ref) => newSetPopoverBtnRef.current = ref.current}
                    onClick={() => setNewSetPopoverVisible(!newSetPopoverVisible)}
                    variant="primary"
                    faIcon={faPlus}
                    tooltipText={"Click to create a new dice roll set"}
                />
                <Overlay target={newSetPopoverBtnRef.current} show={newSetPopoverVisible} placement="bottom">
                    {(props) => newDiceRollSetPopover(props)}
                </Overlay>
            </Navbar>
            {
                diceRollCollection.length > 0 &&
                <Accordion>
                    {diceRollCollection.map((s, i) => {
                        return (
                            <DiceRollSetCard key={s.name} set={s} index={i} />
                        )
                    })}
                </Accordion>
            }
        </>
    )
}

export default DiceSetList;