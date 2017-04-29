import React from 'react'
import Measure from 'react-measure'

const WithMeasure = WrappedComponent => wrappedComponentProps => (
  <Measure>
    {({width, height}) => (
      <div style={{width: '100%', height: '100%'}}>
        <WrappedComponent
          width={width}
          height={height}
          {...wrappedComponentProps}
        />
      </div>
    )}
  </Measure>
)

export default WithMeasure
