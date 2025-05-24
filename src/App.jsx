import { Routes, Route, useLocation, Router } from "react-router-dom";
import Landing from "./Landing"
//import SignUp from "./Components/Signup/signup";

import AfterSignInRedirect from "./afterSignInRedirect";
import ShowUp from "./pages/WelcomeScreen";
import AdminDashboard from "./adminResources/AdminDashboard";
import Res from "./pages/resident"
import Onboard from "./pages/onboard3";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import BlockedUser from "./adminResources/BlockedUser";
import FacilityStaff from "./pages/facilityStaff";
import ProtectedRoute from "./utils/ProtectedRoutes";

function App(){
return(
  
  <header>
      <Routes>
        <Route path="/" element={<Landing />} />
         

        <Route element={<ProtectedRoute allowedRoles={['resident']} />}>
            <Route path='/pages/resident' element={<Res/>}/>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/adminResources/AdminDashboard" element={<AdminDashboard/>} />
        </Route>

         <Route element={<ProtectedRoute allowedRoles={['Facility staff']} />}>
            <Route path="/pages/facilityStaff" element={<FacilityStaff />} />
         </Route>

         <Route element={<ProtectedRoute allowedRoles={['removed']} />}>
            <Route path="/adminResources/BlockedUser" element={<BlockedUser/>}/>
         </Route>

         <Route element={<ProtectedRoute allowedRoles={['none']} />}>
           <Route path="/pages/WelcomeScreen" element={<ShowUp />} />
            <Route path="/pages/onboard3" element={<Onboard />} />
         </Route>

      </Routes>
      <SignedOut> 
      </SignedOut>
      <SignedIn className = 'signIn'>
        <AfterSignInRedirect />
      </SignedIn>
    </header>
  
);    

}

export default App;