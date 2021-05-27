import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux'
import Navbar from 'react-bootstrap/Navbar';
import Accordion from 'react-bootstrap/Accordion';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import NewDiceRollSetForm from './NewDiceRollSetForm.jsx';
import DiceRollSetCard from './DiceRollSetCard.jsx';
import ButtonWithTolltip from './ButtonWithTolltip.jsx';
import FormPopoverContainer from './FormPopoverContainer.jsx';

const DiceSetList = (props) => {
    const diceRollCollection = useSelector(state => state);
    const [newSetPopoverVisible, setNewSetPopoverVisible] = useState(false);
    const newSetPopoverBtnRef = useRef(null);

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
                <FormPopoverContainer ref={newSetPopoverBtnRef} show={newSetPopoverVisible} title="New Dice Roll Set">
                    <NewDiceRollSetForm onBtnConfirmClick={() => setNewSetPopoverVisible(false)} onBtnCancelClick={() => setNewSetPopoverVisible(false)} />
                </FormPopoverContainer>
            </Navbar>
            {
                <Accordion>
                    {Object.keys(diceRollCollection).map((k) => {
                        console.log(k, diceRollCollection[k]);
                        return (
                            <DiceRollSetCard key={k} setName={k} set={diceRollCollection[k]} />
                        )
                    })}
                </Accordion>
            }
        </>
    )
}

export default DiceSetList;