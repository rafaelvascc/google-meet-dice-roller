import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux'
import Navbar from 'react-bootstrap/Navbar';
import Accordion from 'react-bootstrap/Accordion';
import { faPlus, faFileImport, faFileExport } from '@fortawesome/free-solid-svg-icons';
import NewDiceRollSetForm from './NewDiceRollSetForm.jsx';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import DiceRollSetCard from './DiceRollSetCard.jsx';
import ButtonWithTolltip from './ButtonWithTolltip.jsx';
import FormPopoverContainer from './FormPopoverContainer.jsx';
import BackupArea from './BackupArea.jsx'

const DiceSetList = (props) => {
    const diceRollCollection = useSelector(state => state);
    const [newSetPopoverVisible, setNewSetPopoverVisible] = useState(false);
    const [backupVisible, setBackupVisible] = useState(false);
    const [restoreVisible, setRestoreVisible] = useState(false);
    const newSetPopoverBtnRef = useRef(null);

    return (
        <>
            <Navbar bg='light' className='justify-content-between'>
                <Navbar.Brand>My dice roll sets</Navbar.Brand>
                <ButtonGroup>
                    <ButtonWithTolltip
                        style={{ marginRight: "5px" }}
                        onClick={() => { setBackupVisible(!backupVisible); setRestoreVisible(false) }}
                        variant="success"
                        faIcon={faFileExport}
                        faStyle={{ fontSize: "16px" }}
                        tooltipText={"Click to get a backup data of your collection"}
                    />
                    <ButtonWithTolltip
                        style={{ marginRight: "5px" }}
                        onClick={() => { setRestoreVisible(!restoreVisible); setBackupVisible(false) }}
                        variant="success"
                        faIcon={faFileImport}
                        faStyle={{ fontSize: "16px" }}
                        tooltipText={"Click to import a collection from backup data"}
                    />
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
                </ButtonGroup>
            </Navbar>
            <BackupArea backupVisible={backupVisible} restoreVisible={restoreVisible} />
            {
                <Accordion>
                    {Object.keys(diceRollCollection).map((k) => {
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