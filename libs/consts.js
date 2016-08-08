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
    SendValueToCloud: 'SEND_VALUE_TO_CLOUD',
    RefreshElement: 'REFRESH_ELEMENT'
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

var Buttons = {
    Up: 'UP',
    Middle: 'MIDDLE',
    Down: 'DOWN'
};

var ButtonEvents = {
    StartPress: 'START_PRESS',
    Press: 'PRESS'
};

/**
 * @readonly
 * @enum {String}
 */
var PushType = Object.freeze({
    STREAM_PUSH_DATA: 3,
    STREAM_PUSH_TOAST_DATA: 9
});

module.exports = {
    TTL: TTL,
    Actions: Actions,
    Animations: Animations,
    Buttons: Buttons,
    ButtonEvents: ButtonEvents,
    PushType: PushType
};