const messageOnSuccess = 'Successfully completed.'
const messageOnFailure = 'Something unexpected happened. Please try again later.'
const messageOnNetworkError = 'Network error. Please check your connection.'

export const onSuccess = () => alert(messageOnSuccess)
export const onFailure = (e: Error) => e.message?.toLowerCase().includes('network')
  ? alert(messageOnNetworkError)
  : alert(messageOnFailure)