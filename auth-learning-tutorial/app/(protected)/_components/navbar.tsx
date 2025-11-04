/* "use client";

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
} */

"use client";

import { UserButton } from "@/components/auth/userbutton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MessageCircle, Server, Settings } from "lucide-react";

export const Navbar = () => {
  const pathname = usePathname();

  const links = [
    { href: "/server", label: "Server", icon: Server },
    { href: "/chat", label: "Chat", icon: MessageCircle },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-[800px] backdrop-blur-lg bg-white/15 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-3 sm:p-4 flex flex-wrap justify-between items-center gap-3 sm:gap-4 max-w-4xl mx-auto sticky top-4 z-50"
    >
      {/* Left Side — Navigation Links */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
        {links.map(({ href, label, icon: Icon }) => (
          <Button
            key={href}
            asChild
            variant="ghost"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 
              ${
                pathname === href
                  ? "bg-primary text-white shadow-md hover:shadow-lg"
                  : "bg-white/20 hover:bg-white/30 dark:bg-white/10 dark:hover:bg-white/20 text-white"
              }`}
          >
            <Link href={href}>
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline font-medium">{label}</span>
            </Link>
          </Button>
        ))}
      </div>

      {/* Right Side — User Menu */}
      <div className="flex items-center">
        <UserButton />
      </div>
    </motion.nav>
  );
};


