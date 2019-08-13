import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { TextInput, HelpText } from '@contentful/forma-36-react-components';
import { GithubPicker, CirclePicker, SwatchesPicker } from 'react-color';
import { init } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';

export class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  detachExternalChangeHandler = null;
  tigoColors = [['#00377d'],['#ffffff'], ['#00c8ff'], ['#ffbe00'], ['#00000a']];
  defaultValue = { text: '', color: '#00377d' };
  colorPickerEl = React.createRef();

  constructor(props) {
    super(props);
    const currentValue = props.sdk.field.getValue() || this.defaultValue;
    this.state = {
      text: currentValue.text,
      color: currentValue.color
    };
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange);
    console.log(this.colorPickerEl.current)
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler();
    }
  }

  onExternalChange = value => {
    // console.log('onExt')
    if (value) {
      // console.log(value);
      this.setState({ value });
    }
  };

  onChange = e => {
    const text = e.currentTarget.value;
    this.setState({ text });
    if (text) {
      this.props.sdk.field.setValue({ text, color: this.state.color });
    } else {
      this.props.sdk.field.removeValue();
    }
  };

  onColorChange = (color, event) => {
    this.setState({ color: color.hex });
    this.props.sdk.field.setValue({ text: this.state.text, color: this.state.color });

  };

  render() {
    return (
      <React.Fragment>
      <SwatchesPicker
        width={300}
        height={50}
        colors={this.tigoColors}
        color={this.state.color}
        onChangeComplete={this.onColorChange}
        />
        <TextInput
          width="large"
          type="text"
          id="my-field"
          testId="my-field"
          value={this.state.text}
          onChange={this.onChange}
        />

      </React.Fragment>
    );
  }
}

init(sdk => {
  ReactDOM.render(<App sdk={sdk} />, document.getElementById('root'));
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
