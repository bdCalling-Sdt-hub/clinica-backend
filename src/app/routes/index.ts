import { Router } from "express";
import { AuthRoute } from "../modules/auth/auth.route";
import { PatientRoute } from "../modules/patient/patient.route";
import { DoctorRoute } from "../modules/doctor/doctor.route";
import { UserRoutes } from "../modules/user/user.route";

const router = Router();

const moduleRoutes = [
 { path:"/auth",
    route: AuthRoute
},
{
    path:"/patient",
    route: PatientRoute
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
