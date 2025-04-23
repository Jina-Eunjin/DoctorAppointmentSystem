//React의 Context API를 사용하여 전역 상태 관리를 설정하는 기본적인 구조
// 즉, 애플리케이션 전반에서 데이터를 공유할 수 있도록 하는 컨텍스트(AppContext)를 만드는 코드


import { createContext } from "react";


//createContext()를 호출하여 AppContext를 생성
export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currency = '$'
    const calculateAge = (dob) => {
        const today = new Date()
        const birthDate = new Date(dob)

        let age = today.getFullYear() - birthDate.getFullYear()
        return age
    }

    const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const slotDateFormat = (slotDate) => {
        // console.log('slotDate:', slotDate)
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    const value = {
        currency, calculateAge, slotDateFormat
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider