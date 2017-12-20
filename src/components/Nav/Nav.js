import React from 'react'

import { NavLink } from 'react-router-dom'

import LogoImg from 'assets/img/logo.png'
import Colors from 'src/Colors'
import Styles from './Nav.css'


const Nav = (props) => {
  const selected = { color: Colors.brandGreen }
  return (
    <nav className={`${Styles.container} wrapper row middle`}>

      <div className="col-lg-1 col-md-1 col-sm-2 col-xs-2">
        <a className={Styles.logo} href="/">
          <img src={LogoImg} width="74px" height="auto" alt="Logo" />
        </a>
      </div>

      <div className="col-lg-11 col-md-11 col-sm-9 col-xs-12 end-lg end-md">
        <div className={Styles.links}>
          <NavLink activeStyle={selected} exact to="/">COMUNIDADES</NavLink>
          <NavLink activeStyle={selected} to="/organizaciones">ORGANIZACIONES</NavLink>
          <NavLink activeStyle={selected} to="/practicas">MEJORES PRÁCTICAS</NavLink>
          <NavLink activeStyle={selected} to="/nosotros">NOSOTROS</NavLink>
        </div>
      </div>

    </nav>
  )
}

export default Nav