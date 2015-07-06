function checkControl(key, cursor) {
    switch (key) {
    case 'Left':
        cursor.movePrev();
        return true;
    case 'Right':
        cursor.moveNext();
        return true;
    default:
        return false;
    }
}
