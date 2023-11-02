const handleFindNearestTime = (timeStr1, timeStr2) => {
    function parseDateTime(timeStr) {
        var parts = timeStr.split(" ");
        var timeParts = parts[0].split(":");
        var dateParts = parts[1].split("/");

        var year = parseInt(dateParts[2], 10);
        var month = parseInt(dateParts[1], 10) - 1; // Tháng trong JavaScript bắt đầu từ 0
        var day = parseInt(dateParts[0], 10);
        var hour = parseInt(timeParts[0], 10);
        var minute = parseInt(timeParts[1], 10);

        return new Date(year, month, day, hour, minute);
    }

    var time1 = parseDateTime(timeStr1);
    var time2 = parseDateTime(timeStr2);

    // Thời gian hiện tại
    var currentTime = new Date();

    // Tính khoảng cách thời gian giữa các đối tượng Date
    var timeDifference1 = Math.abs(currentTime - time1);
    var timeDifference2 = Math.abs(currentTime - time2);

    // So sánh khoảng cách thời gian và lựa chọn chuỗi thời gian gần nhất
    var nearestTimeStr;

    if (timeDifference1 < timeDifference2) {
        nearestTimeStr = timeStr1;
    } else {
        nearestTimeStr = timeStr2;
    }
    return nearestTimeStr
}



//   const timeStrings = ["13:50 29/10/2023", "13:54 29/10/2023", "14:05 28/10/2023"];
//   const nearestTime = findNearestTime(timeStrings);

//   console.log("Thời gian gần nhất:", nearestTime);
module.exports = handleFindNearestTime