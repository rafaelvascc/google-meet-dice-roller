import React from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';

const FormPopoverContainer = React.forwardRef((props, ref) => {
    return (
        <Overlay target={ref.current} show={props.show === true} placement="bottom">
            <Popover onClick={(event) => event.stopPropagation()} id='popover-basic' {...props}>
                <Popover.Title as='h3'>{props.title}</Popover.Title>
                <Popover.Content>
                    {props.children}
                </Popover.Content>
            </Popover>
        </Overlay>
    );
});

export default FormPopoverContainer;