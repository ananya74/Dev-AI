/* import { ExtendedUser } from "@/next-auth";
import { User } from "next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";

interface UserInfoProps{
    user?:ExtendedUser;
    label:string;
}

export const UserInfo=({
    user,
    label,
}:UserInfoProps)=>{
    return (
        <Card className="w-[600px] bg-white/90 backdrop-blur-sm shadow-md rounded-2xl">
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center">
                    {label}
                </CardTitle>
                
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        ID
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-200 rounded-md">
                        {user?.id}
                    </p>
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Name
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-200 rounded-md">
                        {user?.name}
                    </p>
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Email
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-200 rounded-md">
                        {user?.email}
                    </p>
                </div>

                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Role
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-200 rounded-md">
                        {user?.role}
                    </p>
                </div>
                
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Two Factor Authentication
                    </p>
                    <Badge variant={user?.isTwoFactorEnabled ? "success":"destructive" }>
                        {user?.isTwoFactorEnabled ? "ON" :"OFF"}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}
 */


import { ExtendedUser } from "@/next-auth";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import { ShieldCheck, Mail, User, Key, Lock } from "lucide-react";

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
}

export const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card className="w-full max-w-md sm:max-w-lg bg-white/10 dark:bg-black/30 backdrop-blur-md shadow-2xl rounded-2xl border border-white/20 text-white ">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-white tracking-wide">
          {label}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 px-6 pb-6">
        {/* ID */}
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-3 shadow-sm transition">
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 opacity-70" />
            <p className="text-sm font-medium">ID</p>
          </div>
          <p className="truncate text-xs max-w-[200px] font-mono bg-black/20 px-2 py-1 rounded-md">
            {user?.id}
          </p>
        </div>

        {/* Name */}
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-3 shadow-sm transition">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 opacity-70" />
            <p className="text-sm font-medium">Name</p>
          </div>
          <p className="truncate text-xs max-w-[200px] font-mono bg-black/20 px-2 py-1 rounded-md">
            {user?.name}
          </p>
        </div>

        {/* Email */}
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-3 shadow-sm transition">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 opacity-70" />
            <p className="text-sm font-medium">Email</p>
          </div>
          <p className="truncate text-xs max-w-[200px] font-mono bg-black/20 px-2 py-1 rounded-md">
            {user?.email}
          </p>
        </div>

        {/* Role */}
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-3 shadow-sm transition">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 opacity-70" />
            <p className="text-sm font-medium">Role</p>
          </div>
          <p className="truncate text-xs max-w-[200px] font-mono bg-black/20 px-2 py-1 rounded-md">
            {user?.role}
          </p>
        </div>

        {/* 2FA */}
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 p-3 shadow-sm transition">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 opacity-70" />
            <p className="text-sm font-medium">Two Factor Authentication</p>
          </div>
          <Badge
            variant={user?.isTwoFactorEnabled ? "success" : "destructive"}
            className="px-3 py-1 text-xs"
          >
            {user?.isTwoFactorEnabled ? "ON" : "OFF"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
