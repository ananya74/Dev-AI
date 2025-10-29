import {Resend} from "resend";
import { email } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async(
    email:string,
    token:string,
)=>{
    const resetLink=`http://localhost:3000/auth/new-password?token=${token}`
    await resend.emails.send({
        from:"onboarding@resend.dev",
        to:email,
        subject:"Reset your Password",
        html:`<p>Click <a href="${resetLink}">here</a> to reset password</p>`
    })
}


export const sendVerificationEmail=async(
    email:string,
    token:string
)=>{
    const confirmLink=`http://localhost:3000/auth/new-verification?token=${token}`;
    await resend.emails.send({
        from:"onboarding@resend.dev",
        to:email,
        subject:"Confirm your Email",
        html:`<p>Click <a href="${confirmLink}">here</a> to confirm email</p>`
    });
}

export const sendTwoFactorEmail = async(
    email:string,
    token:string,
)=>{
    await resend.emails.send({
        from:"onboarding@resend.dev",
        to:email,
        subject:"2 FA Code",
        html:`<p>Your 2 FA Code:${token}</p>`
    });
}
