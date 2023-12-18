import moment from 'moment'

export class DateFormat {
  localDateString() {
    return moment(new Date()).format('YYYY-MM-DD')
  }
}
