/** @class UserDiceRollSet represents a named set of user defined saved dice rolls and constants.*/
class UserDiceRollSet {
    constructor(name) {
        this.name = name || '';
        this.items = [];
    }
}

export default UserDiceRollSet;