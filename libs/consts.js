/**
 * @readonly
 * @enum {Number}
 */
var TTL = {
    NoExpiring: -1,
    ExpireOnWatchfaceEnter: -2
};

/**
 * @readonly
 * @enum {String}
 */
var Actions = {
    None: 'NONE',
    ChangeToNextWatchface: 'CHANGE_TO_NEXT_WATCHFACE',
    ChangeToPreviousWatchface: 'CHANGE_TO_PREVIOUS_WATCHFACE',
    ChangeWatchface: 'CHANGE_WATCHFACE',
    SendValueToCloud: 'SEND_VALUE_TO_CLOUD'
};

/**
 * @readonly
 * @enum {String}
 */
var Animations = {
    None: 'NONE',
    UpIn: 'UP_IN',
    UpOut: 'UP_OUT',
    DownIn: 'DOWN_IN',
    DownOut: 'DOWN_OUT',
    LeftIn: 'LEFT_IN',
    LeftOut: 'LEFT_OUT',
    RightIn: 'RIGHT_IN',
    RightOut: 'RIGHT_OUT'
};

module.exports = {
    TTL: TTL,
    Actions: Actions,
    Animations: Animations
};