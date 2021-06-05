import {
    LOAD_DICE_ROLL_SETS,
    IMPORT_DICE_ROLL_SETS,
    ADD_DICE_ROLL_SET,
    DELETE_DICE_ROLL_SET,
    ADD_DICE_ROLL,
    DELETE_DICE_ROLL,
    EDIT_DICE_ROLL,
    ADD_VARIABLE,
    DELETE_VARIABLE,
    EDIT_VARIABLE,
} from './actions.js'

export const loadDiceRollSets = (sets) => {
    return {
        type: LOAD_DICE_ROLL_SETS,
        payload: sets
    }
}

export const importDiceRollSets = (sets) => {
    return {
        type: IMPORT_DICE_ROLL_SETS,
        payload: sets
    }
}

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

export const variableAdded = (setName, label, expression) => {
    return {
        type: ADD_VARIABLE,
        payload: {
            setName,
            label,
            expression,
        }
    }
}

export const variableEdited = (setName, oldLabel, newLabel, newExpression) => {
    return {
        type: EDIT_VARIABLE,
        payload: {
            setName,
            oldLabel,
            newLabel,
            newExpression
        }
    }
}

export const variableDeleted = (setName, label) => {
    return {
        type: DELETE_VARIABLE,
        payload: {
            setName,
            label
        }
    }
}