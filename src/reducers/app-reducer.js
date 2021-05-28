import _ from 'lodash';
import {
    LOAD_DICE_ROLL_SETS,
    IMPORT_DICE_ROLL_SETS,
    ADD_DICE_ROLL_SET,
    DELETE_DICE_ROLL_SET,
    ADD_DICE_ROLL,
    DELETE_DICE_ROLL,
    EDIT_DICE_ROLL
} from './actions.js';
import { sortHashTable, cloneCollection, mergeCollections } from '../models/dice-roll-utils';
import UserDiceRollSet from '../models/user-dice-roll-set';

const initialState = {};

const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_DICE_ROLL_SETS: {
            return action.payload;
        }
        case IMPORT_DICE_ROLL_SETS: {
            const merged = mergeCollections(state, action.payload);
            return cloneCollection(merged);
        }
        case ADD_DICE_ROLL_SET: {
            state[action.payload] = new UserDiceRollSet();
            return sortHashTable(cloneCollection(state));
        }
        case DELETE_DICE_ROLL_SET: {
            delete state[action.payload];
            return cloneCollection(state);
        }
        case ADD_DICE_ROLL: {
            state[action.payload.setName]["commands"][action.payload.label] = action.payload.command;
            state[action.payload.setName]["commands"] = sortHashTable(state[action.payload.setName]["commands"]);
            return cloneCollection(state);
        }
        case EDIT_DICE_ROLL: {
            state[action.payload.setName]["commands"][action.payload.newLabel] = action.payload.newCommand;
            if (action.payload.newLabel !== action.payload.oldLabel) {
                delete state[action.payload.setName]["commands"][action.payload.oldLabel];
                state[action.payload.setName]["commands"] = sortHashTable(state[action.payload.setName]["commands"]);
            }
            return cloneCollection(state);
        }
        case DELETE_DICE_ROLL: {
            delete state[action.payload.setName]["commands"][action.payload.label];
            return cloneCollection(state);
        }
        default: {
            return state;
        }
    }
}

export default appReducer;