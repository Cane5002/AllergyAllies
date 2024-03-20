import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { DataTable } from 'react-native-paper';
import axios from 'axios';
import User from '../../User';
import AuthContext from '../../AuthContext';
import ProviderMenu from './ProviderMenu';
import AsyncStorage from '@react-native-async-storage/async-storage';
import id from 'date-fns/locale/id';
import { getHeaders } from '../../utils/dataUtils';
import jsObjExporter from '../../utils/jsObjExporter/index.js';

export default function Reports({ navigation }) {
  const userInfo = User();
  const { signOut } = useContext(AuthContext);
  const providerID = userInfo.id;
  const [reports, setReports] = useState([]);
  const [attritionError, setAttritionError] = useState(null);
  const [maintenanceError, setMaintenanceError] = useState(null);
  const [refillError, setRefillError] = useState(null);
  const [needsRetestError, setNeedsRetestError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const closeModal = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  const openModal = (report) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const getStoredReports = async () => {
    try {
      const storedReports = await AsyncStorage.getItem('reports');
      if (storedReports) {
        const allReports = JSON.parse(storedReports);
        const providerReports = allReports.filter((report) => report.providerID === providerID);
        setReports(providerReports);
      }
    } catch (error) {
      console.error('Error getting stored reports:', error);
    }
  };

  const storeReports = async (newReports) => {
    try {
      await AsyncStorage.setItem('reports', JSON.stringify(newReports));
    } catch (error) {
      console.error('Error storing reports:', error);
    }
  };

  const downloadCsv = (report) => {
    if (!report) return;
    console.log("Initiating CSV download");
    console.log(report);
    var csvData = reportToCsv(report);
    var blob = new Blob([csvData], {type: "text/csv"});
    console.log(blob);
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', 'report.csv');
    document.body.appendChild(a);
    a.click();
  }

  const downloadReport = (report, format) => {
    if (!report) return;
    console.log("Initiating " + format + " download");
    console.log(report);

    objectExporter({
      exportable: report.data.data,
      type: format,
      headers: getHeaders(report.type),
      fileName: report.type.replace(/\s/g, '')+"Report"+report.dateGenerated, 
      headerStyle: 'font-weight: bold; padding: 5px; border: 1px solid #dddddd;',
      cellStyle: 'padding: 5px; border: 1px solid #dddddd;',
      documentTitle: report.type+" Report "+report.dateGenerated,
      documentTitleStyle: 'font-weight: bold; padding: 10px; font-size: 30px'
    })
  }

  useEffect(() => {
    const fetchData = async () => {
      await getStoredReports();
    };

    fetchData();
  }, []);

  const removeReport = (index) => {
    setReports((prevReports) => {
      const updatedReports = [...prevReports];
      updatedReports.splice(index, 1);
      storeReports(updatedReports);
      return updatedReports;
    });
  };

  const generateAttritionReport = async () => {
    try {
      console.log('Generating Attrition Report...');
      const response = await axios.get(`http://localhost:5000/api/attritionReport/${providerID}`);
      console.log('Response:', response);

      const newReport = {
        type: 'Attrition',
        dateGenerated: new Date().toLocaleDateString(),
        data: response.data,
      };

      setReports((prevReports) => {
        const updatedReports = [...prevReports, newReport];
        storeReports(updatedReports);
        return updatedReports;
      });
      setAttritionError(null);
    } catch (error) {
      console.error('Error fetching attrition report:', error);
      setAttritionError('Error fetching attrition report. Please try again.');
    }
  };

  const generateApproachingMaintenanceReport = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/approachingMaintenanceReport/${providerID}`);
      const newReport = {
        type: 'Approaching Maintenance',
        dateGenerated: new Date().toLocaleDateString(),
        data: response.data,
      };

      setReports((prevReports) => {
        const updatedReports = [...prevReports, newReport];
        storeReports(updatedReports);
        return updatedReports;
      });
      setMaintenanceError(null);
    } catch (error) {
      console.error('Error fetching Approaching Maintenance report:', error);
      setMaintenanceError('Error fetching Approaching Maintenance report. Please try again.');
    }
  };

  const needsRetestReport = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/needsRetestReport/${providerID}`);
      const newReport = {
        type: 'Needs Retest',
        dateGenerated: new Date().toLocaleDateString(),
        data: response.data,
      };

      setReports((prevReports) => {
        const updatedReports = [...prevReports, newReport];
        storeReports(updatedReports);
        return updatedReports;
      });
      setNeedsRetestError(null);
    } catch (error) {
      console.error('Error fetching Needs Retest report:', error);
      setNeedsRetestError('Error fetching Needs Retest report. Please try again.');
    }
  };

  const refillsReport = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/refillsReport/${providerID}`);
      const newReport = {
        type: 'Refills',
        dateGenerated: new Date().toLocaleDateString(),
        data: response.data,
      };

      setReports((prevReports) => {
        const updatedReports = [...prevReports, newReport];
        storeReports(updatedReports);
        return updatedReports;
      });
      setRefillError(null);
    } catch (error) {
      console.error('Error fetching Refills report:', error);
      setRefillError('Error fetching Refills report. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'white' }}>
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
          <Text style={styles.header}>Your Reports</Text>
          <Text style={{ fontSize: 15, color: '#1059d5', paddingLeft: 40, marginTop: 65, marginRight: 5 }}>
            Generate a new report of type:{' '}
          </Text>
          <TouchableOpacity onPress={generateAttritionReport}>
            <Text style={{ fontSize: 15, color: '#1059d5', textDecorationLine: 'underline', marginTop: 65, marginRight: 15 }}>
              Attrition
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={generateApproachingMaintenanceReport}>
            <Text style={{ fontSize: 15, color: '#1059d5', textDecorationLine: 'underline', marginTop: 65, marginRight: 15 }}>
              Approaching Maintenance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={refillsReport}>
            <Text style={{ fontSize: 15, color: '#1059d5', textDecorationLine: 'underline', marginTop: 65, marginRight: 15 }}>
              Refills
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={needsRetestReport}>
            <Text style={{ fontSize: 15, color: '#1059d5', textDecorationLine: 'underline', marginTop: 65, marginRight: 15 }}>
              Needs Retest
            </Text>
          </TouchableOpacity>
          
        </View>

        <DataTable style={styles.table}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>Past Reports</DataTable.Title>
            <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>Type</DataTable.Title>
            <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>Date Generated</DataTable.Title>
            <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}></DataTable.Title>
          </DataTable.Header>

          {reports.map((report, index) => (
            <DataTable.Row key={index} style={index % 2 === 0 ? styles.tableRow2 : styles.tableRow1}>
              <DataTable.Cell>
                {report.data ? (
                  <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                    <TouchableOpacity onPress={() => openModal(report)}>
                      <Text style={{ color: '#1059d5', textDecorationLine: 'underline', marginRight: 10 }}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => downloadReport(report, 'csv')}>
                      <Text style={{ color: '#1059d5', textDecorationLine: 'underline', marginRight: 5 }}>CSV</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => downloadReport(report, 'pdf')}>
                      <Text style={{ color: '#1059d5', textDecorationLine: 'underline' }}>PDF</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text>No patients at risk of attrition.</Text>
                )}
              </DataTable.Cell>
              <DataTable.Cell>{report.type}</DataTable.Cell>
              <DataTable.Cell>{report.dateGenerated}</DataTable.Cell>
              <DataTable.Cell>
                {report.data && (
                  <TouchableOpacity onPress={() => removeReport(index)}>
                    <Text style={{ color: 'red', textDecorationLine: 'underline' }}>Delete</Text>
                  </TouchableOpacity>
                )}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>

        {attritionError && (
          <View>
            <Text style={{ color: 'red' }}>{attritionError}</Text>
          </View>
        )}

        <View style={{ height: 30 }}></View>
      </ScrollView>

      <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* <Text>{selectedReport && selectedReport.data ? JSON.stringify(selectedReport.data, null, 2) : ''}</Text> */}
            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
              <TouchableOpacity onPress={closeModal}>
                <Text style={{ color: 'blue', marginRight: 10 }}>Close</Text>
              </TouchableOpacity>
              <Text>Download ( </Text>
              <TouchableOpacity onPress={() => downloadReport(selectedReport, 'csv')}>
                <Text style={{ color: 'blue'}}>CSV</Text>
              </TouchableOpacity>
              <Text> | </Text>
              <TouchableOpacity onPress={() => downloadReport(selectedReport, 'pdf')}>
                <Text style={{ color: 'blue'}}>PDF</Text>
              </TouchableOpacity>
              <Text> )</Text>
            </View>
          </View>
        </View>
      </Modal>

      <ProviderMenu navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 40,
    marginTop: 40,
    fontWeight: '600',
    marginLeft: 100,
    color: '#1059d5',
    marginBottom: 10,
  },
  table: {
    marginLeft: 100,
    width: 800,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  providerDashboardItem:{
    borderRadius: 8,
    height: 100,
    width: 100,
    marginBottom: 10,
    alignItems: 'center',
 },
 providerDashboardText:{
    color: 'white',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: -10,
 },
});
