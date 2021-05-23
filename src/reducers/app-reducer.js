import update from 'immutability-helper';
import _ from 'lodash';
import {
    LOAD_DICE_ROLL_SETS,
    ADD_DICE_ROLL_SET,
    DELETE_DICE_ROLL_SET,
    ADD_DICE_ROLL,
    DELETE_DICE_ROLL,
    EDIT_DICE_ROLL
} from './actions.js';
import UserDiceRollSet from '../models/user-dice-roll-set';
import UserDiceRollItem from '../models/user-dice-roll-item';

const initialState = []; //TODO: load from saved data

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_DICE_ROLL_SETS: {
            return action.payload;
        }
        case ADD_DICE_ROLL_SET: {
            const newState = update(state, { $push: [new UserDiceRollSet(action.payload)] });
            return newState;
        }
        case DELETE_DICE_ROLL_SET: {
            const filtered = state.filter(e => e.name !== action.payload);
            return filtered;
        }
        case ADD_DICE_ROLL: {
            const set = state.find(e => e.name === action.payload.setName);
            const newUserDiceRollCommand = new UserDiceRollItem(action.payload.label, action.payload.command);
            set.items.push(newUserDiceRollCommand);
            set.items.sort((a, b) => a.label.toUpperCase() > b.label.toUpperCase() ? 1 : (a.label.toUpperCase() < b.label.toUpperCase() ? -1 : 0));
            return _.cloneDeep(state);
        }
        case EDIT_DICE_ROLL: {
            const set = state.find(e => e.name === action.payload.setName);
            const cmd = set.items.find(e => e.label === action.payload.oldLabel);
            cmd.label = action.payload.newLabel;
            cmd.command = action.payload.newCommand;
            return _.cloneDeep(state);
        }
        case DELETE_DICE_ROLL: {
            let set = state.find(e => e.name === action.payload.setName);
            set.items = set.items.filter(e => e.label !== action.payload.label);
            return _.cloneDeep(state);
        }
        default: {
            return state;
        }
    }
}

export default appReducer;