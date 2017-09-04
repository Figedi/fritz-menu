import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { ticks } from 'd3-array';
import {
  XYPlot,
  HorizontalGridLines,
  XAxis,
  YAxis,
  LineSeries,
  Crosshair,
  DiscreteColorLegend,
} from 'react-vis';

import styles from './styles.scss';

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

  render() {
    const { data, title } = this.props;
    const legendItems = data.series.map(seriesData => seriesData.id);
    const tickValues = [...ticks(0, data.max, 5), data.max];
    return (
      <div className={styles.wrapper}>
        <div className={styles.title_wrapper}>
          <h4 className={styles.title}>
            {title}
          </h4>
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
            {data.series.map((seriesData, i) =>
              (<LineSeries
                key={seriesData.id}
                curve="curveMonotoneX"
                data={seriesData.data}
                {...i === 0 && { onNearestX: this.setCrosshair }}
              />),
            )}
            <Crosshair values={this.state.crosshairValues} />
          </XYPlot>
        </div>
        <div className={styles.legend}>
          <DiscreteColorLegend items={legendItems} orientation="horizontal" />
        </div>
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
