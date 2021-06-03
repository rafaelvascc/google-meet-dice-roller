import React, { useState, useRef, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import Overlay from 'react-bootstrap/Overlay';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ButtonWithTolltip = (props) => {
    const btnRef = useRef(null);
    const showTolltipTimeoutRef = useRef(null);
    const [tooltipVisible, seTooltipVisible] = useState(false);

    const onMouseEnter = (event) => {
        showTolltipTimeoutRef.current = setTimeout(() => {
            seTooltipVisible(true);
            if (props.onMouseEnter) {
                props.onMouseEnter({ ...event })
            }
        }, 300);
    }

    const onMouseLeave = (event) => {
        if (showTolltipTimeoutRef.current) {
            clearTimeout(showTolltipTimeoutRef.current);
        }
        seTooltipVisible(false);
        if (props.onMouseLeave) {
            props.onMouseLeave({ ...event })
        }
    }

    useEffect(() => {
        if (props.getRefFunc) {
            props.getRefFunc(btnRef);
        }
    }, [btnRef.current])

    return (
        <>
            {
                props.asLink === true ?
                    <a ref={btnRef} style={props.style} href={props.href} target="_blank" rel="noreferrer noopener">
                        <FontAwesomeIcon
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                            icon={props.faIcon}
                            style={props.faStyle}
                        />
                    </a> :
                    <Button
                        disabled={!!props.disabled}
                        style={props.style}
                        ref={btnRef}
                        onClick={props.onClick}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={onMouseLeave}
                        variant={props.variant}
                        className='btn-fa-circle-sm fa-stack'>
                        {
                            props.faCrudIcon &&
                            <>
                                <FontAwesomeIcon icon={props.faCrudIcon} style={{ fontSize: "10px", left: "-18px" }} className="fa-stack-1x fa-inverse" />
                                {
                                    props.faIcon ?
                                        <FontAwesomeIcon style={{ ...props.faStyle, fontSize: "16px", right: "-10px" }} icon={props.faIcon} className="fa-stack-1x fa-inverse" /> :
                                        props.customIcon
                                }
                            </>
                        }
                        {!!!props.faCrudIcon && <FontAwesomeIcon style={{ ...props.faStyle }} icon={props.faIcon} />}
                    </Button>

            }
            <Overlay target={btnRef.current} show={tooltipVisible && (props.showTooltip === undefined || props.showTooltip === true)} placement="bottom">
                {(innerProps) => <Tooltip {...innerProps}>{props.tooltipText}</Tooltip>}
            </Overlay>
        </>
    )
}

export default ButtonWithTolltip;