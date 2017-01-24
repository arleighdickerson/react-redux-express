const _ = require('lodash')
import React from "react";
import {reduxForm} from "redux-form";

const constraints = {
  firstName: {
    presence: true,
  },
  lastName: {
    presence: true,
  },
  username: {
    presence: true,
  },
  email: {
    presence: true,
    email: true
  },
  password: {
    presence: true,
  },
  repeatPassword: {
    presence: true,
  },
};

const validate = attributes => {
  const errors = require('app/util/validate')(constraints)(attributes)
  if (_.isEmpty(errors)) {
    const {password, repeatPassword} = attributes
    if (password != repeatPassword) {
      errors.repeatPassword = "Passwords do not match"
    }
  }
  return errors
}

const fields = Object.keys(constraints)
const passwordFields = ['password', 'repeatPassword']

class SignupForm extends React.Component {
  render() {
    return (
      <form
        role="form"
        onSubmit={this.props.handleSubmit(this.props.onSubmit)}
      >
      </form>
    )
  }
}

export default reduxForm({
  form: 'signupform',
  initialValues: _.keyBy(fields, () => ''),
  validate
})(SignupForm);
