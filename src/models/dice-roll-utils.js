
import {
    commandRegex,
    labelOrNameRegexNoGlobal,
    diceCommandRegexNoGlobal,
    constOnlyRegexNoGlobal,
    variableRegex,
    variableLabelInExpressionRegex
} from '../constants/regular-expressions';
import math from 'mathjs-expression-parser';

const isSetNameOrLabelValid = (nameOrLabel) => {
    return !!nameOrLabel && labelOrNameRegexNoGlobal.test(nameOrLabel);
}

const isInt = (value) => {
    var x;
    return isNaN(value) ? !1 : (x = parseFloat(value), (0 | x) === x);
}

export const sortHashTable = (obj) => {
    let sorted = {};
    Object.keys(obj).sort((a, b) => a > b ? 1 : b > a ? -1 : 0).forEach(key => sorted[key] = obj[key]);
    return sorted;
}

export const isDiceSetNameValid = (collection, name, originalName) => {
    return (
        isSetNameOrLabelValid(name) &&
        !diceRollCollectionHasDiceRollSet(collection, name)
    ) || (!!originalName && name === originalName);
}

export const isDiceRollLabelValid = (set, label, originalLabel) => {
    return (
        isSetNameOrLabelValid(label) &&
        !diceRollSetHasDiceRollItem(set, label)
    ) || (!!originalLabel && label === originalLabel);
}

export const isVariableLabelValid = (set, label, originalLabel) => {
    return (
        isSetNameOrLabelValid(label) &&
        !diceRollSetHasVariable(set, label)
    ) || (!!originalLabel && label === originalLabel);
}

export const diceRollSetHasDiceRollItem = (set, label) => {
    return !!set["commands"][label];
}

export const diceRollSetHasVariable = (set, label) => {
    return !!set["variables"][label];
}

export const diceRollCollectionHasDiceRollSet = (collection, setName) => {
    return !!collection[setName];
}

export const isDiceRollCommandValid = (command) => {
    const isValidByRegex = command && commandRegex.test(command);
    if (!isValidByRegex)
        return [false, 'Dice roll command should not be empty and pass regular expression validation. Check docs/help for details.'];

    command.split(' ').forEach(t => {
        if (diceCommandRegexNoGlobal.test(t)) {
            const subMatches = diceCommandRegexNoGlobal.exec(t);
            const {
                diceCount,
                constant
            } = subMatches.groups;

            const [hasValidDiceCount, diceErrorMessage] = doesExpressionReturnsAnInteger(diceCount || "1");
            const [hasValidConstant, constErrorMessage] = doesExpressionReturnsAnInteger(constant);

            if (!hasValidDiceCount || !hasValidConstant) {
                return [false, `Token ${t} has invalid calculation for dice count or constant value. ${diceErrorMessage} ${constErrorMessage}`];
            }
        }
        else if (constOnlyRegexNoGlobal.test(t)) {
            const subMatches = constOnlyRegexNoGlobal.exec(t);
            const {
                constExp
            } = subMatches.groups;
            const [hasValidConstant, constErrorMessage] = doesExpressionReturnsAnInteger(constExp);
            if (!hasValidConstant) {
                return [false, `Token ${t} has invalid calculation for constant value. ${constErrorMessage}`];
            }
        }
    });

    return [true, ''];
}

export const isVariableValid = (variableLabel, variableTxt, otherVariables) => {
    const isValidByRegex = !!variableTxt && variableRegex.test(variableTxt);
    if (!isValidByRegex)
        return [false, 'Variable/Expression should not be empty and pass regular expression validation'];

    if (isVariableCallingItself(variableLabel, variableTxt, otherVariables))
        return [false, 'Variable/Expression should not call itself or make another variable call itself'];

    return doesExpressionReturnsAnInteger(variableTxt);
}

export const isVariableCallingItself = (variableLabel, variableTxt, setVariables) => {
    const otherVariableLabels = variableTxt.match(variableLabelInExpressionRegex);
    if (otherVariableLabels && otherVariableLabels[0]) {
        const uniqueVariableLabels = otherVariableLabels.filter((v, i) => otherVariableLabels.indexOf(v) === i);

        if (otherVariableLabels.indexOf(`{${variableLabel}}`) > -1) {
            return true;
        }

        for (const enclosedLabel of uniqueVariableLabels) {
            const labelOnly = enclosedLabel.slice(1, -1);
            if (variableLabel === labelOnly) {
                continue;
            }
            const otherVariableTxt = setVariables[labelOnly];
            if (otherVariableTxt && isVariableCallingItself(variableLabel, otherVariableTxt, setVariables)) {
                return true;
            }
        }
    }
    return false;
}

const doesExpressionReturnsAnInteger = (exp) => {
    try {
        const clonedText = exp.replaceAll(variableLabelInExpressionRegex, '1');
        const retVal = math.eval(clonedText);
        const returnsNumber = typeof retVal === 'number' && isInt(retVal);
        if (!returnsNumber) return [false, 'Expression should return an interger number'];
    }
    catch (err) {
        return [false, err.message];
    }
    return [true, ''];
}

export const execVariable = (variableTxt, setVariables) => {
    const otherVariableLabels = variableTxt.match(variableLabelInExpressionRegex);

    if (otherVariableLabels && otherVariableLabels[0]) {
        const uniqueVariableLabels = otherVariableLabels.filter((v, i) => otherVariableLabels.indexOf(v) === i);
        for (const otherVarLabel of uniqueVariableLabels) {
            const otherVariableText = setVariables[otherVarLabel.slice(1, -1)];
            const otherVariableResult = execVariable(otherVariableText, setVariables);
            variableTxt = variableTxt.replaceAll(otherVarLabel, otherVariableResult > 0 ? `+${otherVariableResult}` : otherVariableResult);
        }
    }

    return math.eval(variableTxt);
}

export const isCollectonValid = (diceRollCollection) => {
    if (!diceRollCollection || typeof diceRollCollection !== "object") {
        return [false, "Collection is null, undefined or not an object"];
    }

    for (const setName in diceRollCollection) {
        if (isSetNameOrLabelValid(setName)) {
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

export const areAllCommandsValid = (set, setName) => {
    for (const commandLabel in set.commands) {
        if (isSetNameOrLabelValid(commandLabel)) {
            const [valid, validationMessage] = isDiceRollCommandValid(set.commands[commandLabel]);
            if (!valid) {
                return [false, `Dice roll item command ${commandLabel}/${set.commands[commandLabel]} in set ${setName} isn't valid. ${validationMessage}`];
            }
        }
        else {
            return [false, `Dice roll item label ${commandLabel} in set ${setName} isn't valid.`];
        }
    }
    return [true, ''];
}

export const areAllVariablesValid = (set, setName) => {
    for (const variableLabel in set.variables) {
        if (isSetNameOrLabelValid(variableLabel)) {
            const [valid, validationMessage] = isVariableValid(variableLabel, set.variables[variableLabel], set.variables);
            if (!valid) {
                return [false, `Variable ${variableLabel}/${set.variables[variableLabel]} in set ${setName} isn't valid. ${validationMessage}`];
            }
        }
        else {
            return [false, `Variable label ${variableLabel} in set ${setName} isn't valid.`];
        }
    }
    return [true, ''];
}

export const areSetItemsValid = (set, setName) => {
    if (!set.commands || typeof set.commands !== "object") {
        return [false, `The 'commands' property of set ${setName} is null, undefined or not an object.`];
    }

    if (!set.variables || typeof set.variables !== "object") {
        return [false, `The 'variables' property of set ${setName} is null, undefined or not an object.`];
    }

    const [commandsValid, commandsValidationMessage] = areAllCommandsValid(set, setName);
    if (!commandsValid) {
        return [false, commandsValidationMessage];
    }

    const [varsValid, varsValidationMessage] = areAllVariablesValid(set, setName);
    if (!varsValid) {
        return [false, varsValidationMessage];
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

            for (const label in newSet["variables"]) {
                if (!existingSet["variables"][label] || (existingSet["variables"][label] && replaceExisting)) {
                    existingSet["variables"][label] = newSet["variables"][label];
                }
            }

            existingSet["commands"] = sortHashTable(existingSet["commands"]);
            existingSet["variables"] = sortHashTable(existingSet["variables"]);
        }
        else {
            existingCollection[key] = newCollection[key];
        }
    }
    return sortHashTable(existingCollection);
}

export const cloneCollection = (collection) => {
    const clone = {}
    for (const key in collection) {
        clone[key] = {
            variables: { ...collection[key].variables },
            commands: { ...collection[key].commands }
        }
    }
    return clone;
}