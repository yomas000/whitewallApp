/* @flow */

import React, { // eslint-disable-line no-unused-vars
    Component
  } from 'react'

  import {
    Image,
    View,
    ActivityIndicator
  } from 'react-native'
  
  type Style = number | string | Object | Array<Style>
  
  type Props = {
    placeholderColor?: string,
    style: {
      width: number,
      height: number,
      [key: string]: Style
    },
    source: {
      uri: string
    }
  }
  
  type State = {
    loaded: boolean
  }
  
  export default class AsyncImage extends Component {
  
    props: Props
    state: State
  
    constructor(props: Props) {
      super(props)
      this.state = { loaded: false }
    }
  
    render() {
      const {
        placeholderColor,
        style,
        source
      } = this.props
  
      return (
        <View
          style={style}>
  
          <Image
            source={source}
            resizeMode={'contain'}
            style={[
              style
            ]}
            onLoad={this._onLoad} />
  
          {!this.state.loaded &&
            <ActivityIndicator/>
          }
  
        </View>
      )
    }
  
    _onLoad = () => {
      this.setState(() => ({ loaded: true }))
    }
  }