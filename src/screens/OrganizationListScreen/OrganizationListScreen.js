import React from 'react'

import service, { getBackoffComponent } from 'api/service'
import OrganizationListScreenView from './OrganizationListScreenView'


class OrganizationListScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      organizations: {
        loading: true,
      },
    }
  }

  componentDidMount() {
    this._mounted = true
    getBackoffComponent(this, 'organizations', service.getOrganizations, ({ data }) => {
      if (!data) return
      for (const result of data.results) {
        const actionCvegeos = new Set()
        for (const action of result.actions) {
          const { cvegeo } = action.locality
          actionCvegeos.add(cvegeo.substring(0, 2))
          actionCvegeos.add(cvegeo.substring(0, 5))
        }
        result.actionCvegeos = actionCvegeos
      }
    })
  }

  componentWillUnmount() {
    this._mounted = false
  }

  render() {
    return <OrganizationListScreenView {...this.state} />
  }
}

export default OrganizationListScreen
