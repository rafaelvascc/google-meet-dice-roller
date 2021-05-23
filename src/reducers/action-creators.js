import { 
    ADD_DICE_ROLL_SET, 
    DELETE_DICE_ROLL_SET, 
    ADD_DICE_ROLL, 
    DELETE_DICE_ROLL, 
    EDIT_DICE_ROLL 
} from './actions.js'

export const diceRollSetAdded = (name) => {
    return {
        type: ADD_DICE_ROLL_SET,
        payload: name
    }
}

export const diceRollSetDeleted = (name) => {
    return {
        type: DELETE_DICE_ROLL_SET,
        payload: name
    }
}

export const diceRollAdded = (setName, label, command) => {
    return {
        type: ADD_DICE_ROLL,
        payload: {
            setName,
            label,
            command,
        }
    }
}

export const diceRollEdited = (setName, oldLabel, newLabel, newCommand) => {
    return {
        type: EDIT_DICE_ROLL,
        payload: {
            setName,
            oldLabel,
            newLabel,
            newCommand
        }
    }
}

export const diceRollDeleted = (setName, label) => {
    return {
        type: DELETE_DICE_ROLL,
        payload: {
            setName,
            label
        }
    }
}