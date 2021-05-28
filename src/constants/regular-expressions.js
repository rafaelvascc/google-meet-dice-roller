export const diceRegex = /^([+-]*)(\d*)d(\d+)(([hl])(\d+))?(([dm])(\d+))?(([\*+-])(\d+))?(([tn])(\d+))?$/;
export const constRegex = /^([+-])(\d+)$/;
export const commandRegex = /^((([+-]*)(\d*)d(\d+)(([hl])(\d+))?(([dm])(\d+))?(([\*+-])(\d+))?(([tn])(\d+))?)|\s|(([+-])(\d+)))+$/;
export const variableRegex = /^\-?((Math\.(ceil|floor|round)\(|\())?(\-?\(?(\d+|(\{([^.\s\/\\\{\}\(\)]+?)\})))\)?([\+\-\*\/]((Math\.(ceil|floor|round)\(|\())?(\d+|(\{([^.\s\/\\\{\}\(\)]+?)\}))\)?)*\)?$/;