import React, { Component } from 'react'
import { View, Image } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux';

import { configs, constants, arrays, anis, images, colors } from '../commons'
import { showSnackBar, showToast, saveSetting } from '../redux/actions/App'
import { Loading, Button, Text } from '../components'
import { asyncSto, string, navi, fetchApp } from '../helper'
import styles from './styles/Splash'


class Splash extends Component {

    constructor(props) {
        super(props)
        this.state = {
            selectLanguage: 0,
            isFetchError: false,
            isFirstSetup: false,
            fetchResponse: undefined
        }
    }

    renderOneLanguage = (v, i) => {
        return (
            <View key={i}>
                <Button
                    title={string('name', v)}
                    style={[
                        styles.margin,
                        { backgroundColor: this.state.selectLanguage !== i ? 'gray' : colors.accent }
                    ]}
                    onPress={() => this.setState({ selectLanguage: i })} />
            </View>
        )
    }

    //render view select language at first setup App
    renderFirtsSetting() {
        const { isFetchError, isFirstSetup } = this.state

        if (isFetchError) {
            return (
                <View>
                    <Button title='Reload' onPress={this.onPressReload} />
                </View>
            )
        }

        if (isFirstSetup) {
            return (
                <View>
                    <Text style={[styles.label]} >{string('select_language', arrays.source_language[this.state.selectLanguage])}</Text>
                    <View style={styles.constLanguage}>
                        {arrays.source_language.map(this.renderOneLanguage)}
                    </View>
                    <Button title={string('confirm', arrays.source_language[this.state.selectLanguage])} style={styles.margin}
                        onPress={() => this.onPressConfirm()} />
                </View>
            )
        }

        return (
            <Loading />
        )
    }

    render() {
        return (
            <View style={styles.constant}>
                <Text style={styles.logo}> NEWS </Text>
                {this.renderFirtsSetting()}
                <View style={{height:60}}/>
            </View>
        )
    }

    componentDidMount() {
        this.fetchGetResource()
    }

    onPressReload = () => {
        this.setState({ isFetchError: false })
        this.fetchGetResource()
    }

    onPressConfirm = () => {
        asyncSto.set({ [constants.STO_LANGUAGE]: arrays.source_language[this.state.selectLanguage] })
            .then(response => {
                saveSetting({ language: arrays.source_language[this.state.selectLanguage] })
                this.props.navigation.dispatch(navi.reset({ name: 'Home' }))
            })
            .catch(error => {
                this.props.showToast(error)
                this.setState({ fetchLoading: false, fetchError: true })
            })
    }

    fetchGetResource = () => {
        let { saveSetting } = this.props
        fetchApp.getSources()
            .then(response => {
                saveSetting({ source: response })
                this.setState({ fetchResponse: response })
                this.checkLoginFirst()
            })
            .catch(err => {
                this.setState({ isFetchError: true })
            })
    }

    checkLoginFirst = () => {
        let { saveSetting } = this.props
        asyncSto.get(constants.STO_LANGUAGE)
            .then(response => {
                console.log(response)
                console.log(response === null)
                if (response[0] === null) {
                    this.setState({ isFirstSetup: true })
                } else {
                    saveSetting({ language: response })
                    this.props.navigation.dispatch(navi.reset({ name: 'Home' }))
                }
            }).catch((err) => console.log('hiih', err))
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        state: state
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        showSnackBar: (time, timeout) => dispatch(showSnackBar(time, timeout)),
        showToast: (time, timeout) => dispatch(showToast(time, timeout)),
        saveSetting: (data) => dispatch(saveSetting(data)),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Splash)