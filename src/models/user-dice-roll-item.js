/** @class UserDiceRollItem represents an item in a user defined UserDiceRollSet.*/
class UserDiceRollItem {
    constructor(label, command) {
        this.label = label || '';
        this.command = command || '';
    }
}

export default UserDiceRollItem;