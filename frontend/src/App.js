import { useEffect,useState } from 'react';
import './App.css';
import {BrowserRouter , Route,Routes,Navigate,useNavigate } from "react-router-dom";
import Header from './components/Header.js';
import Home from './screens/Home';
import Register from './screens/Register';
import Login from './screens/Login';
import LoadingSpinner from './components/LoadingSpinner';
import Admin from './screens/Admin';
import Axios from "axios"
import Error404 from './screens/Error404';
import { parseJwt,BACKEND_DOMAIN } from './tools';
import Landing from './screens/Landing';
import Soon from './screens/Soon';
import Verifyemail from './screens/Verifyemail';
import Resendemailverification from './screens/Resendemailverification';
import Resendpassowrdreset from './screens/Resendpassowrdreset';
import ResetPassword from './screens/ResetPassword';
import Settings from './screens/Settings';
import Admincode from './screens/Admincode';
import Wallet from './screens/Wallet';
import Adminteacher from './screens/Adminteacher';
import Users from './screens/Users';
import Adminquestion from './screens/Adminquestion';
import Adminexam from './screens/Adminexam';
import Exams from './screens/Exams';
import SovleExam from './screens/SovleExam';
import Adminurl from './screens/Adminurl';
import Url from './screens/Url';
import Upload from './screens/Upload';
import Adminblock from './screens/Adminblock';
import Adminsection from './screens/Adminsection';
import Admincourse from './screens/Admincourse';
import Courses from './screens/Courses';
import CoursePage from './screens/CoursePage';
import SectionPage from './screens/SectionPage';
import Examsloged from './screens/Examsloged';
import SovleExamloged from './screens/SovleExamloged';
import Mysections from './screens/Mysections';
import Adminproduct from './screens/Adminproduct';
import Products from './screens/Products';
import Calc from './screens/Calc';
import Adminorder from './screens/Adminorder';
import { MyContext } from './tools';
import SkillPage from './screens/SkillPage';
import Skill from './screens/Skill';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  const [islogedin, setislogedin] = useState(false)
  const [loaded, setloaded] = useState(false)
  const [Money, setMoney] = useState(0)
  useEffect(() => {
    Axios.get( 
      BACKEND_DOMAIN+'/api/auth/isloggedin',
      {headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }}
    ).then(response=>{
      if(response.data == "not authorized")
      {
        setislogedin(false);
        localStorage.setItem("token",null);
      }
      else if (response.data == "logedin")
      {
        setislogedin(true);
      }
      setloaded(true);
    }).catch(e=>{
      if(e.response.data === "not authorized")
      {
        setislogedin(false);
        localStorage.setItem("token",null);
      }
      else if (e.response.data === "logedin")
      {
        setislogedin(true);
      }
      setloaded(true);
    })
  }, [])

  return (
    <MyContext.Provider value={{ Money, setMoney }}>
      <HelmetProvider>
    <BrowserRouter>
      {
        loaded?
        islogedin?
        <>
          <Header/>
          <Routes>
            <Route path="*" exact element={<Error404/>} />
            <Route path="/" exact element={<Home/>} />
            <Route path="/url/:id" exact element={<Url/>} />
            <Route path="/Error404" exact element={<Error404/>} />
            <Route path="/soon" exact element={<Soon/>} />
            <Route path="/Kqw86u/home" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="nd"?<Admin/>:<Error404/>} />
            <Route path="/Kqw86u/code" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="nd"?<Admincode/>:<Error404/>} />
            <Route path="/Kqw86u/addteacher" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="nd"?<Adminteacher/>:<Error404/>} />
            <Route path="/Kqw86u/users" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="nd"?<Users/>:<Error404/>} />
            <Route path="/Kqw86u/questions" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="nd"?<Adminquestion/>:<Error404/>} />
            <Route path="/Kqw86u/exams" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="nd"?<Adminexam/>:<Error404/>} />
            <Route path="/Kqw86u/url" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="nd"?<Adminurl/>:<Error404/>} />
            <Route path="/Kqw86u/upload" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="nd"?<Upload/>:<Error404/>} />
            <Route path="/Kqw86u/block" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="nd"?<Adminblock/>:<Error404/>} />
            <Route path="/Kqw86u/section" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="nd"?<Adminsection/>:<Error404/>} />
            <Route path="/Kqw86u/course" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="nd"?<Admincourse/>:<Error404/>} />
            <Route path="/Kqw86u/product" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="nd"?<Adminproduct/>:<Error404/>} />
            <Route path="/Kqw86u/order" exact element={islogedin&&parseJwt(localStorage.getItem("token"))?.role==="nd"?<Adminorder/>:<Error404/>} />
            <Route path="/register" exact element={!islogedin?<Register/>:<Navigate to="/" replace={true}/>} />
            <Route path="/login" exact element={!islogedin?<Login/>:<Navigate to="/" replace={true}/>} />
            <Route path="/settings" exact element={<Settings/>} />
            <Route path="/wallet" exact element={<Wallet/>} />
            <Route path="/products" exact element={<Products/>} />
            <Route path="/courses" exact element={<Courses/>} />
            <Route path="/courses/:id" exact element={<CoursePage/>} />
            <Route path="/section/:id" exact element={<SectionPage/>} />
            <Route path="/mysections" exact element={<Mysections/>} />
            <Route path="/exams" exact element={<Examsloged/>} />
            <Route path="/exams/:id" exact element={<SovleExamloged/>} />
            <Route path="/calc" exact element={<Calc/>} />
            <Route path="/skill/" exact element={<Skill/>} />
            <Route path="/skill/:skilltype" exact element={<SkillPage/>} />
          </Routes>
        </>
      :
      <Routes>
        <Route path="*" exact element={<Error404/>} />
        <Route path="/" exact element={<Landing/>} />
        <Route path="/soon" exact element={<Soon/>} />
        <Route path="/exams" exact element={<Exams/>} />
        <Route path="/exams/:id" exact element={<SovleExam/>} />
        <Route path="/url/:id" exact element={<Url/>} />
        <Route path="/register" exact element={!islogedin?<Register/>:<Navigate to="/" replace={true}/>} />
        <Route path="/login" exact element={!islogedin?<Login/>:<Navigate to="/" replace={true}/>} />
      </Routes>
      :
      <LoadingSpinner/>
    }
    </BrowserRouter>
    </HelmetProvider>
    </MyContext.Provider>

  );
}

export default App;
