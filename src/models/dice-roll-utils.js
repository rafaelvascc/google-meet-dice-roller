
import { commandRegex } from '../constants/regular-expressions';

export const isDiceRollLabelValid = (set, label, originalLabel) => {
    return (label &&
        label.indexOf(".") < 0 &&
        label.indexOf("\\") < 0 &&
        label.indexOf("/") < 0 &&
        label.indexOf(" ") < 0 &&
        !diceRollSetHasDiceRollItem(set, label)) || label === originalLabel;
}

export const diceRollSetHasDiceRollItem = (set, label) => {
    return set.items.some(e => {
        return e.label.toLowerCase().trim() === label.toLowerCase().trim();
    });
}

export const isDiceRollCommandValid = (command) => {
    return command && commandRegex.test(command);
}