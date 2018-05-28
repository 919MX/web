import React from 'react'
import PropTypes from 'prop-types'

import Gallery from 'react-photo-gallery'
import moment from 'moment'

import { thumborUrl } from 'tools/string'
import Photo from './Photo'
import Styles from './PhotoGallery.css'


class PhotoGallery extends React.Component {
  render() {
    const { submissions, onClickItem, onMouseEnterItem } = this.props
    console.log(submissions)
    const photos = [].concat(...submissions.map((s) => {
      const { images, submitted, location } = s
      return images.filter(
        i => i.width !== undefined && i.height !== undefined
      ).map((i) => {
        return {
          ...i,
          onMouseEnter: onMouseEnterItem,
          src: thumborUrl(i, 480, 480),
          alt: s.description,
          title: s.description,
          submitted,
          location,
        }
      }).sort((a, b) => {
        if (a.submitted < b.submitted) return -1
        if (a.submitted > b.submitted) return 1
        return 0
      })
    }))

    const groupByMonth = photos.reduce((obj, photo) => {
      const date = moment(photo.submitted)
      const yearMonth = date.format('YYYY-MM-01')
      if (yearMonth in obj) obj[yearMonth].push(photo)
      else obj[yearMonth] = [photo] // eslint-disable-line no-param-reassign
      return obj
    }, {})

    return (
      <div>
        {Object.keys(groupByMonth).sort((a, b) => {
          if (a.submitted < b.submitted) return -1
          if (a.submitted > b.submitted) return 1
          return 0
        }).map((month) => {
          const group = groupByMonth[month]
          return (
            <div key={month}>
              <div className={Styles.groupLabel}>{moment(month).format('MMMM \YYYY')}</div>
              <Gallery
                margin={4}
                photos={group}
                onClick={onClickItem}
                ImageComponent={Photo}
              />
            </div>
          )
        })}
      </div>
    )
  }
}

PhotoGallery.propTypes = {
  submissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClickItem: PropTypes.func,
  onMouseEnterItem: PropTypes.func,
}

export default PhotoGallery
