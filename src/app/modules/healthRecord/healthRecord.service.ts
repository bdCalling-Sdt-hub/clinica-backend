import { TTokenUser } from "../../types/common"

const uploadHealthRecordIntoDb = async (user:TTokenUser) => {
    console.log(user)
}

const getHealthRecordFromDb = async (user:TTokenUser) => {
    console.log(user)
}


export const HealthRecordServices = {
    uploadHealthRecordIntoDb,
    getHealthRecordFromDb
}