import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps{
    children:React.ReactNode
}

const ProtectedLayout=({children}:ProtectedLayoutProps)=>{
    return (
        <div className="min-h-screen w-full flex flex-col items-center gap-y-6 sm:gap-y-10 bg-gradient-to-br from-black via-gray-900 to-black ">
            <Navbar/>
            <main className="w-full max-w-5xl flex justify-center">{children}</main>
        </div>
    )
}

export default ProtectedLayout;