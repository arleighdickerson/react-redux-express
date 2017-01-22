import React from "react";
import {login} from "../../../store/user";
import LoginView from "../components/LoginView";
import LoginForm from "../components/LoginForm";
import {getFormValues} from "redux-form";
import {connect} from "react-redux";

const mapDispatchToProps = {
  handleSubmit: login
};

const mapStateToProps = (state) => {
  return {...getFormValues('loginform')(state)}
}

class LoginContainer extends React.Component {
  render() {
    const props = {...this.context, ...this.props}
    return (
      <LoginView>
        <LoginForm {...props}/>
      </LoginView>
    )
  }
}

LoginContainer.contextTypes = {
  store: React.PropTypes.object
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
