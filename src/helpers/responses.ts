const messageOnSuccess = 'Successfully completed.'
const messageOnFailure = 'Something unexpected happened. Please try again later.'
const messageOnNetworkError = 'Network error. Please check your connection.'

export const alertOnSuccess = () => alert(messageOnSuccess)
export const alertOnFailure = (e: Error) => e.message?.toLowerCase().includes('network')
  ? alert(messageOnNetworkError)
  : alert(messageOnFailure)