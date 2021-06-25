import { useIsFocused } from '@react-navigation/native';
import AbortController from 'abort-controller';
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useState } from 'react';
import { BodyContainer } from '../../common/functional-components/BodyContainer';
import BurgerMenuIcon from '../../common/functional-components/BurgerMenuIcon';
import PreLoader from '../../common/functional-components/PreLoader';
import { AppContext } from '../store-context/AppContext';
import AddGroupIcon from './AddGroupIcon';
import TabBars from './TabBars';

const Groups = (props: any) => {
    const controller = new AbortController();
    const { group } = useContext(AppContext) as any;
    const { navigation } = props;
    const [isLoading, setIsLoading] = useState(true);
    const isFocused = useIsFocused();

    useEffect(() => {
        console.log('3 Groups');
        if (isFocused) {
            setIsLoading(false);
        }

        return () => {
            controller.abort();
        };
    }, [!!group.length]);

    if (isLoading) {
        return (<PreLoader
            size={50}
            containerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        />);
    }

    return (
        <BodyContainer>
            <BurgerMenuIcon
                action={navigation.openDrawer}
            />
            <TabBars />
            <AddGroupIcon />
        </BodyContainer>
    );
};

Groups.propTypes = {
    navigation: PropTypes.object
};

memo(Groups);

export {
    Groups
};
