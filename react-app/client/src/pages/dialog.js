import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from "@material-ui/core/Button";

export default function Dialogcomponent(props) {

    return (
        <Dialog
        open={props.variable}
        onClose={props.fun}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.heading}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {/* Mail enntered is not registered, please provide registered mail or go to login for registraion
             */}
             {props.text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
              props.fun();
          }} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
}