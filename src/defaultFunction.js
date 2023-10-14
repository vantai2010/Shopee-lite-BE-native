
let registerAccount = async (req, res) => {
    try {
        let { email, password, rePassword } = req.body;

        if (!email || !password || !rePassword) {
            return res.status(200).json({
                errCode: 1,
                messageEN: "Missing information in request ",
                messageVI: "Thiếu thông tin chuyền lên "
            })
        }
        let response = await appService.registerAccount(req.body)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(400).json({
            errCode: -1,
            messageEN: 'ERROR from to server ',
            messageVI: "Có lỗi từ phía server "
        })
    }
}



let registerAccounts = () => {
    return new Promise(async (resolve, reject) => {
        try {

        } catch (error) {
            reject(error);
        }
    })
}


// router.post("/r", (req, res) => {
//     let formidable = require("formidable")

//     var form = new formidable.IncomingForm()
//     form.uploadDir = "./upload"
//     form.keepExtensions = true
//     form.maxFieldsSize = 10 * 1024 * 1024
//     form.multiple = true
//     form.parse(req, (err, fields, files) => {
//         if (err) {
//             res.json({
//                 result: false,
//                 data: {},
//                 message: `Cannot upload image ${err}`
//             })
//         }
//         var arrayOfFiles = files[""]
//         if (arrayOfFiles.length > 0) {
//             var fileNames = []
//             arrayOfFiles.forEach(eachTime => {
//                 fileNames.push(eachTime.path.split("/")[1])
//             })
//             res.json({
//                 result: true,
//                 data: fileNames,
//             })
//         } else {
//             res.json({
//                 result: false,
//                 data: {},
//             })
//         }
//     })
// })