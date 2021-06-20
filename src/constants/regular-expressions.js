export const labelOrNameRegexStr = '[^.\\s+\\-*(){}\\[\\]/\\\\]+';
export const diceRegexStr = `(?<diceCount>([+-]?(\\d+|\\{${labelOrNameRegexStr}?\\}))?([+-](\\d+|\\{${labelOrNameRegexStr}?\\}))*)(d(?<sides>\\d+)){1}`;
export const constRegexStr = `(?<=([dhlm])\\d+)(?<constant>(\\(*(?<constOp>[\\*+-])?\\(*(?<constValue>\\-?\\d+|\\-?\\{${labelOrNameRegexStr}?\\})\\)*)+)`;
export const hlRegexStr = `(?<hl>(?<hlOp>[hl])\\(?(?<hlVal>\\-?(\\d+|\\{${labelOrNameRegexStr}?\\}))\\)?)`;
export const dmRegexStr = `(?<dm>(?<dmOp>[dm])\\(?(?<dmVal>\\-?(\\d+|\\{${labelOrNameRegexStr}?\\}))\\)?)`;
export const tnRegexStr = `(?<tn>(?<tnOp>[tn])\\(?(?<tnVal>\\-?(\\d+|\\{${labelOrNameRegexStr}?\\}))\\)?)`;
export const diceCommandRegexStr = `${diceRegexStr}(${hlRegexStr})?(${dmRegexStr})?(${constRegexStr})?(${tnRegexStr})?`;
export const constOnlyRegexSrt = `(?<constExp>([+-](\\d+|\\{${labelOrNameRegexStr}?\\}))+)`

export const labelOrNameRegexNoGlobal = new RegExp(`^${labelOrNameRegexStr}$`);
export const diceCommandRegex = new RegExp(`${diceCommandRegexStr}`, 'g');
export const constOnlyRegex = new RegExp(`^${constOnlyRegexSrt}$`, 'g');
export const diceCommandRegexNoGlobal = new RegExp(`^${diceCommandRegexStr}$`);
export const constOnlyRegexNoGlobal = new RegExp(`^${constOnlyRegexSrt}$`);
export const commandRegex = new RegExp(`^((?:${diceCommandRegexStr})|(?:\\s)|(?:${constOnlyRegexSrt}))+$`);

export const variableRegexStr = `\\(*[+\\-\\*\\/]?\\(*(ceil|floor|round\\()?\\(*[+\\-\\*\\/]?\\(*(\\d+|\\{${labelOrNameRegexStr}?\\})\\)*`;
export const variableRegex = new RegExp(`^(?:${variableRegexStr})+$`);
export const variableLabelInExpressionRegex = /\{(?<label>[^.\s+\-*(){}\[\]/\\]+?)\}/g;
export const variableLabelInExpressionRegexNonGlobal = /\{(?<label>[^.\s+\-*(){}\[\]/\\]+?)\}/;