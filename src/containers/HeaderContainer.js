import React from "react";
import {connect} from "react-redux";
import Header from "../components/Header";


const mapDispatchToProps = {}

const mapStateToProps = ({user}) => ({
  avatar: user
    ? <img className="img-circle" src={require('../../public/img/avatar.gif')}/>
    : null
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
