import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export const HomeLayout = ()=>{
return(
    <Link to='/auth/login'>
        <Button>Login</Button>
    </Link>
)
}