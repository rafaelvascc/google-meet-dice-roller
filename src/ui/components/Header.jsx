import React from 'react';
import icon from '../../../assets/icons/128.png';
import Navbar from 'react-bootstrap/Navbar';

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
    </Navbar>
  );
}

export default Header;