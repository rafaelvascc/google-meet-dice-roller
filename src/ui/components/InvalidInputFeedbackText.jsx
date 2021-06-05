import React from 'react';

const InvalidInputFeedbackText = (props) => {
    return <div style={props.visible ? { "display": "block" } : { "display": "none" }} className='invalid-feedback'>{props.text}</div>
}

export default InvalidInputFeedbackText;