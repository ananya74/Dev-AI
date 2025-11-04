"use client";
import * as z from "zod";
import { CardWrapper } from "@/components/auth/card-wrapper"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterSchema} from "@/schemas";
import {Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { useState,useEffect, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import { register } from "@/actions/register";


export const RegisterForm=()=>{
    const [error,setError]=useState<string | undefined>("");
    const [isPending,setTransition]=useTransition();
    const[success,setSuccess]=useState<string | undefined>("")
    const form=useForm<z.infer<typeof RegisterSchema>>({
        resolver:zodResolver(RegisterSchema),
        defaultValues:{
            email:"",
            password:"",
            name:"",
        },
    })
    const onSubmit =(values:z.infer<typeof RegisterSchema>)=>{
        setError("");
        setSuccess("");
        setTransition(()=>{
            register(values)
                .then((data)=>{
                    setError(data.error);
                    setSuccess(data.success)
                })
        })
    }

    const CountdownTimer = ({ initialMinutes = 5 }: { initialMinutes?: number }) => {
        const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);

        useEffect(() => {
            if (timeLeft <= 0) return;
            const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }, [timeLeft]);

        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        return (
            <span className="bg-green-700 px-3 py-1 rounded-md text-sm font-semibold">
            {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
        );
    };




    return(
        <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-gray-900 via-gray-950 to-black p-4">
            {success && (
                <div className="fixed top-0 left-0 w-full h-[40px] z-50 bg-green-600 text-white text-center py-4 text-base font-medium shadow-md flex items-center justify-center gap-4">
                    <span>Verification email sent! Please verify your account.</span>
                    <CountdownTimer initialMinutes={5} />
                </div>
            )}

        
            <CardWrapper
                headerLabel="Create an Account"
                backButtonLabel="Already have an Account"
                backButtonHref="/auth/login"
                showSocial
            >
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="xyz abc"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="xyz@example.com"
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="******"
                                            disabled={isPending}
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button disabled={isPending} type="submit" className="w-full">
                        Create an Account
                    </Button>
                    </form>
                </Form>
            </CardWrapper>
        </div>
    )
}