// routes/report.js
const express = require('express');
const mongoose = require('mongoose');
const Device = require('../models/Device');
const MalfunctionReport = require('../models/MalfunctionReport');
const WasteRecord = require('../models/WasteRecord');
const PDFDocument = require('pdfkit');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const router = express.Router();

// Helper function to generate PDF report
const generatePDF = (data, malfunctionData, deviceData) => {
    const doc = new PDFDocument();
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));

    return new Promise((resolve) => {
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        doc.fontSize(25).text('Device Information', { align: 'center' });
        doc.moveDown();

        // Device Data section
        if (deviceData.length === 0) {
            doc.fontSize(12).text('No device data available.');
        } else {
            deviceData.forEach(item => {
                doc.fontSize(12).text(`Device ID: ${item.deviceId}`);
                doc.text(`Device Type: ${item.deviceType}`);
                doc.text(`Status: ${item.status}`);
                doc.text(`Capacity: ${item.capacity}`);
                doc.text(`Space Left: ${item.spaceLeft}`);
                doc.text(`Last Updated: ${item.lastUpdated}`);
                doc.moveDown();
            });
        }

        doc.addPage(); // New page for Malfunction Reports

        doc.fontSize(25).text('Malfunction Reports', { align: 'center' });
        doc.moveDown();

        // Malfunction Reports section
        if (malfunctionData.length === 0) {
            doc.fontSize(12).text('No malfunction reports available.');
        } else {
            malfunctionData.forEach(item => {
                doc.fontSize(12).text(`Device ID: ${item.deviceId}`);
                doc.text(`Message: ${item.message}`);
                doc.text(`Date Reported: ${item.dateReported}`);
                doc.text(`User ID: ${item.userId}`);
                doc.text(`Reply: ${item.reply}`);
                doc.moveDown();
            });
        }
        doc.addPage(); // New page for Device Data


        doc.fontSize(25).text('Waste Management Report', { align: 'center' });
        doc.moveDown();

        // Waste Records section
        if (data.length === 0) {
            doc.fontSize(12).text('No waste data available for the selected criteria.');
        } else {
            data.forEach(item => {
                doc.fontSize(12).text(`Device ID: ${item.deviceId}`);
                doc.text(`Device Type: ${item.deviceType}`);
                doc.text(`Weight: ${item.weight}`);
                doc.text(`Status: ${item.status}`);
                doc.text(`Date: ${item.date}`);
                doc.moveDown();
            });
        }


        doc.end();  // End the PDF document
    });
};

// Route to generate report
router.post('/generate', async (req, res) => {
    const { startDate, endDate, deviceType, reportFormat } = req.body;

    try {
        // Fetch Waste Records based on the provided criteria
        const wasteRecords = await WasteRecord.find({
            date: { $gte: new Date(startDate), $lte: new Date(endDate) },
            ...(deviceType !== 'All' && { deviceType }) // Filter by deviceType if not 'All'
        }).populate('deviceId'); // Populating deviceId to get device details

        const reportData = wasteRecords.map(record => ({
            deviceId: record.deviceId,
            deviceType: record.deviceType,
            weight: record.weight,
            status: record.status,
            date: record.date.toISOString().split('T')[0], // Format date
        }));

        // Fetch Malfunction Reports in the date range
        const malfunctionReports = await MalfunctionReport.find({
            dateReported: { $gte: new Date(startDate), $lte: new Date(endDate) }
        });

        const malfunctionData = malfunctionReports.map(report => ({
            deviceId: report.deviceId,
            message: report.message,
            dateReported: report.dateReported.toISOString().split('T')[0],
            userId: report.userId,
            reply: report.reply || 'No reply',
        }));

        // Fetch all devices (or filter by device type if provided)
        const deviceCriteria = deviceType !== 'All' ? { deviceType } : {};
        const devices = await Device.find(deviceCriteria);

        const deviceData = devices.map(device => ({
            deviceId: device.deviceId,
            deviceType: device.deviceType,
            status: device.status,
            capacity: device.capacity,
            spaceLeft: device.spaceLeft,
            lastUpdated: device.lastUpdated.toISOString().split('T')[0],
        }));

        // console.log('Waste Records:', reportData);
        // console.log('Malfunction Reports:', malfunctionData);
        // console.log('Device Data:', deviceData);

        if (reportFormat === 'PDF') {
            const pdfData = await generatePDF(reportData, malfunctionData, deviceData);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment; filename=report.pdf',
            });
            res.end(pdfData);
        } else if (reportFormat === 'CSV') {
            const csvWriter = createCsvWriter({
                path: 'report.csv',
                header: [
                    { id: 'deviceId', title: 'Device ID' },
                    { id: 'deviceType', title: 'Device Type' },
                    { id: 'weight', title: 'Weight' },
                    { id: 'status', title: 'Status' },
                    { id: 'date', title: 'Date' },
                ],
            });

            await csvWriter.writeRecords(reportData);
            res.download('report.csv', 'report.csv');
        } else {
            res.status(400).send('Invalid report format.');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error generating report.');
    }
});

module.exports = router;
