
const refillHeaders = [ {
    name: 'Name',
    alias: 'Name'
}, {
    name: 'DOB',
    alias: 'DOB'
}, {
    name: 'Email',
    alias: 'Email'
}, {
    name: 'Phone',
    alias: 'Phone'
}, {
    name: 'Refills',
    alias: 'Refills'
}, {
    name: 'Expirations',
    alias: 'Expirations'
}, {
    name: 'Vials',
    alias: 'Vials'
}];

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
        let vialInfo = '\"';
        row.vialInfo.forEach((d) => {
            vialInfo += d.bottleName + ': ' + d.info + '\n';
        })
        vialInfo += '\"';

        exportable.push({
            Name: row.patientName,
            DOB: row.DOB,
            Email: row.email,
            Phone: row.phone,
            Refills: refillData,
            Expirations: expirationData,
            Vials: vialInfo
        });
    })

    callback(refillHeaders, exportable);
}

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

export { reportToCsv, downloadRefill };