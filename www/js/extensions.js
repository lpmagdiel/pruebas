function arrayTop(array) {
    var value = undefined;

    if(array.length > 0){
        value = array[array.length-1];
    }
    else {
        value = array[0]
    }

    return value;
}