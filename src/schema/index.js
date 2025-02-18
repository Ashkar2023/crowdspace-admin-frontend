import * as yup from "yup";
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const signupSchema = yup.object().shape({
    username:yup.string().min(3).max(50).required("required"),
    email:yup.string().email("please enter a valid email").required("required"),
    password:yup.string().min(5).matches(passwordRegex,{message:"create a stronger password"}).required("required")
})

export const addUserShchema = yup.object().shape({
    email:yup.string().email("please enter a valid email").required("required"),
    password:yup.string().min(5).matches(passwordRegex,{message:"create a stronger password"}).required("required")
})

