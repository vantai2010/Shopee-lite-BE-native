const handleCheckUpdate = (value) => {
    if (!value) {
        return {
            errCode: -1,
            messageEN: "Update failed",
            messageVI: "Cập nhật thông tin thất bại"
        }
    }
    return {
        errCode: 0,
        messageEN: "Update successful",
        messageVI: "Cập nhật thông tin thành công"
    }
}

const handleCheckCreate = (value) => {
    if (!value) {
        return {
            errCode: -1,
            messageEN: "Create information failed",
            messageVI: "Tạo thông tin thất bại"
        }
    }
    return {
        errCode: 0,
        messageEN: "Create information successful",
        messageVI: "Tạo thông tin thành công"
    }
}

const handleCheckDelete = (value) => {
    if (!value) {
        return {
            errCode: -1,
            messageEN: "Delete information failed",
            messageVI: "Xóa thông tin thất bại"
        }
    }
    return {
        errCode: 0,
        messageEN: "Delete information successful",
        messageVI: "Xóa thông tin thành công"
    }
}

const formGetDataFail = () => {
    return {
        errCode: 1,
        messageEN: "Get data failed",
        messageVI: "không tìm thấy thông tin phù hợp"
    }
}


module.exports = {
    handleCheckUpdate,
    handleCheckCreate,
    handleCheckDelete
}
