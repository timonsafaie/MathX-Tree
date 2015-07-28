function checkControl(key, cursor) {
    switch (key) {
    case 'Left':
        cursor.moveLeft();
        return true;
    case 'Right':
        cursor.moveRight();
        return true;
    case 'Backspace':
        cursor.delLeft();
        return true;
    default:
        return false;
    }
}
