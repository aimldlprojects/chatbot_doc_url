import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface User {
    value: string;
    label: string;
}

interface UserDropdownProps {
    onSelect: (value: string) => void;
    style?: object;
}

const users: User[] = [
    { value: 'Bhavi', label: 'Bhavi' },
    { value: 'Madhu', label: 'Madhu' },
    { value: 'User', label: 'User' },
];

const UserDropdown: React.FC<UserDropdownProps> = ({ onSelect, style }) => {
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleUserSelect = (item: User) => {
        setSelectedUser(item);
        onSelect(item.value);
    };

    return (
        <View style={[styles.dropdownContainer, style]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', maxHeight: 30, justifyContent: 'flex-start' }}>
                <Text style={styles.selectedUserText}>
                    {selectedUser ? `${selectedUser.label}` : 'Select User'}
                </Text>
                <Dropdown
                    data={users}
                    value={selectedUser?.value}
                    onChange={handleUserSelect}
                    placeholder="Select User"
                    containerStyle={[styles.dropdown, { flex: 1, minWidth: 100, maxHeight: 200, alignSelf: 'flex-start', marginLeft: -70 }]}
                    labelField="label"
                    valueField="value"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    dropdownContainer: {
        marginBottom: 10,
        marginLeft: 60,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 5,
    },
    selectedUserText: {
        fontSize: 18,
        color: '#333',
        marginRight: 10,
    },
});

export default UserDropdown;
