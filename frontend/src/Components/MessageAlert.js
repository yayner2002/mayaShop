import { Alert } from "react-bootstrap";

const MessageAlert = ({variant, children}) => {
  return (
   <Alert variant={variant}>
    {children}
   </Alert>
  )
}

export default MessageAlert

MessageAlert.defaultProps = {
  variant: "info"
}