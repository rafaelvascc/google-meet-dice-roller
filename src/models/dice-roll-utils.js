
import { commandRegex } from '../constants/regular-expressions';

const isSetNameOrRollLabelValid = (nameOrLabel) => {
    return !!nameOrLabel &&
        nameOrLabel.indexOf(".") < 0 &&
        nameOrLabel.indexOf("\\") < 0 &&
        nameOrLabel.indexOf("/") < 0 &&
        nameOrLabel.indexOf(" ") < 0;
}

export const sortHashTable = (obj) => {
    let sorted = {};
    Object.keys(obj).sort((a, b) => a > b ? 1 : b > a ? -1 : 0).forEach(key => sorted[key] = obj[key]);
    return sorted;
}

export const isDiceSetNameValid = (collection, name, originalName) => {
    return (
        isSetNameOrRollLabelValid(name) &&
        !diceRollCollectionHasDiceRollSet(collection, name)
    ) || (!!originalName && name === originalName);
}

export const isDiceRollLabelValid = (set, label, originalLabel) => {
    return (
        isSetNameOrRollLabelValid(label) &&
        !diceRollSetHasDiceRollItem(set, label)
    ) || (!!originalLabel && label === originalLabel);
}

export const diceRollSetHasDiceRollItem = (set, label) => {
    return !!set["commands"][label];
}

export const diceRollCollectionHasDiceRollSet = (collection, setName) => {
    return !!collection[setName];
}

export const isDiceRollCommandValid = (command) => {
    return command && commandRegex.test(command);
}

export const isCollectonValid = (diceRollCollection) => {
    if (!diceRollCollection || typeof diceRollCollection !== "object") {
        return [false, "Collection is null, undefined or not an object"];
    }

    for (const setName in diceRollCollection) {
        if (isSetNameOrRollLabelValid(setName)) {
            const set = diceRollCollection[setName];
            const result = areSetItemsValid(set, setName);

            if (result[0] === false) {
                return result;
            }
        }
        else {
            return [false, `Set name ${setName} isn't valid.`];
        }
    }

    return [true, ''];
}

export const areSetItemsValid = (set, setName) => {
    if (!set.commands || typeof set.commands !== "object") {
        return [false, `The 'commands' property of set ${setName} is null, undefined or not an object.`];
    }
    for (const commandLabel in set.commands) {
        if (isSetNameOrRollLabelValid(commandLabel)) {
            if (!isDiceRollCommandValid(set.commands[commandLabel])) {
                return [false, `Dice roll item command ${commandLabel}/${set.commands[commandLabel]} in set ${setName} isn't valid.`];
            }
        }
        else {
            return [false, `Dice roll item label ${commandLabel} in set ${setName} isn't valid.`];
        }
    }

    return [true, ''];
}

export const mergeCollections = (existingCollection, newCollection, replaceExisting) => {
    for (const key in newCollection) {
        if (existingCollection[key]) {
            let existingSet = existingCollection[key];
            let newSet = newCollection[key];

            for (const label in newSet["commands"]) {
                if (!existingSet["commands"][label] || (existingSet["commands"][label] && replaceExisting)) {
                    existingSet["commands"][label] = newSet["commands"][label];
                }
            }

            existingSet["commands"] = sortHashTable(existingSet["commands"]);
        }
        else {
            existingCollection[key] = newCollection[key];
        }
    }
    return sortHashTable(existingSet);
}

export const cloneCollection = (collection) => {
    const clone = {}
    for (const key in collection) {
        clone[key] = {
            variables: {...collection[key].variables},
            commands: {...collection[key].commands}
        }
    }
    return clone;
}