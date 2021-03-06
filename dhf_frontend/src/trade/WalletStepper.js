import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import SelectWallet from './BlockStep/SelectWallet';
import ConfirmPassword from './BlockStep/ConfirmPassword';
import ConfirmWallet from './BlockStep/ConfirmWallet';
import SubmitInitProject from './BlockStep/SubmitInitProject';
import SubmitCancelProject from './BlockStep/SubmitCancelProject';

const styles = theme => ({
  root: {
    width: '100%',
    margin: '0 auto',
  },
  table: {
    minWidth: 700,
    marginBottom: 30,
  },
  button: {
    marginRight: theme.spacing.unit,
  },
  backButton: {
    marginRight: theme.spacing.unit,
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

function getSteps() {
  return ['Select wallet type', 'Select Wallet', 'Decrypt Wallet', 'Confirm wallet Address', 'Fees and Confirm'];
}

function getStepsMetaMask() {
  return ['Select wallet type', 'Fees and Confirm'];
}


class WalletStepper extends React.Component {
  state = {
    activeStep: 0,
    completed: new Set(),
    skipped: new Set(),
    walletType: 'MetaMask',
    address: '',
    checkedTandC: false,
    selectedWallet: null,
    myDecryptedWallet: [],
    selectedConfirmWallet: null,
    isSubmitting: null,
    isTrxCompleted: null,
  };

  handleCheckBoxChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleWalletChange = event => {
    this.setState({ walletType: event.target.value });
  };

  handleAddressChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  totalSteps = () => {
    if (this.state.walletType === 'MetaMask') {
      return getStepsMetaMask().length;
    }

    return getSteps().length;
  };

  isStepOptional = step => {
    // return step === 1;
  };

  getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div>
            {' '}
            <RadioGroup
              aria-label="walletType"
              name="walletType"
              className={styles.group}
              value={this.state.walletType}
              onChange={this.handleWalletChange}
            >
              <FormControlLabel value="MetaMask" control={<Radio />} label="MetaMask" />
              <FormControlLabel value="NinjaWallet" control={<Radio />} label="NinjaWallet" />
            </RadioGroup>

          </div>
        );
      case 1:
        return (<SelectWallet  onChangeWallet={selectedWallet => this.setState({ selectedWallet })}/>);
      case 2:
        return (<ConfirmPassword wallet={this.state.selectedWallet} ref={'confirmPassword'} handleWalletDecrypted={myDecryptedWallet => this.setState({ myDecryptedWallet })}/>);
      case 3:
        return (<ConfirmWallet wallets={this.state.myDecryptedWallet} onChangeWallet={selectedConfirmWallet=> this.setState({ selectedConfirmWallet })} />);
      case 4:
        return (
          <div style={{ marginBottom: 10 }}>
            {this.props.stepperAction !== 'STOP' ?(<SubmitInitProject ref={'submitInitProject'}
              activeProject={this.props.activeProject.data}
              privateKey={this.state.selectedConfirmWallet.privateKey}
              onFinishedTrx={(hash) => this.setState({ isTrxCompleted: true })}
            />) : (
              <SubmitCancelProject ref={'submitCancelProject'}
                activeProject={this.props.activeProject.data}
                privateKey={this.state.selectedConfirmWallet.privateKey}
                onFinishedTrx={hash => this.setState({ isTrxCompleted: true })}
              />
            )}
          </div>
        );
      default:
        return (<div />);
    }
  };

  getStepContentMetaMask = (step) => {
    switch (step) {
      case 0:
        return (
          <div>
            {' '}
            <RadioGroup
              aria-label="walletType"
              name="walletType"
              className={styles.group}
              value={this.state.walletType}
              onChange={this.handleWalletChange}
            >
              <FormControlLabel value="MetaMask" control={<Radio />} label="MetaMask" />
              <FormControlLabel value="NinjaWallet" control={<Radio />} label="NinjaWallet" />
            </RadioGroup>

          </div>
        );
      case 1:
        return (
          <div style={{ marginBottom: 10 }}>
            {this.props.stepperAction !== 'STOP' ?(<SubmitInitProject ref={'submitInitProject'}
              walletType={this.state.walletType}
              activeProject={this.props.activeProject.data}
              onFinishedTrx={(hash) => this.setState({ isTrxCompleted: true })}
            />) : (
              <SubmitCancelProject ref={'submitCancelProject'}
                walletType={this.state.walletType} 
                activeProject={this.props.activeProject.data}
                onFinishedTrx={hash => this.setState({ isTrxCompleted: true })}
              />
            )}
          </div>
        );
      default:
        return (<div />);
    }
  };

  handleSkip = () => {
    const { activeStep } = this.state;
    if (!this.isStepOptional(activeStep)) {
      // You probably want to guard against something like this it should never occur
      // unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    this.setState(state => {
      const skipped = new Set(state.skipped.values());
      skipped.add(activeStep);
      return {
        activeStep: state.activeStep + 1,
        skipped,
      };
    });
  };

  handleNext = () => {
    let activeStep;
    if (this.state.walletType !== 'MetaMask') {
      if (this.state.activeStep === 1 && !this.state.selectedWallet) return;
      if (this.state.activeStep === 2) {
        const result = this.refs.confirmPassword.decryptWallet();
        if (!result) return;
      }
      if (this.state.activeStep === 3 && !this.state.selectedConfirmWallet) return;
    }
    if (this.isLastStep() && !this.allStepsCompleted()) {
      if (this.props.stepperAction !== 'STOP') {
        this.setState({ isSubmitting: true });
        this.refs.submitInitProject.handleConfirmTransaction();
        return;
      } else {
        this.setState({ isSubmitting: true });
        this.refs.submitCancelProject.handleConfirmTransaction();
        return;
      }
      console.log('islaststep all NOT finished');
      // It's the last step, but not all steps have been completed find the first step
      // that has been completed
      const steps = getSteps();
      activeStep = steps.findIndex((step, i) => !this.state.completed.has(i));
    } else {
      console.log('laststep all finsihed');
      activeStep = this.state.activeStep + 1;
    }
    this.setState({ activeStep });
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  handleStep = step => () => {
    // console.log('handle step click', step);
    // this.setState({ activeStep: step });
  };

  handleComplete = () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const completed = new Set(this.state.completed);
    completed.add(this.state.activeStep);
    this.setState({ completed });

    /**
     * Sigh... it would be much nicer to replace the following if conditional with
     * `if (!this.allStepsComplete())` however state is not set when we do this,
     * thus we have to resort to not being very DRY.
     */
    if (completed.size !== this.totalSteps() - this.skippedSteps()) {
      this.handleNext();
    }
  };

  handleReset = () => {
    this.setState({ activeStep: 0, completed: new Set(), skipped: new Set() });
  };

  skippedSteps() {
    return this.state.skipped.size;
  }

  isStepSkipped(step) {
    return this
      .state
      .skipped
      .has(step);
  }

  isStepComplete(step) {
    return this
      .state
      .completed
      .has(step);
  }

  completedSteps() {
    return this.state.completed.size;
  }

  allStepsCompleted() {
    return this.completedSteps() === this.totalSteps() - this.skippedSteps();
  }

  isLastStep() {
    return this.state.activeStep === this.totalSteps() - 1;
  }

  render() {
    const { classes } = this.props;
    let steps;
    if (this.state.walletType === 'MetaMask') {
      steps = getStepsMetaMask();
    } else {
      steps = getSteps();
    }
    const { activeStep } = this.state;

    return (
      <div className={classes.root}>
        <Stepper alternativeLabel nonLinear activeStep={activeStep}>
          {steps.map((label, index) => {
            const props = {};
            const buttonProps = {};
            if (this.isStepOptional(index)) {
              buttonProps.optional = <Typography variant="caption">Optional</Typography>;
            }
            if (this.isStepSkipped(index)) {
              props.completed = false;
            }
            return (
              <Step key={label} {...props}>
                <StepButton
                  onClick={this.handleStep(index)}
                  completed={this.isStepComplete(index)}
                  {...buttonProps}
                >
                  {label}
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
        <div style={{ margin: '0 75px', minHeight: '130px' }}>
          {this.allStepsCompleted()
            ? (
              <div>
                <Typography className={classes.instructions}>
                  All steps completed - you&quot;re finished
                </Typography>
                <Button onClick={this.handleReset}>Reset</Button>
              </div>
            )
            : (
              <div>
                <Typography className={classes.instructions}>{this.state.walletType === 'MetaMask' ? this.getStepContentMetaMask(activeStep) : this.getStepContent(activeStep)}</Typography>
              </div>
            )}
        </div>
        <div style={{ float: 'right', margin: '10px 34px' }}>
          <Button onClick={this.props.handleModalClose} color="primary" variant="outlined" className={classes.button}>
              Cancel
          </Button>
          <Button
            disabled={activeStep === 0}
            onClick={this.handleBack}
            color="primary"
            variant="outlined"
            className={classes.button}
          >
                  Back
          </Button>
          {!this.state.isTrxCompleted && <Button
            variant="outlined"
            color="primary"
            onClick={this.handleNext}
            className={classes.button}
            disabled={this.isLastStep() && this.state.isSubmitting}
          >
            {this.isLastStep() ? 'Submit' : 'Next'}
          </Button>}
          {this.state.isTrxCompleted && 
          <Button
            variant="outlined"
            color="primary"
            onClick={this.props.handleModalClose}
            className={classes.button}>
            Close
          </Button>}
          {this.isStepOptional(activeStep) && !this.state.completed
            .has(this.state.activeStep) && (
            <Button
              variant="outlined"
              color="primary"
              onClick={this.handleSkip}
              className={classes.button}
            >
                      Skip
            </Button>
          )}
          {/* {activeStep !== steps.length && (this.state.completed.has(this.state.activeStep)
            ? (
              <Typography variant="caption" className={classes.completed}>
                        Step
                {' '}
                {' '}
                {activeStep + 1}
                {' '}
                        already completed
              </Typography>
            )
            : (
              <Button variant="outlined" color="primary" onClick={this.handleComplete}>
                {this.completedSteps() === this.totalSteps() - 1
                  ? 'Finish'
                  : 'Complete Step'}
              </Button>
            ))} */}
        </div>
      </div>
    );
  }
}

WalletStepper.propTypes = {
  classes: PropTypes.object,
};

export default withStyles(styles)(WalletStepper);
