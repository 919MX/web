/* eslint-disable quote-props */
import React from 'react'
import PropTypes from 'prop-types'

import { Link, withRouter } from 'react-router-dom'
import sortBy from 'lodash/sortBy'

import { fmtNum, thumborUrl } from 'tools/string'
import { getProjectType } from 'src/choices'
import Icon from 'components/Icon'
import Styles from './ActionListItem.css'


class ActionListItem extends React.PureComponent {
  render() {
    const {
      action,
      screen,
      focused,
      onClickPhotos,
      onMouseEnter,
      onMouseLeave,
      history,
    } = this.props

    const {
      id,
      action_type: actionType,
      target,
      progress,
      budget,
      donations = [],
      organization: { id: orgId, name: orgName },
      locality: { id: locId, name: locName, municipality_name: muniName, state_name: stateName },
      unit_of_measurement: unit,
      level,
    } = action

    const getDonors = () => {
      if (donations.length === 0) return null

      const amountByDonor = {}
      for (const d of donations) {
        const { amount = 0, donor: { name } } = d
        if (name in amountByDonor) amountByDonor[name] += amount
        else amountByDonor[name] = amount
      }
      const donors = sortBy(Object.keys(amountByDonor).map((donor) => {
        return { donor, amount: amountByDonor[donor] }
      }), d => -d.amount)
      return (
        <span className={`${Styles.link} ${Styles.donors}`}>Financiado por {donors.map(d => d.donor).join(', ')}</span>
      )
    }

    const metrics = () => {
      if (!target) return null
      return (
        <div className={Styles.goalProgress}>
          <span className={Styles.label}>AVANCE:&nbsp;</span>
          <span className={Styles.value}>
            {fmtNum(progress)} {unit && <span className={Styles.lowercase}>{unit}</span>} de {fmtNum(target)}
          </span>
        </div>
      )
    }

    const organizationLink = (prefix = '') => {
      return (
        <Link
          className={screen !== 'donor' ? Styles.link : Styles.greyLink}
          onClick={e => e.stopPropagation()}
          to={{ pathname: `/reconstructores/${orgId}` }}
        >
          {`${prefix}${orgName}`}
        </Link>
      )
    }

    const localityLink = () => {
      return (
        <Link className={Styles.link} onClick={e => e.stopPropagation()} to={{ pathname: `/comunidades/${locId}` }}>
          {locName}, {muniName}, {stateName}
        </Link>
      )
    }

    const handleClickPhotos = onClickPhotos && ((e) => {
      e.stopPropagation()
      onClickPhotos(action)
    })
    const handleMouseEnter = onMouseEnter && (() => { onMouseEnter(action) })
    const handleMouseLeave = onMouseLeave && (() => { onMouseLeave(action) })
    const handleClickItem = () => history.push(`/proyectos/${id}`)

    const renderThumbnails = () => {
      const images = [].concat(...action.submissions.map(s => s.images))
      const l = images.length
      if (l === 0) return <div className={Styles.emptyThumbnail} />

      const count = l > 1 ? (
        <div
          className={Styles.thumbnailCount}
          style={{ backgroundImage: `url("${thumborUrl(images[1], 240, 240, { crop: true })}")` }}
        >
          <span className={Styles.thumbnailCountOverlay}>+{l - 1}</span>
        </div>) : null
      return (
        <div onClick={handleClickPhotos} className={Styles.thumbnailContainer}>
          <div
            className={`${Styles.thumbnail} xs-hidden`}
            style={{ backgroundImage: `url("${thumborUrl(images[0], 240, 240, { crop: true })}")` }}
          >
            {count}
          </div>
          <div
            className={`${Styles.thumbnail} lg-hidden md-hidden sm-hidden`}
            style={{ backgroundImage: `url("${thumborUrl(images[0], 1280, 240, { crop: true })}")` }}
          >
            {count}
          </div>
        </div>
      )
    }

    const classNames = [Styles.listItem]
    if (focused) classNames.push(Styles.listItemFocused)

    const donors = getDonors()
    return (
      <div
        className={classNames.join(' ')}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClickItem}
      >
        <div className={Styles.cardTop}>
          <div className={Styles.summaryContainer}>
            <div className={Styles.textContainer}>
              <div className={Styles.metadata}>
                {screen !== 'donor' &&
                  <React.Fragment>
                    {screen === 'org' && localityLink()}
                    {screen === 'loc' && organizationLink()}
                    {donors && <span className={`${Styles.link} ${Styles.metaDivider} `}>/</span>}
                    {donors}
                  </React.Fragment>
                }
                {screen === 'donor' &&
                  <React.Fragment>
                    {localityLink()}
                    <span className={`${Styles.link} ${Styles.metaDivider} `}>/</span>
                    {organizationLink('Realizado por ')}
                  </React.Fragment>
                }
              </div>

              <div className={Styles.headerContainer}>
                <div className={Styles.header}>{getProjectType(actionType)}</div>
                {level >= 3 &&
                  <Icon
                    src="/assets/img/circle-checkmark-accent.svg"
                    alt="Proyecto transparente"
                    height={25}
                    ttText="Este proyecto cumple con criterios mínimos de transparencia establecidos en conjunto con Alternativas y Capacidades A.C."
                    ttTop={-80}
                    ttWidth={300}
                    ttLeft={-140}
                    className={Styles.checkmark}
                  />
                }
              </div>

              <div className={Styles.fieldsContainer}>
                <div className={Styles.budgetContainer}>
                  <span className={Styles.label}>PRESUPUESTO: </span>
                  <span className={Styles.value}>{budget ? `$${budget.toLocaleString()}` : 'No disponible'}</span>
                </div>
                {metrics()}
              </div>
            </div>

            {renderThumbnails()}
          </div>

        </div>
      </div>
    )
  }
}

ActionListItem.propTypes = {
  action: PropTypes.object.isRequired,
  screen: PropTypes.oneOf(['org', 'loc', 'donor']).isRequired,
  focused: PropTypes.bool,
  onClickPhotos: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  history: PropTypes.object.isRequired,
}

ActionListItem.defaultProps = {
  focused: false,
}

export default withRouter(ActionListItem)
