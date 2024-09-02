
const admin: any = {
  name: "Admin",
  password: "123456",
  email: "admin@gmail.colm",
  // role: USER_ROLE.admin,
};
const seedAdmin = async () => {
  // seed  admin
  // const isAdminExists = await UserModel.findOne({ role: admin.role, email: admin.email });
  // if (!isAdminExists) {
  //   try {
  //     await UserModel.create(admin);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
};

export default seedAdmin;
