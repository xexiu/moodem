import { useIsFocused } from '@react-navigation/native';
import AbortController from 'abort-controller';
import PropTypes from 'prop-types';
import React, { memo, useContext, useEffect, useState } from 'react';
import { Keyboard} from 'react-native';
import { getAllGroups } from '../../../src/js/Utils/Helpers/actions/groups';
import BodyContainer from '../../common/functional-components/BodyContainer';
import BurgerMenuIcon from '../../common/functional-components/BurgerMenuIcon';
import CommonTopSearchBar from '../../common/functional-components/CommonTopSearchBar';
import PreLoader from '../../common/functional-components/PreLoader';
import { AppContext } from '../store-context/AppContext';
import AddGroupIcon from './AddGroupIcon';
import { NewGroup } from './NewGroup';
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
            <CommonTopSearchBar
                placeholder='Search group...'
                cancelSearch={() => {
                    setIsLoading(false);
                }}
                onEndEditingSearch={() => {}}
            />
            <TabBars />
            <AddGroupIcon />
            {/* <View>
                <CustomModal isModalVisible={showPasswordModal} onBackdropPress={() => togglePasswordModal(false)}>
                    <Form
                        ref={refPassWordForm}
                        type={struct({
                            password: formValidationGroup.group_password
                        })}
                        value={value}
                        onChange={(text: string) => {
                            setPasswordFormValue({ value: text });
                        }}
                    />
                    <CustomButton
                        btnTitle='OK'
                        action={() => {
                            if (value && value.password === userGroup.group_password) {
                                togglePasswordModal(false);
                                setPasswordFormValue({ value: '' });

                                if (isSearching) {
                                    // setGroups({
                                    //     groups: [...groups, userGroup] as never
                                    // });
                                    setIsLoading(false);
                                    setIsSearching(false);
                                } else {
                                    Object.assign(props.route.params.group, {
                                        group: {
                                            ...userGroup
                                        }
                                    });
                                    navigation.navigate('Moodem', {
                                        group: {
                                            ...userGroup
                                        }
                                    });
                                }
                            } else {
                                setErrorPassword('Password incorrect!');
                            }
                        }}
                    />
                    <CustomButton
                        btnTitle='Cancel'
                        btnStyle={{
                            backgroundColor: '#00b7e0',
                            marginTop: 10,
                            width: 200,
                            marginLeft: 'auto',
                            marginRight: 'auto'
                        }}
                        action={() => {
                            setIsSearching(false);
                            togglePasswordModal(false);
                            setIsLoading(false);
                            setErrorPassword('');
                        }}
                    />
                    <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{errorPassword}</Text>
                </CustomModal>
            </View> */}

            {/* <NewGroup showModal={showModal} toggleModal={toggleModal} user={user} handleNewGroup={handleNewGroup} navigation={navigation} /> */}
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
