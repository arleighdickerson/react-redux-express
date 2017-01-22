const _ = require('lodash')
import React from "react";
import {FormGroup as FG} from "react-bootstrap";
import {Field, reduxForm} from "redux-form";
import Input from "app/src/components/Input";
import {Link} from "react-router";

function FormGroup(props) {
  props = {...props, bsClass: 'form-group m-b-md'}
  return <FG {...props}>{props.children}</FG>
}
const constraints = {
  username: {
    presence: true,
  },
  password: {
    presence: true,
  },
};

const validate = require('app/util/validate')(constraints)

class LoginForm extends React.Component {
  render() {
    const {username, password, handleSubmit, pristine, submitting} = this.props;
    return (
      <form
        className="m-x-auto text-center app-login-form"
        role="form"
        method="POST"
        onSubmit={(e) => {
          e.preventDefault();
          if (this.props.valid) {
            handleSubmit(username, password);
          }
        }}>
        <Link to="/" className="app-brand m-b-lg"
              style={{width: '100%', textDecoration: 'none', fontFamily: 'Roboto-Bold'}}>
          <h1>[Dank]</h1>
        </Link>
        <Field component={Input} placeholder='username' name='username' value={username}/>
        <Field component={Input} placeholder='password' name='password' type='password' value={password}
               componentClasses={{'FormGroup': FormGroup}}/>

        <div className="m-b-lg">
          <button className="btn btn-primary">Log In</button>
          <button className="btn btn-default">Sign up</button>
        </div>

        <footer className="screen-login">
          <a href="#" className="text-muted">Forgot password</a>
        </footer>
      </form>
    )
  }
}

export default reduxForm({
  form: 'loginform',
  validate
})(LoginForm);
