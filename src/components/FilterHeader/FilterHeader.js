import React from 'react'
import PropTypes from 'prop-types'

import _ from 'lodash'
import Select from 'react-select'
import '!style-loader!css-loader!react-select/dist/react-select.css'

import { projectTypeByValue } from 'src/choices'
import Styles from './FilterHeader.css'


const FilterHeader = (props) => {
  const {
    onStateChange,
    onMuniChange,
    onMargChange,
    onNumActionsChange,
    onSectorChange,
    onActionTypeChange,
    localities,
    actions,
    valState,
    valMuni,
    valMarg,
    valNumActions,
    valSector,
    valActionType,
    style = {},
  } = props

  const shortenState = (name) => {
    if (name.toLowerCase() === 'veracruz de ignacio de la llave') return 'Veracruz'
    return name
  }

  const stateOptions = () => {
    const items = _.uniqBy(localities, l => l.cvegeo_state)

    return items.sort((a, b) => {
      if (a.state_name < b.state_name) return -1
      if (a.state_name > b.state_name) return 1
      return 0
    }).map((i) => {
      return { value: i.cvegeo_state, label: shortenState(i.state_name) }
    })
  }

  const muniOptions = () => {
    const items = _.uniqBy(localities, l => l.cvegeo_municipality)

    return items.sort((a, b) => {
      if (a.municipality_name < b.municipality_name) return -1
      if (a.municipality_name > b.municipality_name) return 1
      return 0
    }).map((i) => {
      return { value: i.cvegeo_municipality, label: `${i.municipality_name}, ${i.state_name}` }
    })
  }

  const actionTypeOptions = () => {
    const items = _.uniqBy(actions, a => a.action_type)

    return items.sort((a, b) => {
      if (a.action_type < b.action_type) return -1
      if (a.action_type > b.action_type) return 1
      return 0
    }).map((i) => {
      return { value: i.action_type, label: projectTypeByValue[i.action_type] || '?' }
    })
  }

  const selectsLarge = (className) => {
    return (
      <React.Fragment>
        <Select
          multi
          joinValues
          noResultsText="Cero resultados"
          clearable={false}
          closeOnSelect={false}
          removeSelected={false}
          className={className}
          value={valState}
          placeholder="Estado"
          onChange={onStateChange}
          options={stateOptions()}
        />

        <Select
          multi
          noResultsText="Cero resultados"
          clearable={false}
          closeOnSelect={false}
          removeSelected={false}
          className={className}
          value={valMuni}
          placeholder="Municipio"
          onChange={onMuniChange}
          options={muniOptions()}
        />

        {valMarg && <Select
          multi
          noResultsText="Cero resultados"
          clearable={false}
          closeOnSelect={false}
          removeSelected={false}
          className={className}
          value={valMarg}
          placeholder="Marginación social"
          onChange={onMargChange}
          options={[
            { value: 'muy_alto', label: 'Muy alta' },
            { value: 'alto', label: 'Alta' },
            { value: 'medio', label: 'Media' },
            { value: 'bajo', label: 'Baja' },
          ]}
        />}

        {valNumActions && <Select
          multi
          noResultsText="Cero resultados"
          clearable={false}
          closeOnSelect={false}
          removeSelected={false}
          className={className}
          value={valNumActions}
          placeholder="Total de proyectos"
          onChange={onNumActionsChange}
          options={[
            { value: '0', label: '0' },
            { value: '1', label: '1-9' },
            { value: '2', label: '10-49' },
            { value: '3', label: '50+' },
          ]}
        />}

        {valSector && <Select
          multi
          noResultsText="Cero resultados"
          clearable={false}
          closeOnSelect={false}
          removeSelected={false}
          className={className}
          value={valSector}
          placeholder="Sector"
          onChange={onSectorChange}
          options={[
            { value: 'civil', label: 'Civil' },
            { value: 'public', label: 'Público' },
            { value: 'private', label: 'Privado' },
            { value: 'religious', label: 'Religioso' },
          ]}
        />}

        {(valActionType && actions) && <Select
          multi
          noResultsText="Cero resultados"
          clearable={false}
          closeOnSelect={false}
          removeSelected={false}
          className={className}
          value={valActionType}
          placeholder="Tipo de proyecto"
          onChange={onActionTypeChange}
          options={actionTypeOptions()}
        />}
      </React.Fragment>
    )
  }

  const selectsSmall = (className) => {
    return (
      <React.Fragment>
        {valMarg &&
          <React.Fragment>
            <span className={Styles.title}>Marginación social</span>
            <Select
              multi
              autoFocus
              openOnFocus
              noResultsText="Cero resultados"
              clearable={false}
              closeOnSelect={false}
              removeSelected={false}
              searchable={false}
              className={className}
              value={valMarg}
              placeholder=""
              onChange={onMargChange}
              options={[
                { value: 'muy_alto', label: 'Muy alta' },
                { value: 'alto', label: 'Alta' },
                { value: 'medio', label: 'Media' },
                { value: 'bajo', label: 'Baja' },
              ]}
            />
          </React.Fragment>
        }
        {valNumActions &&
          <React.Fragment>
            <span className={Styles.title}>Total de proyectos</span>
            <Select
              multi
              noResultsText="Cero resultados"
              clearable={false}
              closeOnSelect={false}
              removeSelected={false}
              searchable={false}
              className={className}
              value={valNumActions}
              placeholder=""
              onChange={onNumActionsChange}
              options={[
                { value: '0', label: '0' },
                { value: '1', label: '1-9' },
                { value: '2', label: '10-49' },
                { value: '3', label: '50+' },
              ]}
            />
          </React.Fragment>
        }
        {valSector &&
          <React.Fragment>
            <span className={Styles.title}>Sector</span>
            <Select
              multi
              autoFocus
              openOnFocus
              noResultsText="Cero resultados"
              clearable={false}
              closeOnSelect={false}
              removeSelected={false}
              searchable={false}
              className={className}
              value={valSector}
              placeholder=""
              onChange={onSectorChange}
              options={[
                { value: 'civil', label: 'Civil' },
                { value: 'public', label: 'Público' },
                { value: 'private', label: 'Privado' },
                { value: 'religious', label: 'Religioso' },
              ]}
            />
          </React.Fragment>
        }
        {(valActionType && actions) &&
          <React.Fragment>
            <span className={Styles.title}>Tipo de proyecto</span>
            <Select
              multi
              noResultsText="Cero resultados"
              clearable={false}
              closeOnSelect={false}
              removeSelected={false}
              searchable={false}
              className={className}
              value={valActionType}
              placeholder=""
              onChange={onActionTypeChange}
              options={actionTypeOptions()}
            />
          </React.Fragment>
        }
        <span className={Styles.title}>Estado</span>
        <Select
          multi
          joinValues
          noResultsText="Cero resultados"
          clearable={false}
          closeOnSelect={false}
          removeSelected={false}
          searchable={false}
          className={className}
          value={valState}
          placeholder=""
          onChange={onStateChange}
          options={stateOptions()}
        />
        <span className={Styles.title}>Municipio</span>
        <Select
          multi
          noResultsText="Cero resultados"
          clearable={false}
          closeOnSelect={false}
          removeSelected={false}
          searchable={false}
          className={className}
          value={valMuni}
          placeholder=""
          onChange={onMuniChange}
          options={muniOptions()}
        />
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <div style={style} className={`${Styles.container} sm-hidden xs-hidden`}>
        {selectsLarge(Styles.filter)}
      </div>
      <div style={style} className={`${Styles.container} lg-hidden md-hidden wrapper-sm wrapper-xs`}>
        {selectsSmall(Styles.filter)}
      </div>
    </React.Fragment>
  )
}

FilterHeader.propTypes = {
  onStateChange: PropTypes.func.isRequired,
  onMuniChange: PropTypes.func.isRequired,
  onMargChange: PropTypes.func,
  onNumActionsChange: PropTypes.func,
  onSectorChange: PropTypes.func,
  onActionTypeChange: PropTypes.func,
  localities: PropTypes.arrayOf(PropTypes.object).isRequired,
  actions: PropTypes.arrayOf(PropTypes.object),
  valState: PropTypes.arrayOf(PropTypes.any),
  valMuni: PropTypes.arrayOf(PropTypes.any),
  valMarg: PropTypes.arrayOf(PropTypes.any),
  valNumActions: PropTypes.arrayOf(PropTypes.any),
  valSector: PropTypes.arrayOf(PropTypes.any),
  valActionType: PropTypes.arrayOf(PropTypes.any),
  style: PropTypes.object,
}

export default FilterHeader
