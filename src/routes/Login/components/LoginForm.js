const _ = require('lodash')
import React from "react";
import {FormGroup as FG} from "react-bootstrap";
import {Field, reduxForm, SubmissionError} from "redux-form";
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
  constructor(props) {
    super(props)
    this.current = props.store.getState().user
    this.unsubscribe = () => {
    }
  }

  componentDidMount() {
    this.unsubscribe = this.props.store.subscribe(this.listen.bind(this))
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  listen() {
    let previous = this.current
    this.current = this.props.store.getState().user
    if (this.props.valid && previous !== this.current && !this.current) {
      throw new SubmissionError
    }
  }

  render() {
    const {username, password, handleSubmit, store, pristine, submitting} = this.props;
    const onSubmit = e => {
      e.preventDefault()
      if (this.props.valid) {
        handleSubmit(username, password)
      }
    }
    return (
      <form
        className="m-x-auto text-center app-login-form"
        role="form"
        method="POST"
        onSubmit={onSubmit}
      >
        <Link to="/" className="app-brand m-b-lg"
              style={{width: '100%', textDecoration: 'none', fontFamily: 'Roboto-Bold'}}>
          <h1>[Dank]</h1>
        </Link>
        <Field
          component={Input}
          placeholder='username'
          name='username'
          value={username}
          disabled={submitting}
        />
        <Field component={Input}
               placeholder='password'
               name='password'
               type='password'
               value={password}
               disabled={submitting}
               componentClasses={{'FormGroup': FormGroup}}
        />

        <div className="m-b-lg">
          <button className="btn btn-primary" disabled={submitting}>Log In</button>
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
