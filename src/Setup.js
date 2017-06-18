import React, { Component } from 'react'
import { connect } from 'react-redux';

import { StyleSheet, StatusBar, View, Image } from 'react-native'
import { configs, styles, colors } from './commons'
import { SnackBar, Toast } from './components'

class Setup extends Component {
    render() {
        return (
            <View style={styles.appConst}>
                {this.props.children}
                <SnackBar />
                <Toast />
                <StatusBar barStyle="dark-content"
                    translucent={true}
                    backgroundColor='transparent' />
            </View>
        )
    }
}

export default Setup