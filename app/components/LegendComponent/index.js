import React, { PureComponent } from 'react';
import ToolTip from 'react-portal-tooltip';
import PropTypes from 'prop-types';

import styles from './styles.scss';

// additional styles for tooltip (disables glitchy transitions + black background)
const TOOLTIP_STYLE = {
  style: {
    borderRadius: 4,
    background: '#3a3a48',
    color: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
    transition: null,
    maxWidth: 150,
    padding: 10,
  },
  arrowStyle: {
    color: '#3a3a48',
    borderColor: '#3a3a48',
    transition: null,
  },
};

class LegendComponent extends PureComponent {
  static propTypes = {
    legendItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        description: PropTypes.string,
      }),
    ).isRequired,
    colors: PropTypes.arrayOf(PropTypes.string).isRequired,
    wrapperClassName: PropTypes.string,
    onMouseOver: PropTypes.func,
    onMouseLeave: PropTypes.func,
  };

  static defaultProps = {
    wrapperClassName: undefined,
    onMouseOver: undefined,
    onMouseLeave: undefined,
  };

  state = {
    legendTooltip: false,
  };

  onMouseOver = legendItem => {
    this.setState({ legendTooltip: legendItem });
  };

  onMouseLeave = () => {
    this.setState({ legendTooltip: false });
  };

  getItems() {
    const { legendItems, colors } = this.props;
    return legendItems.map((item, index) => ({
      ...item,
      color: item.color ? item.color : colors[index % legendItems.length],
    }));
  }

  render() {
    const {
      wrapperClassName,
      onMouseOver = this.onMouseOver,
      onMouseLeave = this.onMouseLeave,
    } = this.props;

    return (
      <div className={wrapperClassName}>
        <div className="rv-discrete-color-legend horizontal">
          {this.getItems().map(legendItem => (
            <div
              key={legendItem.id}
              id={legendItem.id}
              className="rv-discrete-color-legend-item horizontal clickable"
              onMouseOver={event => onMouseOver(legendItem, event)}
              onMouseLeave={event => onMouseLeave(legendItem, event)}
            >
              <span
                className="rv-discrete-color-legend-item__color"
                style={{ background: legendItem.color }}
              />
              <span className="rv-discrete-color-legend-item__title">{legendItem.name}</span>
            </div>
          ))}
        </div>
        {this.state.legendTooltip && (
          <ToolTip
            active={!!this.state.legendTooltip.description}
            position="top"
            arrow="center"
            parent={`#${this.state.legendTooltip.id}`}
            tooltipTimeout={0}
            style={TOOLTIP_STYLE}
          >
            <div>
              <h4 className={styles.title}>{this.state.legendTooltip.name}</h4>
              <hr
                className={styles.separator}
                style={{ borderColor: this.state.legendTooltip.color }}
              />
              <p className={styles.name}>{this.state.legendTooltip.description}</p>
            </div>
          </ToolTip>
        )}
      </div>
    );
  }
}

export default LegendComponent;
