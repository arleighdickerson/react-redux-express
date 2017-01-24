import React from "react";
import SignupView from "../components/SignupView";
import SignupForm from "../components/SignupForm";
import {getFormValues, SubmissionError} from "redux-form";
import {connect} from "react-redux";
import {signup} from "app/src/store/user";

const mapDispatchToProps = {
  onSubmit: (attributes) => {
    return dispatch => dispatch(signup(attributes)).catch(err => {
      throw new SubmissionError({username: 'hotdog'})
    })
  }
}


const mapStateToProps = (state) => {
  return {...getFormValues('signupform')(state)}
}

class SignupContainer extends React.Component {
  render() {
    const props = {...this.context, ...this.props}
    return (
      <SignupView>
        <SignupForm {...props}/>
      </SignupView>
    )
  }
}

SignupContainer.contextTypes = {
  store: React.PropTypes.object
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupContainer)
