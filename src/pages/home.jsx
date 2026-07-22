
import { ApiFetching } from "../components/apiProducts";
import { SidebarHeader } from "../components/sidebarheader";


function Home(){

  const token = localStorage.getItem("token")
    if(!token){
      localStorage.setItem("token")
      setTimeout(() => {
          window.location.replace("/") 
      }, 500);
    }

    return(
        <>
         <SidebarHeader/>
         <ApiFetching/> 
        </>
    )
}

export{Home}