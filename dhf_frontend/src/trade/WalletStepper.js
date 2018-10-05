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

const styles = theme => ({
  root: {
    width: '100%',
    margin: '0 auto',
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
  return ['Select wallet type', 'Select address', 'Decrypt wallet key', 'Confirm wallet Address'];
}

function getStepsMetaMask() {
  return ['Select wallet type', 'Confirm wallet Address'];
}


class WalletStepper extends React.Component {
  state = {
    activeStep: 0,
    completed: new Set(),
    skipped: new Set(),
    walletType: 'MetaMask',
    address: '',
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
        return (
          <div>
            <Select
              value={this.state.address}
              onChange={this.handleAddressChange}
              fullWidth
              displayEmpty
              style={{ marginTop: 20 }}
              inputProps={{
                name: 'address',
                id: 'address',
              }}
            >
              <MenuItem value="" disabled>
                Please select Ninja Wallet Address
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>

          </div>
        );
      case 2:
        return (
          <div>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Enter password</InputLabel>
              <Input id="password" name="password" autoComplete="password" autoFocus onChange={this.handleAddressChange} value={this.state.password} type="password" />
            </FormControl>
          </div>
        );
      default:
        return (<div>'Step 1: Select campaign settings...</div>);
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

    if (this.isLastStep() && !this.allStepsCompleted()) {
      // It's the last step, but not all steps have been completed find the first step
      // that has been completed
      const steps = getSteps();
      activeStep = steps.findIndex((step, i) => !this.state.completed.has(i));
    } else {
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
    this.setState({ activeStep: step });
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
                <Typography className={classes.instructions}>{this.getStepContent(activeStep)}</Typography>
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
          <Button
            variant="outlined"
            color="primary"
            onClick={this.handleNext}
            className={classes.button}
          >
                    Next
          </Button>
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
