"use client";

import { UserButton } from "@/components/auth/userbutton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar=()=>{
    const pathname=usePathname();
    return(
        <nav className="bg-secondary w-full max-w-2xl mx-auto flex flex-wrap justify-between items-center p-3 sm:p-4 rounded-xl shadow-sm gap-2">
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start w-full sm:w-auto">
                <Button asChild variant={pathname === '/server' ? 'default' : 'outline'}>
                    <Link href="/server">
                        Server
                    </Link>
                </Button>
                
                
                <Button asChild variant={pathname === '/settings' ? 'default' : 'outline'}>
                    <Link href="/settings">
                        Settings
                    </Link>
                </Button>

                <Button asChild variant={pathname === '/chat' ? 'default' : 'outline'}>
                    <Link href="/chat">
                        Chat
                    </Link>
                </Button>


            </div>
            <p><UserButton/></p>
        </nav>
    )
}