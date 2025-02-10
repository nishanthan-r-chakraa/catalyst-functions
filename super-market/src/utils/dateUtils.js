// src/utils/dateUtils.js
import moment from 'moment';

export const formatDateDisplay = (dateString) => {
    if (!dateString) return '-';
    try {
        return moment(dateString, 'MM-DD-YYYY').format('DD/MM/YYYY');
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateString;
    }
};

export const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
        const formattedDate = moment(dateString, 'MM-DD-YYYY').format('YYYY-MM-DD');
        console.log(formattedDate);
        return formattedDate;
    } catch (error) {
        console.error('Error formatting date for input:', error);
        return '';
    }
};

export const formatDateForApi = (dateString) => {
    if (!dateString) return '';
    try {
        console.log(dateString);    
        // Convert from ISO format (YYYY-MM-DD) to API format (MM-DD-YYYY)
        return moment(dateString, 'YYYY-MM-DD').format('YYYY-MM-DD');
    } catch (error) {
        console.error('Error formatting date for API:', error);
        return dateString;
    }
};