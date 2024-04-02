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
      const providerReports = await axios.get(`http://localhost:5000/api/getAllReports/${providerID}`);
      if (providerReports) {
        setReports(providerReports.data.reports);
      } else console.log("No reports in db");
    } catch (error) {
      console.error('Error getting stored reports:', error);
    }
  }

  const downloadReport = async (report, format) => {
    if (!report) return;
    console.log("Initiating " + format + " download");
    console.log(report);
    
    try {
      const practiceResponse = await axios.get(`http://localhost:5000/api/practice/${userInfo.practiceID}`);

      objectExporter({
        exportable: report.data,
        type: format,
        headers: getHeaders(report.reportType),
        fileName: report.reportName, 
        headerStyle: 'font-weight: bold; padding: 5px; border: 1px solid #dddddd;',
        cellStyle: 'padding: 5px; border: 1px solid #dddddd;',
        documentTitle: practiceResponse.data.practiceName + ": " + report.reportName.replace(/_/g, ' '),
        documentTitleStyle: 'font-weight: bold; padding: 10px; font-size: 30px'
      })
    } catch (error) {
      console.error('Error downloading reports:', error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await getStoredReports();
    };

    fetchData();
  }, []);

  const removeReport = async (index) => {
    setReports((prevReports) => {
      try {
        axios.delete(`http://localhost:5000/api/deleteReport/${prevReports[index]._id}`); 
      } catch (error) {
        console.error('Error getting stored reports:', error);
      }
      const updatedReports = [...prevReports];
      updatedReports.splice(index, 1);
      return updatedReports;
    });
    
  }

  const generateReport = async (type) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/${type}/${providerID}`);
      
      if (!response.data.data) {
        console.log("No report");
        alert(response.data.message);
        return
      }

      const newReport = response.data;

      setReports((prevReports) => {
        const updatedReports = [newReport, ...prevReports];
        return updatedReports;
      });
      setRefillError(null);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      setRefillError(`Error fetching ${type}:. Please try again.`);
    }
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'white' }}>
      <ScrollView style={{ backgroundColor: 'white' }}>
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
          <Text style={styles.header}>Your Reports</Text>
          <Text style={{ fontSize: 15, color: '#1059d5', paddingLeft: 40, marginTop: 65, marginRight: 5 }}>
            Generate a new report of type:{' '}
          </Text>
          <TouchableOpacity onPress={() => generateReport("attritionReport")}>
            <Text style={{ fontSize: 15, color: '#1059d5', textDecorationLine: 'underline', marginTop: 65, marginRight: 15 }}>
              Attrition
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => generateReport("approachingMaintenanceReport")}>
            <Text style={{ fontSize: 15, color: '#1059d5', textDecorationLine: 'underline', marginTop: 65, marginRight: 15 }}>
              Approaching Maintenance
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => generateReport("refillsReport")}>
            <Text style={{ fontSize: 15, color: '#1059d5', textDecorationLine: 'underline', marginTop: 65, marginRight: 15 }}>
              Refills
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => generateReport("needsRetestReport")}>
            <Text style={{ fontSize: 15, color: '#1059d5', textDecorationLine: 'underline', marginTop: 65, marginRight: 15 }}>
              Needs Retest
            </Text>
          </TouchableOpacity>
          
        </View>

        <DataTable style={styles.table}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>Past Reports</DataTable.Title>
            <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}>Name</DataTable.Title>
            <DataTable.Title textStyle={{ fontWeight: 'bold', color: 'black', fontSize: 14 }}></DataTable.Title>
          </DataTable.Header>

          {reports.map((report, index) => (
            <DataTable.Row key={index} style={index % 2 === 0 ? styles.tableRow2 : styles.tableRow1}>
              <DataTable.Cell>
                {report.data ? (
                  <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
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
              <DataTable.Cell>{report.reportName}</DataTable.Cell>
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
