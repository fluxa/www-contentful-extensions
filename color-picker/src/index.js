import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { TextInput, HelpText } from '@contentful/forma-36-react-components';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

export class App extends React.Component {

  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  detachExternalChangeHandler = null;
  detachSysChanged = null;

  hexColour = new RegExp(/^#(?:[0-9a-f]{6}){1}$/i);
  defaultColor = '#000000';
  textFieldEl = React.createRef();
  colorPickerEl = React.createRef();


  constructor(props) {
    super(props);

    this.state = {
      value: props.sdk.field.getValue() || '',
      error: false
    };


  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);

  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = value => {

    this.setState({ value });
    this.renderUI();

  };

  onPickerChange = e => {
    const value = this.colorPickerEl.current.value;
    this.setState({ value });
    this.props.sdk.field.setValue(value);
  }

  onInputChange = e => {
    const value = e.currentTarget.value;
    const isValidColor = this.hexColour.test(value);
    this.setState( { value });
    this.props.sdk.field.setValue(value);
    renderUI();
    //
    // if ( isValidColor ) {
    //   this.setState({ value, error: false });
    //   this.props.sdk.field.setValue(value);
    // } else {
    //   this.setState({ error: true });
    //   // this.props.sdk.field.removeValue();
    //   this.props.sdk.field.setValue(value);
    // }
  };

  renderUI = () => {
    // Input
    const isValidColor = this.hexColour.test(this.state.value);
    if ( isValidColor ) {
      this.colorPickerEl.current.value = this.state.value;
      this.setState( { error: false });
    } else {
      this.colorPickerEl.current.value = this.defaultColor;
      this.setState( { error: true });
    }
  }

  render = () => {
    return (

      <React.Fragment>
        <HelpText>Input the HEX value in the format: #rrggbb or use the color picker to choose a color.</HelpText>
        <input
          class="color-picker"
          type="color"
          ref={this.colorPickerEl}
          onChange={this.onPickerChange}
        />
        <TextInput
          width="small"
          type="text"
          id="my-field"
          testId="my-field"
          ref={this.textFieldEl}
          error={this.state.error}
          value={this.state.value}
          onChange={this.onInputChange}
          maxLength={7}
        />


      </React.Fragment>



    );
  }
}

init(sdk => {
  console.log('ss')
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
