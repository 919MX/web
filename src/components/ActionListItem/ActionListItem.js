/* eslint-disable quote-props */
import React from 'react'
import PropTypes from 'prop-types'

import { fmtNum } from 'tools/string'
import MetricsBar from 'components/MetricsBar'
import Styles from './ActionListItem.css'


class ActionListItem extends React.PureComponent {
  render() {
    const { action, screen, focused, onClick, onMouseEnter, onMouseLeave } = this.props
    const {
      action_type: actionType,
      desc,
      unit_of_measurement: unit,
      target,
      progress = 0,
      budget,
      start_date: startDate = '?',
      end_date: endDate = '?',
      organization: { name, key },
      locality: { name: locName, state_name: stateName },
    } = action

    const metrics = () => {
      if (!target) return null
      return (
        <div className={Styles.goalProgress}>
          <span className={Styles.label}>{fmtNum(progress)} DE {fmtNum(target)}</span>
          <span className={Styles.bar}><MetricsBar value={progress} max={target} /></span>
        </div>
      )
    }

    const dates = () => {
      return (
        <div>
          <span className={Styles.label}>FECHAS: </span>
          <span className={Styles.dates}>{startDate.replace(/-/g, '.')} - {endDate.replace(/-/g, '.')}</span>
        </div>
      )
    }

    const locality = () => {
      const { locality: { state_name: stateName, municipality_name: muniName, name } } = action
      return (
        <div>
          <span className={Styles.label}>COMUNIDAD: </span>
          <span className={Styles.dates}>{stateName}, {muniName}, {name}</span>
        </div>
      )
    }

    const handleClick = () => { onClick(action) }
    const handleMouseEnter = () => { onMouseEnter(action) }
    const handleMouseLeave = () => { onMouseLeave(action) }

    let className = Styles.listItem
    if (focused) className = `${Styles.listItem} ${Styles.listItemFocused}`

    return (
      <div
        onClick={handleClick}
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={Styles.header}>{`Construcción de ${actionType.toLowerCase()}`}</div>
        <div className={Styles.summaryContainer}>
          {budget &&
            <div>
              <span className={Styles.label}>PRESUPUESTO: </span>
              <span className={Styles.value}>${fmtNum(budget)}</span>
            </div>}
          {metrics()}
        </div>
        {desc && <div className={Styles.description}>{desc}</div>}
        {screen === 'org' && locality()}
        {dates()}
      </div>
    )
  }
}

ActionListItem.propTypes = {
  action: PropTypes.object.isRequired,
  screen: PropTypes.oneOf(['org', 'loc']).isRequired,
  focused: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
}

ActionListItem.defaultProps = {
  focused: false,
}

export default ActionListItem
