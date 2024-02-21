import { Alert, Snackbar } from '@mui/material'
import React, { useContext} from 'react'
import { ActionContext } from '../../context/ActionContext'

const AlertPopUp = ({severity,message}) => {
   const {alertOpen,handleAlertClose}=useContext(ActionContext)

  return (
<Snackbar open={alertOpen} autoHideDuration={1500}  anchorOrigin={{ vertical:'top', horizontal:'center' }} onClose={handleAlertClose}>
  <Alert
    severity={severity}
    variant="filled"
    sx={{ width: '100%' }}
  >
{message}
  </Alert>
</Snackbar>
  )
}

export default AlertPopUp
