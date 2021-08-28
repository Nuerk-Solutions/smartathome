import React from 'react'
import PropTypes from 'prop-types'
import {
  convertSavedSelectsToProps,
  getDefaultFnsWithSavedSelects,
  getTzVariableText
} from './../utils/helper'

const codeBoxTemplate = (savedSelects, tzValue) => {
  return `import React from 'react'
import Crontab from 'reactjs-crontab'
import 'reactjs-crontab/dist/index.css'
//copy and paste this code and run!
    
${getDefaultFnsWithSavedSelects(savedSelects)}
    
${convertSavedSelectsToProps(savedSelects)}
    
const App = () => {
    return (
      <Crontab 
        tasks={tasks}
        timeZone=${getTzVariableText(tzValue)}
        dashboard={{ hidden: false }}
      />
    )
}
    
export default App
`
}

const Codebox = ({ handleResetCodeBox, savedSelects, tzValue }) => {
  return (
    <div className="codebox__container">
      <pre className="codebox">
        {codeBoxTemplate(savedSelects, tzValue)}
      </pre>
      <div className="codebox__btngroup">
        <button
          className="guide__btn-reset"
          type='button'
          onClick={handleResetCodeBox}
        >
          <span>Reset</span>
        </button>
      </div>
    </div>
  )
}

Codebox.propTypes = {
  handleResetCodeBox: PropTypes.func.isRequired,
  savedSelects: PropTypes.array.isRequired
}

export default Codebox
