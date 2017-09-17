import React, { PureComponent } from 'react';
import dateFormat from 'dateformat';
import PropTypes from 'prop-types';
import { ticks } from 'd3-array';
import { XYPlot, HorizontalGridLines, XAxis, YAxis, LineSeries, Crosshair } from 'react-vis';

import LegendComponent from '../LegendComponent';
import styles from './styles.scss';

/**
 * Use the same default colors as react-vis for our custom component as default
 */
const DEFAULT_COLOR_RANGE = ['#12939A', '#79C7E3', '#1A3177', '#FF9833', '#EF5D28'];

/**
 * Some default descriptions to the legend for fritzbox stuff
 */
const DEFAULT_DESCRIPTIONS = {
  media: 'Shows IPTV-related downstream-usage.',
  internet: 'Shows internet-related downstream-usage.',
  realtime: 'Shows realtime-related upstream-usage. (e.g. video)',
  low: 'Shows background-related upstream-usage.',
  high: 'Shows prioritized-related upstream-usage.',
  default: 'Shows normal-related upstream-usage.',
};

class Graph extends PureComponent {
  state = {
    crosshairValues: [],
  };

  setCrosshair = (value, { index }) => {
    const { data } = this.props;
    const crosshairValues = data.series.map(seriesData => seriesData.data[index]);
    this.setState({ crosshairValues });
  };

  resetCrosshair = () => this.setState({ crosshairValues: [] });

  formatCrosshairTitle = items => ({
    title: 'X',
    value: dateFormat(items[0].x, 'h:MM:ss TT'),
  });

  formatCrosshairItems = items => {
    const { data } = this.props;
    data.series.map(seriesData => seriesData.id);
    return items.map((d, i) => ({
      title: data.series[i].id,
      value: `${d.y.toFixed(2)} kB/s`,
    }));
  };

  render() {
    const { data, title } = this.props;
    const legendItems = data.series.map(seriesData => ({
      id: seriesData.id,
      name: seriesData.id,
      description: DEFAULT_DESCRIPTIONS[seriesData.id],
    }));
    const tickValues = [...ticks(0, data.max, 5), data.max];
    return (
      <div className={styles.wrapper}>
        <div className={styles.title_wrapper}>
          <h4 className={styles.title}>{title}</h4>
        </div>
        <div className={styles.graph}>
          <XYPlot
            height={300}
            width={390}
            yDomain={[0, data.max]}
            onMouseLeave={this.resetCrosshair}
            margin={{ left: 50, right: 10, top: 10, bottom: 10 }}
          >
            <HorizontalGridLines tickValues={tickValues} />
            <XAxis title="Time" hideTicks />
            <YAxis title="kB" tickValues={tickValues} />
            {data.series.map((seriesData, i) => (
              <LineSeries
                key={seriesData.id}
                curve="curveMonotoneX"
                data={seriesData.data}
                stroke={DEFAULT_COLOR_RANGE[i % data.series.length]}
                {...i === 0 && { onNearestX: this.setCrosshair }}
              />
            ))}
            <Crosshair
              values={this.state.crosshairValues}
              titleFormat={this.formatCrosshairTitle}
              itemsFormat={this.formatCrosshairItems}
            />
          </XYPlot>
        </div>
        <LegendComponent
          wrapperClassName={styles.legend}
          legendItems={legendItems}
          colors={DEFAULT_COLOR_RANGE}
        />
      </div>
    );
  }
}

Graph.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.shape({
    max: PropTypes.number,
    series: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        data: PropTypes.arrayOf(
          PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
          }),
        ),
      }),
    ),
  }).isRequired,
};

export default Graph;
