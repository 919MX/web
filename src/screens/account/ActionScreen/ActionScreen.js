import React from 'react'
import PropTypes from 'prop-types'

import debounce from 'lodash/debounce'
import { reset } from 'redux-form'
import { connect } from 'react-redux'
import { Link, withRouter, Redirect } from 'react-router-dom'
import RaisedButton from 'material-ui/RaisedButton'

import * as Actions from 'src/actions'
import { toQs } from 'api/request'
import service, { getBackoff } from 'api/service'
import { cleanAccentedChars, transparencyLabelByLevel } from 'tools/string'
import Modal from 'components/Modal'
import WithSideNav from 'components/WithSideNav'
import BackButton from 'components/BackButton'
import Icon from 'components/Icon'
import ActionStrength from 'components/Strength/ActionStrength'
import { UpdateActionForm, prepareActionBody, prepareInitialActionValues } from 'screens/account/ActionForm'
import { CreateDonationForm, UpdateDonationForm,
  prepareDonationBody, prepareInitialDonationValues } from 'screens/account/DonationForm'
import { CreateOpportunityForm, UpdateOpportunityForm,
  prepareOpportunityBody, prepareInitialOpportunityValues } from 'screens/account/OpportunityForm'
import PhotoGalleryPickerForm from 'screens/account/PhotoGalleryPickerForm'
import DonationTable from 'screens/account/DonationTable'
import OpportunityTable from 'screens/account/OpportunityTable'
import ApplicationTable from 'screens/account/ApplicationTable'
import SubmissionForm from 'screens/account/SubmissionForm'
import SubmissionTable from 'screens/account/SubmissionTable'
import SubmissionTrash from 'screens/account/SubmissionTrash'
import TestimonialForm from 'screens/account/TestimonialForm'
import TestimonialTable from 'screens/account/TestimonialTable'
import { getProjectType } from 'src/choices'
import FormStyles from 'src/Form.css'
import Styles from './ActionScreen.css'


const initialDonationValues = { approved_by_donor: false, approved_by_org: true }
const initialOpportunityValues = { location: 'anywhere', published: true }

class ActionScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      localitiesSearch: [],
      submissionId: undefined,
      testimonialId: undefined,
      donationId: undefined,
      opportunityId: undefined,
      trashModal: false,
      createDonationModal: false,
      createOpportunityModal: false,
    }

    this.handleLocalityChange = debounce(this.handleLocalityChange, 250)
  }

  componentDidMount() {
    document.title = `Proyecto ${this.props.actionKey} - Brigada`
    this.loadAction()
  }

  loadAction = () => {
    const { actionKey } = this.props
    getBackoff(() => { return service.accountGetAction(actionKey) }, { key: `accountAction_${actionKey}` })

    const { id } = this.props.action
    if (id !== undefined) {
      getBackoff(() => { return service.accountGetActionStrength(id) }, { key: `actionStrength_${id}` })
    }
  }

  handleUpdateAction = async (body) => {
    const { id } = this.props.action
    if (!id) return

    const { data } = await service.accountUpdateAction(id, prepareActionBody(body))
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadAction()
    this.props.snackbar('Actualizaste tu proyecto', 'success')
  }

  handleLocalityChange = async (e, v) => {
    if (v.value) {
      this.setState({ localitiesSearch: [] })
      return
    }
    const { data } = await service.getLocalitiesSearch(cleanAccentedChars(v.text), 10)
    if (!data) return
    this.setState({ localitiesSearch: data.results })
  }

  handleTogglePublishedSubmission = async (id, published) => {
    const { data } = await service.accountUpdateSubmission(id, { published })
    if (!data) {
      this.props.snackbar(`Hubo un error, no se pudo ${published ? 'publicar' : 'ocultar'} estas fotos`, 'error')
      return
    }
    this.loadAction()
    const message = published ? 'Publicaste estas fotos' : 'Ocultaste estas fotos'
    this.props.snackbar(message, 'success')
  }

  handleRowClickedSubmission = (id) => {
    this.setState({ submissionId: id })
  }

  handleSubmissionModalClose = async () => {
    this.setState({ submissionId: undefined })
  }

  handleTogglePublishedTestimonial = async (id, published) => {
    const { data } = await service.accountUpdateTestimonial(id, { published })
    if (!data) {
      this.props.snackbar(`Hubo un error, no se pudo ${published ? 'publicar' : 'ocultar'} este testimonio`, 'error')
      return
    }
    this.loadAction()
    const message = published ? 'Publicaste este testimonio' : 'Ocultaste este testimonio'
    this.props.snackbar(message, 'success')
  }

  handlePreviewTestimonial = (id) => {
    const { history, action } = this.props
    const params = { _mn: 'testimonial', _ms: id }
    history.push({ pathname: `/proyectos/${action.id}`, search: toQs(params, { encode: false }) })
  }

  handleRowClickedTestimonial = (id) => {
    this.setState({ testimonialId: id })
  }

  handleTestimonialModalClose = () => {
    this.setState({ testimonialId: undefined })
  }

  handleToggleSubmissionTrashModal = (open) => {
    this.setState({ trashModal: open })
  }

  handleToggleCreateDonationModal = (open) => {
    this.setState({ createDonationModal: open })
  }

  handleDonationRowClicked = (donationId) => {
    this.setState({ donationId })
  }

  handleUpdateDonationModalClose = () => {
    this.setState({ donationId: undefined })
  }

  handleToggleCreateOpportunityModal = (open) => {
    this.setState({ createOpportunityModal: open })
  }

  handleOpportunityRowClicked = (opportunityId) => {
    this.setState({ opportunityId })
  }

  handleUpdateOpportunityModalClose = () => {
    this.setState({ opportunityId: undefined })
  }

  handleToggleCreateSubmissionModal = () => {
    const { modal, action } = this.props
    if (action.key === undefined) return
    modal(
      'createSubmission',
      { actionKey: action.key, modalPadded: false, modalWide: true, modalCancelShortcut: false }
    )
  }

  handleToggleCreateTestimonialModal = () => {
    const { modal, action } = this.props
    if (action.key === undefined) return
    modal(
      'createTestimonial',
      { actionKey: action.key, modalPadded: false, modalWide: true, modalCancelShortcut: false }
    )
  }

  handleDeleteAction = async () => {
    const { data } = await service.accountArchiveAction(this.props.action.id, true)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.props.snackbar(`Mandaste proyecto ${this.props.action.key} al basurero`, 'success')
    this.props.history.push('/cuenta')
  }

  handleCreateDonation = async (body) => {
    const { data } = await service.accountCreateDonation(prepareDonationBody(
      { ...body, action: this.props.action.id })
    )
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.props.resetDonation()
    this.loadAction()
    this.handleToggleCreateDonationModal(false)
    this.props.snackbar('Agregaste un nuevo donativo', 'success')
  }

  handleUpdateDonation = async (id, body) => {
    const { data } = await service.accountUpdateDonation(id, prepareDonationBody(body))
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadAction()
    this.props.snackbar(`Modificaste donativo ${id}`, 'success')
  }

  handleDeleteDonation = async (id) => {
    const { snackbar } = this.props
    const { data } = await service.accountDeleteDonation(id, true)
    if (!data) {
      snackbar('Hubo un error', 'error')
      return
    }
    this.loadAction()
    this.handleUpdateDonationModalClose()
    snackbar(`Borraste donativo ${id}`, 'success')
  }

  handleToggleDonationApproved = async (id, approved) => {
    const { data } = await service.accountUpdateDonation(id, { approved_by_org: approved })
    if (!data) {
      this.props.snackbar(`Hubo un error, no se pudo ${approved ? 'aprobar' : 'ocultar'} este donativo`, 'error')
      return
    }
    this.loadAction()
    const message = approved ? `Aprobaste donativo ${id}` : `Ocultaste donativo ${id}`
    this.props.snackbar(message, 'success')
  }

  handleCreateOpportunity = async (body) => {
    const { data } = await service.accountCreateOpportunity(prepareOpportunityBody(
      { ...body, action: this.props.action.id })
    )
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.props.resetOpportunity()
    this.loadAction()
    this.handleToggleCreateOpportunityModal(false)
    this.props.snackbar('Agregaste una nueva oportunidad de voluntariado', 'success')
  }

  handleUpdateOpportunity = async (id, body) => {
    const { data } = await service.accountUpdateOpportunity(id, prepareOpportunityBody(body))
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadAction()
    this.handleUpdateOpportunityModalClose()
    this.props.snackbar(`Modificaste oportunidad de voluntariado ${id}`, 'success')
  }

  handleToggleOpportunityPublished = async (id, published) => {
    const { data } = await service.accountUpdateOpportunity(id, { published })
    if (!data) {
      this.props.snackbar(`Hubo un error, no se pudo ${published ? 'publicar' : 'ocultar'} esta oportunidad`, 'error')
      return
    }
    this.loadAction()
    const message = published ? `Publicaste oportunidad ${id}` : `Ocultaste oportunidad ${id}`
    this.props.snackbar(message, 'success')
  }

  handleChooseOpportunityImage = async (id, body) => {
    const { data } = await service.accountUpdateOpportunity(id, body)
    if (!data) {
      this.props.snackbar('Hubo un error', 'error')
      return
    }
    this.loadAction()
    this.handleToggleOpportunityImageModal(undefined)
    this.props.snackbar('Actualizaste la imagen de esta oportunidad de voluntariado', 'success')
  }

  handleToggleOpportunityImageModal = (pickerOpportunityId: ?number) => {
    this.setState({ pickerOpportunityId })
  }

  render() {
    const { action, donations, opportunities, submissions, testimonials, status } = this.props
    if (status === 404) return <Redirect to="/cuenta" />
    const {
      submissionId,
      testimonialId,
      donationId,
      opportunityId,
      pickerOpportunityId,
      localitiesSearch,
      trashModal,
      createDonationModal,
      createOpportunityModal,
    } = this.state
    const donation = donations.find(d => d.id === donationId)
    const opportunity = opportunities.find(o => o.id === opportunityId)
    const pickerOpportunity = opportunities.find(o => o.id === pickerOpportunityId) || {}

    const content = (
      <div>
        {action.id !== undefined &&
          <div className={FormStyles.card}>
            <div className={FormStyles.sectionHeader}>
              <div className={Styles.sectionHeader}>
                {getProjectType(action.action_type)} ({action.key})
                {action.level >= 3 &&
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
            </div>
            <Link className={Styles.link} to={`/proyectos/${action.id}`}>Ver proyecto</Link>
            <div className={FormStyles.formContainerLeft}>
              <UpdateActionForm
                onSubmit={this.handleUpdateAction}
                initialValues={action}
                onLocalityChange={this.handleLocalityChange}
                localitiesSearch={localitiesSearch}
                form={`accountUpdateAction_${this.props.actionKey}`}
                enableReinitialize
                onDelete={this.handleDeleteAction}
              />
            </div>
          </div>
        }

        <div className={FormStyles.card}>
          <div className={FormStyles.sectionHeader}>
            <span>Donativos</span>
            <div>
              <RaisedButton
                backgroundColor="#3DC59F"
                labelColor="#ffffff"
                className={FormStyles.primaryButton}
                label="Agregar"
                onClick={() => this.handleToggleCreateDonationModal(true)}
              />
            </div>
          </div>
          {donations.length > 0 &&
            <DonationTable
              donations={donations}
              onToggleApproved={this.handleToggleDonationApproved}
              onRowClicked={this.handleDonationRowClicked}
            />
          }
        </div>

        <div className={FormStyles.card}>
          <div className={FormStyles.sectionHeader}>
            <div>
              <span>Oportunidades de voluntariado</span>
              {action.level < 2 &&
                <div className={Styles.warning}>
                  Tu proyecto es {transparencyLabelByLevel(action.level)}. Oportunidades de voluntariado sólo aparecen en el sitio si su nivel es casi transparente o transparente.
                </div>
              }
            </div>
            <div>
              <RaisedButton
                backgroundColor="#3DC59F"
                labelColor="#ffffff"
                className={FormStyles.primaryButton}
                label="AGREGAR"
                onClick={() => this.handleToggleCreateOpportunityModal(true)}
              />
            </div>
          </div>
          {opportunities.length > 0 &&
            <OpportunityTable
              opportunities={opportunities}
              onTogglePublished={this.handleToggleOpportunityPublished}
              onRowClicked={this.handleOpportunityRowClicked}
              onClickImage={this.handleToggleOpportunityImageModal}
            />
          }
        </div>

        {opportunities.length > 0 && action.id !== undefined &&
          <div className={FormStyles.card}>
            <div className={FormStyles.sectionHeader}>
              <span>Candidatos de voluntariado</span>
            </div>
            <ApplicationTable actionId={action.id} />
          </div>
        }

        <div className={FormStyles.card}>
          <div className={FormStyles.sectionHeader}>
            <span>Testimonios</span>
            <div>
              <RaisedButton
                backgroundColor="#3DC59F"
                labelColor="#ffffff"
                className={FormStyles.primaryButton}
                label="AGREGAR"
                onClick={this.handleToggleCreateTestimonialModal}
              />
            </div>
          </div>
          {testimonials.length > 0 &&
            <TestimonialTable
              testimonials={testimonials}
              onPreview={this.handlePreviewTestimonial}
              onTogglePublished={this.handleTogglePublishedTestimonial}
              onRowClicked={this.handleRowClickedTestimonial}
            />
          }
        </div>

        <div className={FormStyles.card}>
          <div className={FormStyles.sectionHeader}>
            <span>Fotos</span>
            <div>
              <span
                className={FormStyles.link}
                onClick={() => this.handleToggleSubmissionTrashModal(true)}
              >
                Basurero
              </span>
              <RaisedButton
                backgroundColor="#3DC59F"
                labelColor="#ffffff"
                className={FormStyles.primaryButton}
                label="AGREGAR"
                onClick={this.handleToggleCreateSubmissionModal}
              />
            </div>
          </div>
          {submissions.length > 0 &&
            <SubmissionTable
              submissions={submissions}
              onTogglePublished={this.handleTogglePublishedSubmission}
              onRowClicked={this.handleRowClickedSubmission}
            />
          }
        </div>

        {submissionId !== undefined &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainerLeft}`}
            onClose={this.handleSubmissionModalClose}
            gaName={`submission/${submissionId}`}
          >
            <SubmissionForm submissionId={submissionId} onChange={this.loadAction} />
          </Modal>
        }

        {testimonialId !== undefined &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainerLeft}`}
            onClose={this.handleTestimonialModalClose}
            gaName={`testimonial/${testimonialId}`}
          >
            <TestimonialForm testimonialId={testimonialId} onChange={this.loadAction} />
          </Modal>
        }

        {trashModal &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainer}`}
            onClose={() => this.handleToggleSubmissionTrashModal(false)}
            gaName="submissionTrashModal"
          >
            <SubmissionTrash />
          </Modal>
        }

        {createDonationModal &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainerLeft}`}
            onClose={() => this.handleToggleCreateDonationModal(false)}
            gaName="orgCreateDonationModal"
          >
            <div className={FormStyles.sectionHeader}>Agregar donativo</div>
            <CreateDonationForm
              onSubmit={this.handleCreateDonation}
              initialValues={initialDonationValues}
            />
          </Modal>
        }

        {createOpportunityModal && action.id !== undefined &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainerLeft}`}
            onClose={() => this.handleToggleCreateOpportunityModal(false)}
            gaName="orgCreateOpportunityModal"
            cancelShortcut={false}
          >
            <div className={FormStyles.sectionHeader}>Agregar oportunidad de voluntariado</div>
            <CreateOpportunityForm
              onSubmit={this.handleCreateOpportunity}
              initialValues={initialOpportunityValues}
              action={action}
            />
          </Modal>
        }

        {donation &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainerLeft}`}
            onClose={this.handleUpdateDonationModalClose}
            gaName={`orgDonation/${donationId}`}
          >
            <UpdateDonationForm
              onSubmit={body => this.handleUpdateDonation(donationId, body)}
              initialValues={prepareInitialDonationValues(donation)}
              form={`accountUpdateDonation_${donationId}`}
              enableReinitialize
              onDelete={() => this.handleDeleteDonation(donationId)}
              id={donationId}
            />
          </Modal>
        }

        {opportunity && action.id !== undefined &&
          <Modal
            contentClassName={`${FormStyles.modal} ${FormStyles.formContainerLeft}`}
            onClose={this.handleUpdateOpportunityModalClose}
            gaName={`orgOpportunity/${opportunityId}`}
          >
            <UpdateOpportunityForm
              onSubmit={body => this.handleUpdateOpportunity(opportunityId, body)}
              initialValues={prepareInitialOpportunityValues(opportunity)}
              form={`accountUpdateOpportunity_${opportunityId}`}
              enableReinitialize
              id={opportunityId}
              action={action}
            />
          </Modal>
        }

        {pickerOpportunityId !== undefined && action.id !== undefined &&
          <Modal
            contentClassName={FormStyles.modal}
            onClose={() => this.handleToggleOpportunityImageModal(undefined)}
            gaName="chooseOpportunityImageModal"
          >
            <PhotoGalleryPickerForm
              actionId={action.id}
              onSubmit={(body) => { this.handleChooseOpportunityImage(pickerOpportunityId, body) }}
              form={`accountOpportunityPickPhoto_${pickerOpportunityId}`}
              enableReinitialize
              initialValues={{ preview: pickerOpportunity.preview }}
            />
          </Modal>
        }
      </div>
    )

    return (
      <WithSideNav
        navComponents={
          <React.Fragment>
            <BackButton to="/cuenta" />
            {action.id !== undefined &&
              <div style={{ marginTop: 15 }}>
                <ActionStrength actionId={action.id} />
              </div>
            }
          </React.Fragment>
        }
        sticky={window.innerHeight >= 750}
      >
        {content}
      </WithSideNav>
    )
  }
}

ActionScreen.propTypes = {
  action: PropTypes.object.isRequired,
  donations: PropTypes.arrayOf(PropTypes.object).isRequired,
  opportunities: PropTypes.arrayOf(PropTypes.object).isRequired,
  submissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  testimonials: PropTypes.arrayOf(PropTypes.object).isRequired,
  actionKey: PropTypes.number.isRequired,
  modal: PropTypes.func.isRequired,
  snackbar: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  status: PropTypes.number,
  resetDonation: PropTypes.func.isRequired,
  resetOpportunity: PropTypes.func.isRequired,
}

const mapStateToProps = (state, props) => {
  const { actionKey } = props
  let action = {}
  let donations = []
  let opportunities = []
  let submissions = []
  let testimonials = []

  const reduxAction = state.getter[`accountAction_${actionKey}`]
  const status = reduxAction && reduxAction.status
  try {
    action = prepareInitialActionValues(reduxAction.data || {});
    ({ donations, opportunities, submissions, testimonials } = action)
  } catch (e) {}

  return { action, donations, opportunities, submissions, testimonials, status }
}

const mapDispatchToProps = (dispatch) => {
  return {
    modal: (modalName, props) => Actions.modal(dispatch, modalName, props),
    snackbar: (message, status) => Actions.snackbar(dispatch, { message, status }),
    resetDonation: () => dispatch(reset('orgNewDonation')),
    resetOpportunity: () => dispatch(reset('accountNewOpportunity')),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ActionScreen))
