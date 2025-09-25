export const BASE_URL = "https://karma-backend-kcn4.onrender.com/api";

const Apis = {
  AUTH: {
    AVATAR: "/auth/avatar",
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    GOOGLE: "/auth/google",
    ME: "/auth/me",
  },
  GOAL: "/goals",
  TRANSACTION: "/transactions",
};

Object.freeze(Apis);

export default Apis;
