import React, {
    Component
} from 'react';
import {
    View,
    Text
} from 'react-native';
import { offlineNoticeStyles } from '../../src/css/styles/common';

export class OfflineNotice extends Component {
    render() {
        return (<View style={offlineNoticeStyles.offlineContainer}>
                <Text style={offlineNoticeStyles.offlineText}>No Internet Connection</Text>
            </View>);
        }
    }