import React from 'react'
import ScatterPlot from 'components/charts/ScatterPlot'
import {ALPHABET} from 'utils/stringStats'

const DemoScatterPlot = props => (
  <div style={{width: '100%', height: '100%'}}>
    <ScatterPlot
      xDomain={ALPHABET}
      yDomain={ALPHABET}
      title='Characters co-occurrence side-by-side'
      radiusFactor={4}
      {...props}
    />
  </div>
)

export default DemoScatterPlot
