import React from 'react';
import icon from '../../../assets/icons/128.png';
import Navbar from 'react-bootstrap/Navbar';
import ButtonWithTolltip from './ButtonWithTolltip.jsx';
import { faDonate, faQuestion, faBug } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
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
        <ButtonWithTolltip
          asLink={true}
          href="https://www.paypal.com/donate?hosted_button_id=8P3F8ZGPH9L34"
          tooltipText="Donate (Paypal)"
          faIcon={faDonate}
          style={{ marginRight: "8px" }}
          faStyle={{ color: "#fff" }}
        />
        <ButtonWithTolltip
          asLink={true}
          href="https://github.com/rafaelvascc/google-meet-dice-roller/issues"
          tooltipText="Report bug or ask for feature (Github)"
          faIcon={faBug}
          style={{ marginRight: "8px" }}
          faStyle={{ color: "#fff" }}
        />
        <ButtonWithTolltip
          asLink={true}
          href="https://github.com/rafaelvascc/google-meet-dice-roller/blob/master/README.md"
          tooltipText="Help/Docs (Github)"
          faIcon={faQuestion}
          faStyle={{ color: "#fff" }}
        />
      </div>
    </Navbar>
  );
}

export default Header;