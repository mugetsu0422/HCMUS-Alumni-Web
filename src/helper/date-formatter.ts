import moment from 'moment'
import 'moment/locale/vi'

class DateFormatter {
  public static formatMessageDate(isoString: string): string {
    const now = moment()
    const inputDate = moment(isoString)

    if (now.isSame(inputDate, 'day')) {
      return inputDate.locale('vi').local().format('HH:mm')
    } else if (now.isSame(inputDate, 'week')) {
      return inputDate.locale('vi').local().format('dddd HH:mm')
    } else {
      return inputDate.locale('vi').local().format('HH:mm D MMMM, YYYY')
    }
  }
}

export default DateFormatter
