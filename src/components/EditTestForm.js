import React, { useState, useEffect } from 'react';

const EditTestForm = ({ selectedTest, onClose, onSave, onDelete }) => {
    const [tests, setTests] = useState([]);
    const [amountPaid, setAmountPaid] = useState(selectedTest?.paid || '');
    const [currentStatus, setCurrentStatus] = useState(selectedTest?.status || '');
    const [fetchingDetails, setFetchingDetails] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [errorState, setErrorState] = useState({});

    const toggleStatus = () => {
        setCurrentStatus((prev) => {
            const nextStatus = prev === "scheduled"
                ? "completed"
                : prev === "completed"
                    ? "cancelled"
                    : "scheduled";
            // console.log('Toggled status to:', nextStatus);
            return nextStatus;
        });
    };

    const fetchTest = async () => {
        // console.log('Fetching test list...');
        const tableName = "junction_table";
        const whereClause = `appointment_id = ${selectedTest?.appointment_id}`;

        try {
            const response = await fetch(
                `/api/getData?type=query&table=${encodeURIComponent(tableName)}&where=${encodeURIComponent(whereClause)}`
            );
            if (!response.ok) throw new Error('Failed to fetch tests');

            const result = await response.json();
            // console.log('Fetched tests:', result);
            setTests(result);
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
    };

    const fetchTestDetailsAndColumns = async () => {
        // console.log('Fetching test details and columns...');
        setFetchingDetails(true);

        const fetchedData = [];
        const fetchedColumns = [];

        for (const test of tests) {
            const tableName = test.test_name;
            const whereClause = `appointment_id = ${selectedTest?.appointment_id}`;

            try {
                // Fetch details
                const detailsResponse = await fetch(
                    `/api/getData?type=query&table=${encodeURIComponent(tableName)}&where=${encodeURIComponent(whereClause)}`
                );
                if (!detailsResponse.ok) throw new Error(`Failed to fetch details from ${tableName}`);

                const detailsResult = await detailsResponse.json();
                fetchedData.push({
                    test_name: tableName,
                    fields: Object.entries(detailsResult[0]).map(([key, value]) => ({ name: key, value })),
                });

                // Fetch columns
                const columnsResponse = await fetch(
                    `/api/getData?type=columns&table=${encodeURIComponent(tableName)}`
                );
                if (!columnsResponse.ok) throw new Error(`Failed to fetch columns for ${tableName}`);

                const columnsResult = await columnsResponse.json();
                fetchedColumns.push({
                    test_name: tableName,
                    columns: columnsResult,
                });
            } catch (error) {
                console.error(`Error fetching data for table ${tableName}:`, error);
            }
        }

        // console.log('Fetched form data:', fetchedData);
        // console.log('Fetched columns:', fetchedColumns);

        setFormData(fetchedData);
        setColumns(fetchedColumns);

        setFetchingDetails(false);
    };

    useEffect(() => {
        if (selectedTest) {
            // console.log('SelectedTest changed, fetching tests...');
            fetchTest();
        }
    }, [selectedTest]);

    useEffect(() => {
        if (tests.length > 0 && !fetchingDetails) {
            // console.log('Tests updated, fetching details and columns...');
            fetchTestDetailsAndColumns();
        }
    }, [tests]);

    const handleChange = (e, testIndex, fieldIndex) => {
        const { name, value } = e.target;
        // console.log('Changing field value:', { testIndex, fieldIndex, name, value });

        setFormData((prevFormData) => {
            const updatedFormData = [...prevFormData];
            updatedFormData[testIndex] = {
                ...updatedFormData[testIndex],
                fields: updatedFormData[testIndex].fields.map((field, index) =>
                    index === fieldIndex ? { ...field, value } : field
                ),
            };
            console.log('Updated formData:', updatedFormData);
            return updatedFormData;
        });

        
    };

    const handleSubmit = async () => {
        console.log('Submitting form...');

        try {
            const res = await fetch('/api/getData', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tableName: "appointment",
                    formData: { status: currentStatus },
                    primaryKey: "appointment_id",
                    primaryValue: selectedTest?.appointment_id,
                }),
            });
    
            const response = await res.json();
            if (!res.ok) {
                console.error('Error in response (appointment update):', response);
                setMessage(response.error);
                return; // Exit if the first request fails
            } else {
                console.log('Appointment table updated successfully:', response);
            }
        } catch (error) {
            console.error('Error submitting form for bill:', error);
            setMessage(`Error: ${error.message}`);
            return; // Exit if the first request fails
        }
    
        // Handle the initial PUT request for the "bill" table
        try {
            const res = await fetch('/api/getData', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tableName: "bill",
                    formData: { total_paid: amountPaid },
                    primaryKey: "appointment_id",
                    primaryValue: selectedTest?.appointment_id,
                }),
            });
    
            const response = await res.json();
            if (!res.ok) {
                console.error('Error in response (bill update):', response);
                setMessage(response.error);
                return; // Exit if the first request fails
            } else {
                console.log('Bill table updated successfully:', response);
            }
        } catch (error) {
            console.error('Error submitting form for bill:', error);
            setMessage(`Error: ${error.message}`);
            return; // Exit if the first request fails
        }
    
        // Handle PUT requests for each test
        for (const test of formData) {
            const { test_name, fields } = test;
    
            // Transform the fields array into an object
            const transformedData = fields.reduce((acc, field) => {
                const key = field.name.includes(" ") ? `\`${field.name}\`` : field.name;
                acc[key] = field.value;
                return acc;
            }, {});
            
    
            console.log("TRANSFORMED DATA:", transformedData);
    
            // Validate primary key
            if (!transformedData.ID) {
                console.error(`Missing primary key (ID) for table ${test_name}`);
                continue; // Skip this test if the primary key is missing
            }
    
            try {
                const testResponse = await fetch('/api/getData', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tableName: test_name,
                        formData: transformedData,
                        primaryKey: "ID",
                        primaryValue: transformedData.ID,
                    }),
                });
    
                const testResult = await testResponse.json();
                if (!testResponse.ok) {
                    console.error(`Error in response (test update - ${test_name}):`, testResult);
                } else {
                    console.log(`Test table (${test_name}) updated successfully:`, testResult);
                }
            } catch (error) {
                console.error(`Error updating table ${test_name}:`, error);
            }
        }

        onClose();
    };
    

    const handleSave = () => {
        console.log('Saving form...');
        handleSubmit();
    };

    const calculateAge = (dateString) => {
        const birthDate = new Date(dateString);
        const today = new Date();

        let age = today.getFullYear() - birthDate.getFullYear();
        const isBeforeBirthday =
            today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

        if (isBeforeBirthday) {
            age--;
        }

        return `${age} years old`;
    };

    console.log("FORM DATA", formData);

    return (
        <>
            <div className="popup-whitesheet" onClick={onClose}></div>
            <div className="appointment-detail-form">
                <form className="pop-up-form">
                    <h2 className="text-large-white-bold">{selectedTest.patient_name} - {new Date(selectedTest.date).toISOString().split('T')[0]}</h2>
                    <h2 className="detail-text-white"><span className='detail-text-white-bold'>Staff: </span>{selectedTest.staff_name}</h2>
                    <h2 className="detail-text-white"></h2>
                    <h2 className="detail-text-white"><span className='detail-text-white-bold'>Patient Profile</span></h2>
                    <h2 className="detail-text-white"><span className='detail-text-white-bold'>Age: </span>{calculateAge(selectedTest.patient_birthday)}</h2>
                    <h2 className="detail-text-white"><span className='detail-text-white-bold'>Sex: </span>{selectedTest.patient_sex === "M" ? "Male" : "Female"}</h2>
                    <h2 className="detail-text-white"><span className='detail-text-white-bold'>Address: </span>{selectedTest.street_name}, {selectedTest.city_name}, {selectedTest.province_name}</h2>

                    <h2 className="detail-text-white"><span className='detail-text-white-bold'>Email: </span>{selectedTest.patient_email}</h2>
                    <h2 className="detail-text-white"><span className='detail-text-white-bold'>Phone: </span>{selectedTest.patient_phone}</h2>

                    <div className="form-row">
                        <div className="form-group">
                            <h2 className="detail-text-white"><span className='detail-text-white-bold'>Total Cost: </span>{selectedTest.due}</h2>
                        </div>
                        <div className="form-group">
                            <label className="text-medium-white-bold">Total Paid: </label>
                            <input
                                type="number"
                                name="total payment"
                                value={amountPaid}
                                onChange={(e) => { setAmountPaid(e.target.value) }}
                                placeholder="Value Paid"
                                className="form-input detail-text-dark"
                            />
                            {errorState.job_name && <span className="warning-text">{errorState.job_name}</span>}
                        </div>
                    </div>

                    <div className="field-list">
                        {formData.map((test, testIndex) => {
                            const columnDetails = columns.find(col => col.test_name === test.test_name);

                            return <div key={testIndex} style={{ marginBottom: "2rem" }}>
                                <label className="text-medium-white-bold">{test.test_name}</label>

                                {test.fields
                                    .map((field, originalIndex) => ({ ...field, originalIndex }))
                                    .filter((field) => field.name.toLowerCase() !== 'id' && field.name.toLowerCase() !== 'appointment_id')
                                    .map((field, fieldIndex) => {
                                        const columnDetail = columnDetails?.columns.find(col => col.COLUMN_NAME.toLowerCase() === field.name.toLowerCase());

                                        return <div key={fieldIndex} className="form-group" style={{ marginBottom: "1rem" }}>
                                        <label className="detail-text-white">{field.name}</label>
                                        <input
                                                placeholder={`Input Data for ${field.name} ${columnDetail ? `(${columnDetail.COLUMN_TYPE})` : ''}`}
                                                type="text"
                                                name={field.name}
                                                value={field.value || ''}
                                                onChange={(e) => handleChange(e, testIndex, field.originalIndex)}
                                                className="form-input detail-text-dark"
                                            />
                                        </div>
                                })}

                            </div>
                        })}
                    </div>
                    <div className="form-row">
                        <button type="button" className="large-button-dark detail-text-light" onClick={toggleStatus}>{currentStatus.toUpperCase()}</button>
                        <button type="button" onClick={onClose} className="large-button-outline detail-text-white">
                            Cancel
                        </button>
                        <button type="button" onClick={handleSave} className="large-button-neon detail-text-dark">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default EditTestForm;
