import doctorModel from "../models/doctorModel.js"


const changeAvailability = async (req, res) => {
    try {

        const { docId } = req.body

        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !docData.available })

        //res.json()**은 서버에서 클라이언트로 JSON 데이터를 보내는 데 사용
        res.json({ success: true, message: 'Availability changed' })

        // // 의사의 'available' 상태를 반전하여 업데이트
        // const updatedDoc = await doctorModel.findByIdAndUpdate(
        //     docId,
        //     { available: !docData.available },
        //     { new: true } // ✅ 업데이트된 문서를 반환하도록 설정
        // );

        // res.json({ success: true, message: "Availability changed", doctor: updatedDoc });


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const doctorList = async (req, res) => {
    try {
        //find({})**는 Mongoose에서 문서를 조회하는 메서드, {}는 빈 객체로, 이 조건은 모든 의사 데이터를 가져오라는 의미
        const doctors = await doctorModel.find({}).select('-password -email');
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { changeAvailability, doctorList }