import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { PatientRoutes } from "../modules/patient/patient.route";
import { DoctorRoute } from "../modules/doctor/doctor.route";
import { UserRoutes } from "../modules/user/user.route";
import { WeightRoutes } from "../modules/weight/weight.route";
import { BloodPressureRoutes } from "../modules/bloodPressure/bloodPressure.route";
import { GlucoseRoutes } from "../modules/glucose/glucose.route";

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
    path:"/user",
    route:UserRoutes
},
{
    path:"/doctor",
    route: DoctorRoute
}
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
