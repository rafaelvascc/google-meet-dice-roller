import React, { useState, useRef } from 'react';
import icon from '../../../assets/icons/128.png';
import Navbar from 'react-bootstrap/Navbar';
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDonate, faQuestion } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const [donateTolltipVisible, setDonateTolltipVisible] = useState(false);
  const [helpTolltipVisible, setHelpTolltipVisible] = useState(false);
  const donateTolltipTimeoutRef = useRef(null);
  const helpTolltipTmeoutRef = useRef(null);
  const donateBtnRef = useRef(null);
  const helpBtnRef = useRef(null);

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

  const hideAllToolTips = () => {
    setDonateTolltipVisible(false);
    setHelpTolltipVisible(false);
  }

  return (
    <Navbar bg='dark' variant='dark'>
      <Navbar.Brand>
        <img
          alt=''
          src={icon}
          width='30'
          height='30'
          className='d-inline-block align-top'
        />{' '}
      Google Meet Dice Roller
      </Navbar.Brand>
      <div style={{ marginLeft: "auto", marginRight: "9px" }}>
        <a ref={donateBtnRef} href="https://www.paypal.com/donate?hosted_button_id=8P3F8ZGPH9L34" target="_blank" rel="noreferrer noopener">
          <FontAwesomeIcon
            onMouseEnter={(event) => onBtnMouseEnter(donateTolltipTimeoutRef, setDonateTolltipVisible)}
            onMouseLeave={(event) => onBtnMouseLeave(donateTolltipTimeoutRef)}
            onBlur={(event) => onBtnMouseLeave(donateTolltipTimeoutRef)}
            icon={faDonate}
            style={{ color: "#fff", marginRight: "8px" }}
          />
        </a>
        <a ref={helpBtnRef} href="https://github.com/rafaelvascc/google-meets-dice-roller/blob/master/README.md" target="_blank" rel="noreferrer noopener">
          <FontAwesomeIcon
            onMouseEnter={(event) => onBtnMouseEnter(helpTolltipTmeoutRef, setHelpTolltipVisible)}
            onMouseLeave={(event) => onBtnMouseLeave(helpTolltipTmeoutRef)}
            onBlur={(event) => onBtnMouseLeave(helpTolltipTmeoutRef)}
            icon={faQuestion}
            style={{ color: "#fff" }}
          />
        </a>
        <Overlay target={donateBtnRef.current} show={donateTolltipVisible} placement="bottom">
          {(props) => <Tooltip id="donate-tooltip" {...props}>Donate (Paypal)</Tooltip>}
        </Overlay>
        <Overlay target={helpBtnRef.current} show={helpTolltipVisible} placement="bottom">
          {(props) => <Tooltip id="help-tooltip" {...props}>Help (Github)</Tooltip>}
        </Overlay>
      </div>
    </Navbar>
  );
}

export default Header;