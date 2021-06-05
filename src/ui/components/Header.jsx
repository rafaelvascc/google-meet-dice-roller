import React, { useRef, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import ButtonWithTolltip from './ButtonWithTolltip.jsx';
import { faDonate, faQuestion, faBug, faWindowClose } from '@fortawesome/free-solid-svg-icons';
import FormPopoverContainer from './FormPopoverContainer.jsx';
import $ from 'jquery';

const Header = () => {
    const pixImgRef = useRef(null);
    const [pixQrVisible, setPixQrVisible] = useState(false);

    return (
        <Navbar bg='dark' variant='dark'>
            <Navbar.Brand>
                <img
                    alt=''
                    src={chrome.runtime ? `chrome-extension://${chrome.runtime.id}/icons/128.png` : "chrome-extension://dicbnbffchgjndpgeibmbpiciapnghbg/icons/128.png"}
                    width='30'
                    height='30'
                    className='d-inline-block align-top'
                />{' '}
            Google Meet Dice Roller
            </Navbar.Brand>
            <div style={{ marginLeft: "auto", marginRight: "9px" }}>
                <ButtonWithTolltip
                    type='image'
                    tooltipText="Doar com Pix (Donate with Pix)"
                    src={chrome.runtime ? `chrome-extension://${chrome.runtime.id}/assets/pix-logo-only.png` : "chrome-extension://dicbnbffchgjndpgeibmbpiciapnghbg/assets/pix-logo-only.png"}
                    style={{ width: "20px", cursor: "pointer", marginRight: "8px", paddingBottom: "5px" }}
                    getRefFunc={ref => pixImgRef.current = ref.current}
                    onClick={(event) => {
                        setPixQrVisible(!pixQrVisible);
                    }}
                />
                <ButtonWithTolltip
                    type='link'
                    href="https://www.paypal.com/donate?hosted_button_id=8P3F8ZGPH9L34"
                    tooltipText="Donate (Paypal)"
                    faIcon={faDonate}
                    style={{ marginRight: "8px" }}
                    faStyle={{ color: "#fff" }}
                />
                <ButtonWithTolltip
                    type='link'
                    href="https://github.com/rafaelvascc/google-meet-dice-roller/issues"
                    tooltipText="Report bug or ask for feature (Github)"
                    faIcon={faBug}
                    style={{ marginRight: "8px" }}
                    faStyle={{ color: "#fff" }}
                />
                <ButtonWithTolltip
                    type='link'
                    href="https://github.com/rafaelvascc/google-meet-dice-roller/blob/master/README.md"
                    tooltipText="Help/Docs (Github)"
                    faIcon={faQuestion}
                    style={{ marginRight: "8px" }}
                    faStyle={{ color: "#fff" }}
                />
                <ButtonWithTolltip
                    type='icon'
                    tooltipText="Hide Window"
                    faIcon={faWindowClose}
                    faStyle={{ color: "#fff", cursor: "pointer" }}
                    onClick={(event) => {
                        const $container = $("#dice-roller-container");
                        const $btnToggle = $("#dice-roller-toggle-button");
                        $btnToggle.css("top", $container.css("top")).css("left", $container.css("left"));
                        $container.hide({
                            duration: 400,
                            complete: () => {
                                $btnToggle.show({
                                    duration: 200
                                });
                            }
                        });
                        return false;
                    }}
                />
                <FormPopoverContainer ref={pixImgRef} show={pixQrVisible} placement={"bottom"} title="Pix QR Code" style={{ maxWidth: "1000px", width: "auto" }}>
                    <img
                        alt=''
                        src={chrome.runtime ? `chrome-extension://${chrome.runtime.id}/assets/pix_qr.png` : "chrome-extension://dicbnbffchgjndpgeibmbpiciapnghbg/assets/pix_qr.png"}
                        width='300'
                        height='300'
                    />
                </FormPopoverContainer>
            </div>
        </Navbar>
    );
}

export default Header;