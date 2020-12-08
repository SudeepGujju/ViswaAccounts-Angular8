import * as moment from 'moment';

export function formatDate(date) {

    const momentDate = moment(date); // , 'DD/MM/YYYY', true);

    return momentDate.format('DD/MM/YYYY');
}

export function parseDate(date) {

    if (!date) {
        throw Error('Invalid argument');
    }

    const momentDate = moment(date, 'DD/MM/YYYY', true);

    if (!momentDate.isValid()) {
        throw Error('Invalid date string');
    }
    // console.log(momentDate.toDate().getTimezoneOffset())
    return momentDate.toDate();

}
