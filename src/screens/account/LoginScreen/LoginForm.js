import React from 'react'
import PropTypes from 'prop-types'

import { reduxForm, propTypes as rxfPropTypes } from 'redux-form'
import { connect } from 'react-redux'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import { store } from 'src/App'
import { TextField } from 'components/Fields'
import { validateEmail } from 'tools/string'
import FormStyles from 'src/Form.css'
import GlobalStyles from 'src/Global.css'
import Styles from './LoginForm.css'


const LoginForm = ({ handleSubmit, submitting, modal }) => {
  const handleForgotPassword = () => {
    try {
      const { email } = store.getState().form.login.values
      modal('forgotPassword', { email })
    } catch (e) {
      modal('forgotPassword')
    }
  }

  const handleCreateAccount = () => {
    modal('createAccount')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <form
      className={FormStyles.formContainer}
      onKeyDown={handleKeyDown}
    >
      <span className={FormStyles.formLogo} />
      <span className={FormStyles.formHeader}>Ingresar a tu cuenta</span>
      <div className={FormStyles.row}>
        <TextField
          name="email"
          hintText="Email"
          className={FormStyles.wideInput}
          autoCapitalize="off"
        />
      </div>
      <div className={FormStyles.row}>
        <TextField
          type="password"
          name="password"
          className={FormStyles.wideInput}
          hintText="Contraseña"
        />
      </div>
      <div className={FormStyles.buttonContainer}>
        <RaisedButton className={FormStyles.primaryButton} backgroundColor="#3DC59F" labelColor="#ffffff" disabled={submitting} label="INGRESAR" onClick={handleSubmit} />
        <div className={Styles.linkContainer}>
          <span className={`${Styles.link} ${GlobalStyles.link}`} onClick={handleForgotPassword}>Olvidé mi contraseña</span>
          <span className={`${Styles.link} ${GlobalStyles.link}`} onClick={handleCreateAccount}>Crear una cuenta</span>
        </div>
      </div>
    </form>
  )
}

LoginForm.propTypes = {
  ...rxfPropTypes,
  modal: PropTypes.func.isRequired,
}

const validate = ({ email, password }) => {
  const errors = {}
  if (!validateEmail(email)) errors.email = 'Se requiere un email válido'
  if (!password) errors.password = 'Ingresa tu contraseña'
  return errors
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
  }
}

export default reduxForm({ form: 'login', validate })(connect(null, mapDispatchToProps)(LoginForm))
