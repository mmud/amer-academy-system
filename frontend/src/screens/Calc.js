import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function Calc() {
  return (
    <div>
      <Helmet>
        <title>الة حاسبة بالذكاء الأصطناعي</title>
        <meta name='description' content='افضل الة حاسبة تعمل بالذكاء الأصطناعي الأن علي منصة عامر اكاديمي'/>
        <link rel='canonical' href='/clac'/>
      </Helmet>
        <div className='commands container'>
            <div className="heading">
                <h2>الالة الحاسبة بالذكاء الأصطناعي</h2>
            </div>
        </div>
        <iframe style={{width: '100vw', height: "700px", border: '1px solid #E1E1E1'}} src="https://www.mathway.com/ProblemWidget.aspx?affiliateid=affil32138&subject=Calculus" frameBorder={0} scrolling="no" />
    </div>
  )
}
