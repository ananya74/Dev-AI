import { Navbar } from "./_components/navbar";

interface ProtectedLayoutProps{
    children:React.ReactNode
}

const ProtectedLayout=({children}:ProtectedLayoutProps)=>{
    return (
        <div className="min-h-screen w-full flex flex-col items-center gap-y-6 sm:gap-y-10 bg-[radial-gradient(ellipse_at_top,_#38bdf8,_#1e40af)] px-3 sm:px-6 py-4">
            <Navbar/>
            <main className="w-full max-w-5xl flex justify-center">{children}</main>
        </div>
    )
}

export default ProtectedLayout;