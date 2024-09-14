import { TSettings } from "./settings.interface"
import { SettingsModel } from "./settings.mode"

const createSettingsIntoDb = async (payload: TSettings) => {
    const result = await SettingsModel.updateOne({label:payload.label},payload,{upsert:true})
    return result
}

export  const SettingsServices = {
    createSettingsIntoDb
}