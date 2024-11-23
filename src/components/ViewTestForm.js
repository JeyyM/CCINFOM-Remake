import React, { useState, useEffect } from 'react';

const ViewTestForm = ({ selectedTest, onClose }) => {
    const [formData, setFormData] = useState({
        testName: selectedTest?.testName || '',
        fields: selectedTest?.fields || [], // Array of field objects: [{ name: '', value: '' }]
    });

    useEffect(() => {
        setFormData({
            testName: selectedTest?.testName || '',
            fields: selectedTest?.fields || [],
        });
    }, [selectedTest]);

    return (
        <>
            <div className="popup-whitesheet" onClick={onClose}></div>
            <div className="test-field-view-popup">
                <form className="pop-up-form">
                    <h2 className="text-large-white-bold">View Test Fields</h2>
                    <div className="form-group">
                        <label className="text-medium-white-bold">Test Name</label>
                        <input
                            type="text"
                            name="testName"
                            value={formData.testName}
                            readOnly
                            className="form-input detail-text-dark"
                        />
                    </div>

                    <div className="field-list">
                        {formData.fields.map((field, index) => (
                            <div key={index} className="form-row">
                                <div className="form-group">
                                    <label className="text-medium-white-bold">Field Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={field.name}
                                        readOnly
                                        className="form-input detail-text-dark"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="text-medium-white-bold">Field Value</label>
                                    <input
                                        type="text"
                                        name="value"
                                        value={field.value}
                                        readOnly
                                        className="form-input detail-text-dark"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="button-group">
                        <button type="button" onClick={onClose} className="okay-button">
                            OKAY
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ViewTestForm;
