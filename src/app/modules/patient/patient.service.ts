import QueryBuilder from "../../builder/QueryBuilder"
import PatientModel from "./patient.model"

const getAllPatientsFromDb = async(query: Record<string, unknown>) => {
    const patientQuery = new QueryBuilder(PatientModel.find({isDelete:false,isActive:true}).populate("user"),query).search(["name"]).filter().sort().paginate().fields();
    const meta = await patientQuery.countTotal();
    const patients = await patientQuery.modelQuery;
    return { meta, patients };
}

const getSinglePatientFromDb = async(slug:string) => {
    const result = await PatientModel.findOne({slug,isDelete:false,isActive:true}).populate("user");
    return result
}

const getPatientProfile = async() => {
    console.log("get patient profile")
}

const updatePatientProfile = async() => {
    console.log("update patient profile")
}




export const PatientServices = {
    getAllPatientsFromDb,
    getSinglePatientFromDb,
    getPatientProfile,
    updatePatientProfile
}