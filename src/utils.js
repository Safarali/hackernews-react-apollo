const timeDifference = (current, previous) => {

    const roundNumber = number => Math.round(number);

    const milliSecondsPerMinute = 60 * 1000;
    const milliSecondsPerHour = milliSecondsPerMinute * 60;
    const milliSecondsPerDay = milliSecondsPerHour * 24;
    const milliSecondsPerMonth = milliSecondsPerDay * 30;
    const milliSecondsPerYear = milliSecondsPerDay * 365;

    const elapsed = current - previous;

    if (elapsed < milliSecondsPerMinute / 3) {
        return 'just now';
    };


    if (elapsed < milliSecondsPerMinute) {
        return 'less than 1 min ago'
    } else if (elapsed < milliSecondsPerHour) {
        return `${roundNumber(elapsed / milliSecondsPerMinute)} min ago`;
    } else if (elapsed < milliSecondsPerDay) {
        return `${roundNumber(elapsed / milliSecondsPerHour)} hour ago`;
    } else if (elapsed < milliSecondsPerMonth) {
        return `${roundNumber(elapsed / milliSecondsPerDay)} days ago`;
    } else if (elapsed < milliSecondsPerYear) {
        return `${roundNumber(elapsed / milliSecondsPerMonth)} months ago`;
    } else {
        return `${roundNumber(elapsed / milliSecondsPerYear)} years ago`;
    }
};

const timeDifferenceForDate = date => {
    const now = new Date().getTime();
    const updated = new Date(date).getTime();
    return timeDifference(now, updated);
};

export { timeDifferenceForDate };
