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
    csv += report.type + ',' + report.dateGenerated + '\n';
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

export { reportToCsv };