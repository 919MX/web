import React from 'react'
import PropTypes from 'prop-types'

import { Popup } from 'react-mapbox-gl'

import { fmtNum } from 'tools/string'
import Styles from './LocalityPopup.css'


const LocalityPopup = ({ locality }) => {
  const { stateName, locName, habit, notHabit, destroyed, total, margGrade } = locality.properties
  const { coordinates } = locality.geometry
  return (
    <Popup coordinates={coordinates}>
      <span className={Styles.header}>{locName}, {stateName}</span>
      <div className={Styles.item}><span className={Styles.label}>Viviendas dañadas</span> <span className={Styles.value}>{fmtNum(total)}</span></div>
      <div className={Styles.item}><span className={Styles.label}>Habitables</span> <span className={Styles.value}>{fmtNum(habit)}</span></div>
      <div className={Styles.item}><span className={Styles.label}>No habitables</span> <span className={Styles.value}>{fmtNum(notHabit)}</span></div>
      <div className={Styles.item}><span className={Styles.label}>Pérdida total</span> <span className={Styles.value}>{fmtNum(destroyed)}</span></div>
      <div className={Styles.item}><span className={Styles.label}>Marginación social</span> <span className={Styles.value}>{fmtNum(margGrade)}</span></div>
    </Popup>
  )
}

LocalityPopup.propTypes = {
  locality: PropTypes.object.isRequired,
}

export default LocalityPopup