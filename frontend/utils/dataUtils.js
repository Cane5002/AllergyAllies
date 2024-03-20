
const refillHeaders = [ {
    name: 'patientName',
    alias: 'Name'
}, {
    name: 'DOB',
    alias: 'DOB'
}, {
    name: 'email',
    alias: 'Email'
}, {
    name: 'phoneNumber',
    alias: 'Phone'
}, {
    name: 'Refills',
    alias: 'Refills'
}, {
    name: 'Expirations',
    alias: 'Expirations'
}, {
    name: 'VialInfo',
    alias: 'Next Bottle'
}];

const retestHeaders = [ {
    name: 'patientName',
    alias: 'Name'
}, {
    name: 'DOB',
    alias: 'DOB'
}, {
    name: 'email',
    alias: 'Email'
}, {
    name: 'phoneNumber',
    alias: 'Phone'
}, {
    name: 'treatmentStartDate',
    alias: 'Treatment Start'
}, {
    name: 'maintenanceDate',
    alias: 'Maintenance Date'
}, {
    name: 'dateLastTested',
    alias: 'Last Tested'
}];

const maintenanceHeaders = [ {
    name: 'patientName',
    alias: 'Name'
}, {
    name: 'DOB',
    alias: 'DOB'
}, {
    name: 'email',
    alias: 'Email'
}, {
    name: 'phoneNumber',
    alias: 'Phone'
}, {
    name: 'startDate',
    alias: 'Start Date'
}, {
    name: 'MaintenanceBottles',
    alias: 'Maintence Bottles'
}];

const attritionHeaders = [ {
    name: 'patientName',
    alias: 'Name'
}, {
    name: 'DOB',
    alias: 'DOB'
}, {
    name: 'email',
    alias: 'Email'
}, {
    name: 'phoneNumber',
    alias: 'Phone'
}, {
    name: 'statusDate',
    alias: 'Status Date'
}, {
    name: 'daysSinceLastInjection',
    alias: 'Days Since Last Injection'
}, {
    name: 'bottlesInfo',
    alias: 'Bottle Info'
}];

const getHeaders = (type) => {
    switch (type) {
    case "Refills": 
        return refillHeaders;
    case "Needs Retest":
        return retestHeaders;
    case "Approaching Maintenance":
        return maintenanceHeaders;
    case "Attrition":
        return attritionHeaders;
    }
}

// DEPRECIATED
const downloadRefill = (data, callback) => {
    let exportable = [];
    data.forEach((row) => {
        //Refill Data
        let refillData = "";
        row.refillData.forEach((d) => {
            refillData += d.bottleName + '\n';
        })
        if (refillData == "") refillData = 'N/A';
        else refillData = '\"' + refillData + '\"';

        //Expiration Data
        let expirationData = "";
        row.expirationData.forEach((d) => {
            ret += d.bottleName + ': ' + d.expirationData + '\n';
        })
        if (expirationData == "") expirationData += 'N/A';
        else expirationData = '\"' + expirationData + '\"';

        //Vial info
        let vialInfo = "";
        row.vialInfo.forEach((d) => {
            vialInfo += d.bottleName + ': ' + d.info + '\n';
        })
        if (vialInfo == "") vialInfo += 'N/A';
        else vialInfo = '\"' + vialInfo + '\"';

        exportable.push({
            Name: (row.patientName)? row.patientName : "N/A",
            DOB: (row.DOB)? row.DOB : "N/A",
            Email: (row.email)? row.email : "N/A",
            Phone: (row.phone)? row.phone : "N/A",
            Refills: refillData,
            Expirations: expirationData,
            VialInfo: vialInfo
        });
    })

    callback(refillHeaders, exportable);
}

//DEPRECIATED
const refillReportToCsv = (data) => {
    console.log("REFILL REPORT");
    console.log(data);
    let ret = '';
    // headers
    let headers = [ 'Name', 'DOB', 'Email', 'Phone', 'Refills', 'Expirations', 'Vials' ];
    ret += headers.join(',') + '\n';
    // data
    data.forEach((row) => {
        ret += row.patientName + ',';
        ret += row.DOB + ',';
        ret += row.email + ',';
        ret += row.phone + ',';
        ret += '\"';
        let refillData = false;
        row.refillData.forEach((d) => {
            ret += d.bottleName + '\n';
            refillData = true;
        })
        if (!refillData) ret += 'N/A';
        ret += '\",';
        ret += '\"';
        let expirationData = false;
        row.expirationData.forEach((d) => {
            ret += d.bottleName + ': ' + d.expirationDate + '\n';
            expirationData = true;
        })
        if (!expirationData) ret += 'N/A';
        ret += '\",';
        ret += '\"';
        row.vialInfo.forEach((d) => {
            ret += d.bottleName + ': ' + d.info + '\n';
        })
        ret += '\"';
        ret += '\n';
    })

    return ret;
}

// DEPRECIATED
//json formatted report to csv
const reportToCsv = (report) => {
    let csv = '';
    // Title
    csv += report.type + ' Report,' + report.dateGenerated + '\n';
    // data
    switch(report.type) {
        case 'Attrition':
            csv += attritionReportToCsv(report.data.data);
            break;
        case 'ApproachingMaintenance':
            csv += maintenanceReportToCsv(report.data.data);
            break;
        case 'Refills':
            csv += refillReportToCsv(report.data.data);
            break;
        case 'NeedsRetest':
            csv += retestReportToCsv(report.data.data);
            break;
        default:
            console.log("Unsupported Report Type");
            csv += "Unsupported Report Type\n"
    }

    return csv;
}

export { getHeaders };