import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { PatientRoutes } from "../modules/patient/patient.route";
import { DoctorRoute } from "../modules/doctor/doctor.route";
import { UserRoutes } from "../modules/user/user.route";
import { WeightRoutes } from "../modules/weight/weight.route";
import { BloodPressureRoutes } from "../modules/bloodPressure/bloodPressure.route";
import { GlucoseRoutes } from "../modules/glucose/glucose.route";
import { HealthRecordRoutes } from "../modules/healthRecord/healthRecord.route";
import { SettingsRoutes } from "../modules/settings/settings.route";

const router = Router();

const moduleRoutes = [
 { path:"/auth",
    route: AuthRoutes
},
{
    path:"/patient",
    route: PatientRoutes
},
{
    path:"/weight",
    route: WeightRoutes
},
{
    path:"/blood-pressure",
    route: BloodPressureRoutes
},
{
path:"/glucose",
route: GlucoseRoutes
},
{
    path:"/health-record",
    route: HealthRecordRoutes
},
{
    path:"/user",
    route:UserRoutes
},
{
    path:"/doctor",
    route: DoctorRoute
},
{
    path:"/settings",
    route: SettingsRoutes
}
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
