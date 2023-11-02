const handleDuplicate = (arr) => {
    const uniqueArr = arr.reduce((accumulator, currentValue) => {
        if (!accumulator.includes(currentValue)) {
            accumulator.push(currentValue);
        }
        return accumulator;
    }, []);
    return uniqueArr
}

module.exports = handleDuplicate