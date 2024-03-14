import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

export const showAlerts = (msg, icon, focus) => {
  const MySwal = withReactContent(Swal);
  MySwal.fire({
    title: msg,
    icon: icon
  })
}

const onFocus = (focus) => {
  if (focus !== "") {
    document.getElementById(focus).focus()
  }
}