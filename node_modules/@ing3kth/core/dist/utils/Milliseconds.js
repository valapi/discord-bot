"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToMilliseconds = void 0;
/**
 *
 * @param {Number} data Milliseconds
 * @returns {IMilliseconds}
 */
function ToMilliseconds(data) {
    let ms_total = data;
    let second_total = 0;
    let minute_total = 0;
    let hour_total = 0;
    let day_total = 0;
    let ms = ms_total;
    let second = 0;
    let minute = 0;
    let hour = 0;
    let day = 0;
    for (ms >= 1000; ms >= 1000;) {
        ms -= 1000;
        second += 1;
        second_total += 1;
    }
    for (second >= 60; second >= 60;) {
        second -= 60;
        minute += 1;
        minute_total += 1;
    }
    for (minute >= 60; minute >= 60;) {
        minute -= 60;
        hour += 1;
        hour_total += 1;
    }
    for (hour >= 24; hour >= 24;) {
        hour -= 24;
        day += 1;
        day_total += 1;
    }
    return {
        data: {
            day: day,
            hour: hour,
            minute: minute,
            second: second,
            milliseconds: ms,
        },
        all: {
            day: day_total,
            hour: hour_total,
            minute: minute_total,
            second: second_total,
            milliseconds: ms_total,
        }
    };
}
exports.ToMilliseconds = ToMilliseconds;
//# sourceMappingURL=Milliseconds.js.map