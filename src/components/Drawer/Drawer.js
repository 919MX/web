import React from 'react'
import PropTypes from 'prop-types'

import Styles from './Drawer.css'


class Drawer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  show = () => {
    this.setState({ visible: true })
  }

  hide = () => {
    this.setState({ visible: false })
  }

  render() {
    const { classNameIcon, classNameDrawer, classNameWrapper } = this.props
    const { visible } = this.state
    const burger = <div onClick={this.show} className={`${Styles.hamburger} ${classNameIcon} ${classNameWrapper}`} />

    if (!visible) return burger
    return (
      <React.Fragment>
        {burger}
        <div className={`${Styles.drawer} ${classNameDrawer} ${classNameWrapper}`}>
          <span onClick={this.hide} className={Styles.hide}>X</span>
          {this.props.children}
        </div>
      </React.Fragment>
    )
  }
}

Drawer.propTypes = {
  classNameDrawer: PropTypes.string,
  classNameIcon: PropTypes.string,
  classNameWrapper: PropTypes.string,
  children: PropTypes.any,
}

export default Drawer
