import axios from 'axios';

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
       year: 'numeric',
       month: '2-digit',
       day: '2-digit'
    });
}

const alertMessage = (alertType, patientName) => {
    let message = `${patientName}`;
    switch (alertType) {
      case "AttritionAlert":
         message += " is at risk of attrition";
         break;
      case "NeedsRetestAlert":
         message += " needs retesting";
         break;
      case "MaintenanceAlert":
         message += " has reached maintenance";
         break;
      case "ReactionAlert":
         message += " has reported a reaction";
         break;
      case "NeedsRefillAlert":
         message += " needs refill(s)";
         break;
      /*
      case "NeedsMixAlert":
         message += "'s injection(s) will soon need to be mixed";
         break;
      case "ExpiresSoonAlert":
         message += `'s injection(s) expiring soon`
         break;
      */
    }
    return message;
}
 
const fetchRecentAlerts = async (providerID) => {
    try {
        const alertsResponse = await axios.get(`http://localhost:5000/api/getAlerts/${providerID}`)
        return alertsResponse.data;
    } catch (error) {
       console.error('Error getting alerts: ', error);
       return [];
    }
}

export { formatDate, alertMessage, fetchRecentAlerts };