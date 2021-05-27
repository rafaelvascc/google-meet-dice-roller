import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux'
import Collapse from 'react-bootstrap/Collapse';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonWithTolltip from './ButtonWithTolltip.jsx';
import JSONPretty from 'react-json-pretty';
import InvalidInputFeedbackText from './InvalidInputFeedbackText.jsx'
import { isCollectonValid } from '../../models/dice-roll-utils'

const BackupArea = (props) => {
    const diceRollCollection = useSelector(state => state);
    const [restoreTxtChanged, setRestoreTxtChanged] = useState(false);
    const [isRestoreValid, setIsRestoreValid] = useState(false);
    const [restoreValidationError, setRestoreValidationError] = useState('');
    const checkJsonValidTimeoutRef = useRef(null);

    const ontxtRestoreChange = (event) => {
        const { value } = event.target;
        !restoreTxtChanged && setRestoreTxtChanged(true);
        if (checkJsonValidTimeoutRef.current) {
            clearTimeout(checkJsonValidTimeoutRef.current);
        }
        checkJsonValidTimeoutRef.current = setTimeout(() => {
            try {
                const [restoreValid, error] = isCollectonValid(JSON.parse(value));
                setIsRestoreValid(restoreValid);
                if (!restoreValid) {
                    setRestoreValidationError(error);
                }
                else {
                    setRestoreValidationError('');
                }
            }
            catch (err) {
                setIsRestoreValid(false);
                setRestoreValidationError(err.message);
            }
        }, 300);
    }

    const onBtnConfirmClick = (event) => {

    }

    return (
        <>
            <Collapse in={props.backupVisible}>
                <Container fluid style={{ border: "1px solid rgba(0,0,0,.125)", paddingTop: "15px", paddingBottom: "15px", position: "relative" }}>
                    <ButtonWithTolltip
                        style={{ marginRight: "5px", position: "absolute", right: "10px" }}
                        onClick={() => { navigator.clipboard.writeText(JSON.stringify(diceRollCollection, null, 4)) }}
                        variant="primary"
                        faIcon={faCopy}
                        faStyle={{ fontSize: "16px" }}
                        tooltipText={"Copy to clipboard"}
                    />
                    <JSONPretty id="json-pretty" data={diceRollCollection}></JSONPretty>
                </Container>
            </Collapse>
            <Collapse in={props.restoreVisible}>
                <Container fluid style={{ border: "1px solid rgba(0,0,0,.125)", paddingTop: "15px", paddingBottom: "15px", position: "relative" }}>
                    <Form.Group style={{ display: "flex", flexDirection: "column", marginBottom: "0px" }}>
                        <Form.Label>Paste a previous backup here</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={12}
                            onChange={ontxtRestoreChange}
                            isValid={isRestoreValid && restoreTxtChanged}
                            isInvalid={!isRestoreValid && restoreTxtChanged}
                        />
                        <InvalidInputFeedbackText visible={!isRestoreValid} text={restoreValidationError} />
                        <ButtonGroup style={{ marginLeft: "auto", marginTop: "8px" }}>
                            <ButtonWithTolltip
                                disabled={!isRestoreValid}
                                style={{ marginRight: "5px" }}
                                onClick={onBtnConfirmClick}
                                variant="success"
                                faIcon={faCheck}
                                tooltipText={"Confirm import"}
                            />
                        </ButtonGroup>
                    </Form.Group>
                </Container>
            </Collapse>
        </>
    )
}

export default BackupArea;