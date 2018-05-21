import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'

const imgWithClick = { cursor: 'pointer' }


class Photo extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props, nextProps)
  }

  handleClick = (event) => {
    const { onClick, index, photo } = this.props
    onClick(event, { photo, index })
  }

  handleMouseEnter = (event) => {
    const { index, photo, photo: { onMouseEnter } } = this.props
    onMouseEnter(event, { photo, index })
  }

  render() {
    const { photo, photo: { onMouseEnter }, onClick, margin } = this.props
    const imgStyle = { display: 'block', float: 'left', margin }
    return (
      <img
        style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
        {...photo}
        onClick={onClick ? this.handleClick : undefined}
        onMouseEnter={onMouseEnter ? this.handleMouseEnter : undefined}
      />
    )
  }
}

export const photoPropType = PropTypes.shape({
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  onMouseEnter: PropTypes.func,
  alt: PropTypes.string,
  title: PropTypes.string,
})

Photo.propTypes = {
  index: PropTypes.number,
  onClick: PropTypes.func,
  photo: photoPropType,
  margin: PropTypes.number.isRequired,
}

export default Photo