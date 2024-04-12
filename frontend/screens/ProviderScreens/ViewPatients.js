import React, { useContext, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions } from 'react-native'
import { DataTable } from 'react-native-paper';
import { SelectList } from 'react-native-dropdown-select-list'
import AuthContext from '../../AuthContext';
import User from '../../User';
import axios from 'axios';
import ProviderMenu from './ProviderMenu';

export default function ViewPatients({ navigation }) {

    const { signOut } = useContext(AuthContext);
    const userInfo = User();
    const practiceID = userInfo.practiceID;
    const [patientsArray, setPatientsArray] = useState([]);
    const [renderData, setRenderData] = useState([]);
    const [queriedPatients, setQueriedPatients] = useState(false);
    const stylesList = [styles.tableRow2, styles.tableRow1];
    const [filter, setFilter] = useState('All');
    const filterList = ['All', 'ATTRITION', 'INACTIVE', 'ACTIVE', 'MAINTENANCE']
    const [patientName, setPatientName] = useState('');

    useEffect(() => {
        const getPatients = async () => {
            const patients = await axios.get(`http://localhost:5000/api/getPatientsByPractice/${practiceID}`)
            if (patients.status == 200) {
                setPatientsArray(patients.data)
                setRenderData(patients.data)
            }
            setQueriedPatients(true);
        }

        if (!queriedPatients) { getPatients() }
    })

    useEffect(() => updateRenderData(), [patientName])

    const PList = () => (
        <div>
            {renderData.map((p, index) =>
                <DataTable.Row style={index == renderData.length - 1 ? { ...stylesList[index % 2], borderBottomEndRadius: 8, borderBottomStartRadius: 8 } : stylesList[index % 2]}>
                    <DataTable.Cell>{p.firstName}</DataTable.Cell>
                    <DataTable.Cell>{p.lastName}</DataTable.Cell>
                    <DataTable.Cell>{p.DoB}</DataTable.Cell>
                    <DataTable.Cell>{p.email}</DataTable.Cell>
                    <DataTable.Cell textStyle={{ marginLeft: 20 }}>{p.status}</DataTable.Cell>
                    <DataTable.Cell ><TouchableOpacity
                        style={styles.ViewButton}
                        onPress={() => handlePatientSelect(p)} key={p.id}>
                        <Text style={styles.ButtonText}> View </Text>
                    </TouchableOpacity></DataTable.Cell>
                </DataTable.Row>
            )}
        </div>
    );

    function handlePatientSelect(patient) {
        navigation.navigate('PatientDetails', { patient });
    }
    function handleNewButtonPress() {
        navigation.navigate('PatientInfoScreen');
    }

    function updateRenderData() {
        let newList = []

        patientsArray.map((element) => {
            let lastName = element.lastName.toLowerCase()
            if (patientName && filter == 'All') {
                let match = patientName.toLowerCase()
                if (lastName.includes(match)) {
                    newList.push(element);
                }
            }
            else if (filter == 'All') {
                newList.push(element);
            }
            else if (patientName && element.status == filter) {
                let match = patientName.toLowerCase()
                if (lastName.includes(match)) {
                    newList.push(element);
                }
            }
            else if (element.status == filter) {
                newList.push(element);
            }
        })

        setRenderData(newList);
    }

    return (
        <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                    <Text style={styles.header}>Patients</Text>
                    <TextInput style={styles.input}
                        underlineColorAndroid="transparent"
                        placeholder="Last Name"
                        placeholderTextColor="#7a7a7a"
                        value={patientName}
                        autoCapitalize="none"
                        onChangeText={(name) => {
                            setPatientName(name)
                        }} />
                    <SelectList
                        placeholder='Filter'
                        search={false}
                        defaultOption='All'
                        setSelected={(val) => setFilter(val)}
                        onSelect={() => updateRenderData()}
                        data={filterList}
                        boxStyles={styles.dropdown}
                        inputStyles={{ color: "#7a7a7a" }}
                        dropdownStyles={styles.dropdownSelect}
                    />
            <TouchableOpacity
                style={styles.NewButton}
                onPress={handleNewButtonPress}>
                <Text style={styles.NewButtonText}> Add Patient </Text>
            </TouchableOpacity>
                </View>
                <DataTable style={styles.table}>
                    <DataTable.Header style={styles.tableHeader}>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>First Name</DataTable.Title>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>Last Name</DataTable.Title>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14}}>D.o.B</DataTable.Title>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>Email</DataTable.Title>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14, marginLeft: 20 }}>Status</DataTable.Title>
                        <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14, marginLeft: 40 }}>Profile</DataTable.Title>
                    </DataTable.Header>
                    <PList />
                </DataTable>
                <View style={{ height: 30 }}></View>
            </View>
            <View style = {{width:900}} />
            <ProviderMenu navigation={navigation} />
        </View>
    );
}

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        paddingTop: 23,
        paddingLeft: 10,
        paddingRight: 10,
    },
    input: {
        margin: 15,
        height: 40,
        width: height > width ? null : 300,
        borderColor: '#1059d5',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10
    },
    header: {
        fontSize: 40,
        fontWeight: '600',
        marginTop: 10,
        marginLeft: 100,
        marginRight: 20,
        color: '#1059d5',
        marginBottom: 20,
    },
    table: {
        marginLeft: 100,
        minWidth: 950,
    },
    tableHeader: {
        backgroundColor: '#cbdeff',
        borderTopStartRadius: 8,
        borderTopEndRadius: 8,
        color: 'black',
    },
    tableRow2: {
        backgroundColor: '#ebebeb',
    },
    providerDashboardItem: {
        borderRadius: 8,
        height: 100,
        width: 100,
        marginBottom: 10,
        alignItems: 'center',
    },
    providerDashboardText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: -10,
    },
    dropdown: {
        margin: 15,
        height: 40,
        borderColor: '#1059d5',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10
    },
    dropdownSelect: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#1059d5',
        padding: 10
    },
    ViewButton: {
        backgroundColor: '#1059d5',
        padding: 10,
        marginLeft: 40,
        height: 30,
        justifyContent: 'center',
        borderRadius: 8,
    },
    ButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
    },
    
    NewButton: {
        backgroundColor: 'green', 
        padding: 10,
        marginLeft: 20,
        height: 30,
        justifyContent: 'center',
        borderRadius: 8,
    },
    NewButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 15,
    },
})