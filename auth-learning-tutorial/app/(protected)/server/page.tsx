
import { UserInfo } from "@/components/ui/user-info";
import { currentUser } from "@/lib/auth";

const ServerPage=async()=>{
    const session=await currentUser();
    return(
        <div className="w-[600px] pt-14">
            <UserInfo 
                user={session}
                label="Server Component"
            />
        </div>
    )
}

export default ServerPage;
