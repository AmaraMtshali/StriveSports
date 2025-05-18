import './signup.css';
import volly from '../../assets/images/volly.png';
import hockey from '../../assets/images/hockeysign.png';
import football from '../../assets/images/football.png';
import gloves from '../../assets/images/gloves.png';
import ball5 from '../../assets/images/ball5.png';
import baseball from '../../assets/images/baseball.png';
import { SignInButton } from "@clerk/clerk-react";

function SignUp(){
    return(
    <section className="signup-section">
        <section className="text">
            <h1>Sign in</h1>
        </section>
        {/* <figure className="card" id="card-1"> */} 
          {/* <img src={volly}/> */}
        {/* </figure> */}
          {/* // <figure className="card" id="card-2"> */}
          {/* <img src={hockeysign} /> */}
        {/* </figure>   */}
        {/* // <figure className="card" id="card-3"> */}
          {/* <img src={football}  /> */}
        {/* </figure> */}
        {/* // <figure className="card" id="card-4"> */}
          {/* <img src={gloves} /> */}
        {/* </figure> */}
        {/* // <figure className="card" id="card-5"> */}
          {/* <img src={ball5}/> */}
        {/* </figure> */}
        {/* // <figure className="card" id="card-6"> */}
          {/* <img src={baseball}/> */}
        {/* </figure> */}
    <section className="buttons">
    <SignInButton redirectUrl="/pages/WelcomeScreen">
        <button className="signinButton">Sign In</button>
    </SignInButton>
    </section>
    </section>
);
  

};
export default SignUp;