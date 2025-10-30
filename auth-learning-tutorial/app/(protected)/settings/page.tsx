"use client";

import { settings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormError } from "@/components/ui/form-error";
import { FormSuccess } from "@/components/ui/form-success";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/hooks/use-current-user";
import { SettingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { SelectValue } from "@radix-ui/react-select";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";




const SettingsPage= ()=>{
    const user=useCurrentUser();
    const {update} =useSession();
    const [error,setError]=useState<string | undefined>();
    const [success,setSuccess]=useState<string | undefined>();
    const [isPending,startTransition]=useTransition();

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver:zodResolver(SettingsSchema),
        defaultValues:{
            password:undefined,
            newPassword:undefined,
            name:user?.name || undefined,
            email:user?.email || undefined,
            role:user?.role || undefined,
        }
    });


    const onSubmit=(values:z.infer<typeof SettingsSchema>)=>{
        startTransition(()=>{
            settings(values)
              .then((data)=>{
                if(data.error){
                    setError(data.error);
                }

                if(data.success){
                    update();
                    setSuccess(data.success);
                }
              })
              .catch(()=>setError("Domething Went Wrong"));
        })
    }

    return(
        <div className="flex justify-center p-4 rounded-xl items-center max-h-screen px-4 sm:px-6 lg:px-8 bg-background">
            <Card className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl p-4 sm:p-6">
                <CardHeader>
                    <p className="text-2xl sm:text-3xl font-semibold text-center">
                        Settings
                    </p>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form action="" className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                <FormField
                                    control={form.control} 
                                    name="name"   
                                    render={({field})=>(
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="xyx" disabled={isPending}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                {user?.isOauth === false && (
                                    <>
                                        <FormField
                                            control={form.control} 
                                            name="email"   
                                            render={({field})=>(
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="xyx@example.com" type="email" disabled={isPending}/>
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
                                                        <Input {...field} placeholder="*******" type="password" disabled={isPending}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control} 
                                            name="newPassword"   
                                            render={({field})=>(
                                                <FormItem>
                                                    <FormLabel>New Password</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="*******" type="password" disabled={isPending}/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </>
                                )}

                                <FormField
                                    control={form.control} 
                                    name="role"   
                                    render={({field})=>(
                                        <FormItem>
                                            <FormLabel>Role</FormLabel>
                                            <Select
                                                disabled={isPending}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a Role"/>
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={UserRole.ADMIN}>
                                                        Admin
                                                    </SelectItem>
                                                    <SelectItem value={UserRole.USER}>
                                                        User
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                {user?.isOauth === false && (
                                    <FormField
                                        control={form.control} 
                                        name="isTwoFactorEnabled"   
                                        render={({field})=>(
                                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                <div className="space-y-0.5">
                                                    <FormLabel>Two Factor Authentication</FormLabel>
                                                    <FormDescription>
                                                        Enable Two Factor Authentication for your Account
                                                    </FormDescription>
                                                </div>
                                                <FormControl>
                                                    <Switch
                                                        disabled={isPending}
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                )}
                            </div>

                            <FormError message={error}/>
                            <FormSuccess message={success}/>
                            <Button type="submit" disabled={isPending}>
                                Save
                            </Button>
                        </form>
                    </Form>  
                </CardContent>
            </Card>
        </div>
    )
}

export default SettingsPage;