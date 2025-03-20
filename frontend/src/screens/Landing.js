import React, { useRef } from 'react'
import "./landing.css"
import logo from "../images/logo.png"
import ladning from "../images/landing.png"
import s1 from "../images/s1.png"
import s2 from "../images/s2.png"
import s3 from "../images/s3.png"
import ill from "../images/ill.png"
import { Link } from 'react-router-dom'

export default function Landing() {

  const burger = useRef(null)
  const nav = useRef(null)
  const line1 = useRef(null)
  const line2 = useRef(null)
  const line3 = useRef(null)
  const headerhandleclick=()=>{
    nav.current.classList.toggle("nav-active");
    line1.current.classList.toggle("activeline1");
    line2.current.classList.toggle("activeline2");
    line3.current.classList.toggle("activeline3");
  }

  return (
    <div>
      
      {//header
      }
    <div className='header'>
        <div className="container">
            <a href="#">
            <img src={logo} alt="" className="logo"/>
            </a>
            <ul id="nav" ref={nav} className="test">
                <li className="link"><a href="#">الصفحة الرئيسية</a></li>
                <li className="link">
                    <a href="#second">المراحل الدراسية</a>
                    <ol className="dropdown">
                        <li className="drop"><Link to="login">الأول الثانوي</Link></li>
                        <li className="drop"><Link to="login">الثاني الثانوي</Link></li>
                        <li className="drop"><Link to="login">الثالث الثانوي</Link></li>
                    </ol>
                </li>
                <li className="link"><a href="#traqme">الاختبارات </a></li>
                <li className="link"><a href="#about">عنا</a></li>
                <li className="link log"><Link to="login">تسجيل الدخول</Link></li>
            </ul>
            
            <div className="barburger" ref={burger} onClick={headerhandleclick}>
                <div className="slice" ref={line1} id="line1"></div>
                <div className="slice" ref={line2} id="line2"></div>
                <div className="slice" ref={line3} id="line3"></div>
            </div>
        </div>
    </div>

      {//landing
      }
    <div className="landing">
        <img src={ladning} alt="" className="landimg"/>
        <div className="text">
            <h1>أكاديمية عامر</h1>
            <p>للرياضيات</p>
        </div>
    </div>

    {// Start education 
    }
    <div className="edu" id="second">
        <div className="container">
            <div className="heading">
                <h2>المراحل الدراسية</h2>
            </div>
            <div className="cont">
                <div className="box">
                    <img src={s3} alt=""/>
                    <div className="content">
                        <h2>الصف الثالث الثانوي</h2>
                        <p>
                        شرح منهج الصف الثالث الثانوي في الرياضيات مع التراكمي و فهم جزئياته مع التطبيق  
                        </p>
                        <div className="down">
                            <div className="ngom">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                            <Link to="login">أبداء</Link>
                        </div>
                    </div>
                </div>
                <div className="box">
                    <img src={s2} alt=""/>
                    <div className="content">
                        <h2>الصف الثاني الثانوي</h2>
                        <p>
                        شرح منهج الصف الثاني الثاني في الرياضيات مع التراكمي و فهم جزئياته مع التطبيق
                        </p>
                        <div className="down">
                            <div className="ngom">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                            <Link to="login">أبداء</Link>
                        </div>
                    </div>
                </div>
                <div className="box">
                    <img src={s1} alt=""/>
                    <div className="content">
                        <h2>الصف الاول الثانوي</h2>
                        <p>
                        شرح منهج الصف الأول الثانوي في الرياضيات مع التراكمي و فهم جزئياته مع التطبيق
                        </p>
                        <div className="down">
                            <div className="ngom">
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                                <i className="fas fa-star"></i>
                            </div>
                            <Link to="login">أبداء</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {// Start trakmy 
    }
    <div className="tra" id="traqme">
        <div className="container">
            <div className="heading">
                <h2>الاختبارات</h2>
            </div>
            <div className="content">
                <div className="text">
                    <p>
                        الاختبارات التدريبة للصفوف الثلاثة الثانوية
                    </p>
                    <Link to="exams">أبداء</Link>
                </div>
                <div className="ills">
                    <img src={ill} alt=""/>
                </div>
            </div>
        </div>
    </div>

    {// Start about us 
    }
    <div className="about" id="about">
        <div className="container">
            <div className="heading">
                <h2>عنا</h2>
            </div>
            <div className="content" dir="rtl">
                <div className="text">
                    <h2 className="name">
                        شعبان عامر
                    </h2>
                    <p>
                        مدرس خبير مادة الرياضيات لأكثر من 24 عام داخل وزارة التربية و التعليم  
                    </p>
                    <ul>
                        <li>نصل بالطالب الي مرحلة الفهم المطلق بفضل الله</li>
                        <li>متاح اي اسئلة من اي شخص و الرد عليها خلال 24 ساعة حسب الوقت المتوفر لدينا</li>
                        <li>تنوع للمصادر بما فيها من المراجع العليا</li>
                    </ul>
                    <div className="social">
                        <a href='https://www.facebook.com/ShaabanAmerOfficial' target="_blank" rel='noreferrer'><i className="fab fa-facebook-f"></i></a>
                        <a href='https://www.youtube.com/channel/UC8Efs7qkmiJP0WnEH0uxy9w' target="_blank" rel='noreferrer'><i className="fa-brands fa-youtube"></i></a>
                        <a href='https://t.me/shabanamer' target="_blank" rel='noreferrer'><i className="fab fa-telegram-plane"></i></a>
                        <a href='https://api.whatsapp.com/send?phone=201204262425' target="_blank" rel='noreferrer'><i className="fa-brands fa-whatsapp"></i></a>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
   

     {// Start Footer 
    }
    <footer>
            <p>© 2023 Amer Academy all right reserved</p>
    </footer>


    </div>
  )
}
