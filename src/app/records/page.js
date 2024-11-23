'use client';

import { useState, useEffect } from 'react';
import LineGraph from '@/components/LineGraph';
import PieChart from '@/components/PieGraph';
import BarChart from '@/components/BarGraph';

/**
 * Records Component
 *
 * Fetches and displays various statistics using SQL data.
 */
export default function Records() {
    // State for each graph's data
    const [appointmentsOverTime, setAppointmentsOverTime] = useState([]);
    const [revenueTrends, setRevenueTrends] = useState([]);
    const [testDistribution, setTestDistribution] = useState([]);
    const [revenueByStaff, setRevenueByStaff] = useState([]);

    // States for filtering
    const [viewChoice, setViewChoice] = useState(''); // Filter by status

    // State for the where clauses
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // Dynamic where clause generation
    const where =
        (statusFilter ? statusFilter : '') +
        (statusFilter && dateFilter ? ' AND ' : '') +
        (dateFilter ? dateFilter : '');

    // Fetch appointments over time
    const fetchAppointmentsOverTime = async () => {
        const tableName = "appointment";
        const columns = "DATE_FORMAT(appointment_date, '%Y-%m-%d') AS day, COUNT(*) AS total_appointments";
        const groupBy = "day";
        const orderBy = "day";

        try {
            const response = await fetch(
                `/api/getData?type=query&table=${tableName}&columns=${columns}&where=${where}&groupBy=${groupBy}&orderBy=${orderBy}`
            );
            if (!response.ok) throw new Error('Failed to fetch appointments over time');

            const result = await response.json();
            setAppointmentsOverTime(result);
        } catch (error) {
            console.error('Error fetching appointments over time:', error);
        }
    };

    // Fetch revenue trends by status
    const fetchRevenueTrends = async () => {
        const tableName = "appointment";
        const joins = JSON.stringify([{type: "INNER", table: "bill", on:"appointment.appointment_id = bill.appointment_id"}]);
        const columns = "DATE_FORMAT(appointment_date, '%Y-%m-%d') AS day, FLOOR(SUM(total_paid)) AS total_revenue";
        const groupBy = "day";
        const orderBy = "day";

        try {
            const response = await fetch(
                `/api/getData?type=query&table=${tableName}&columns=${columns}&where=${where}&groupBy=${groupBy}&orderBy=${orderBy}&joins=${joins}`
            );
            if (!response.ok) throw new Error('Failed to fetch revenue trends');

            const result = await response.json();
            setRevenueTrends(result);
        } catch (error) {
            console.error('Error fetching revenue trends:', error);
        }
    };

    // Fetch test type distribution
    const fetchTestDistribution = async () => {
        const tableName = "junction_table";
        const joins = JSON.stringify([
            { type: "INNER", table: "appointment", on: "junction_table.appointment_id = appointment.appointment_id",  },
            { type: "INNER", table: "bill", on: "appointment.appointment_id = bill.appointment_id",  }
        ]);
        const columns = "test_name, SUM(bill.total_bill) AS total_revenue";
        const groupBy = "test_name";
        const orderBy = "total_revenue DESC";

        try {
            const response = await fetch(
                `/api/getData?type=query&table=${tableName}&columns=${columns}&where=${where}&groupBy=${groupBy}&orderBy=${orderBy}&joins=${joins}`
            );
            if (!response.ok) throw new Error('Failed to fetch test type distribution');

            const result = await response.json();
            setTestDistribution(result);
        } catch (error) {
            console.error('Error fetching test distribution:', error);
        }
    };

    // Fetch revenue by staff
    const fetchRevenueByStaff = async () => {
        const tableName = "staff";
        const joins = JSON.stringify([
            { type: "INNER", table: "person", on: "staff.person_id = person.person_id" },
            { type: "INNER", table: "appointment", on: "staff.person_id = appointment.staff_id",  },
            { type: "INNER", table: "bill", on: "appointment.appointment_id = bill.appointment_id",  }
        ]);
        const columns = "CONCAT(person.first_name, ' ', person.last_name) AS staff_name, SUM(bill.total_paid) AS total_revenue";
        const groupBy = "staff_name";
        const orderBy = "total_revenue DESC";

        try {
            const response = await fetch(
                `/api/getData?type=query&table=${tableName}&columns=${columns}&where=${where}&groupBy=${groupBy}&orderBy=${orderBy}&joins=${joins}`
            );
            if (!response.ok) throw new Error('Failed to fetch revenue by staff');

            const result = await response.json();
            setRevenueByStaff(result);
        } catch (error) {
            console.error('Error fetching revenue by staff:', error);
        }
    };

    // Fetch all data on component mount
    useEffect(() => {
        fetchAppointmentsOverTime();
        fetchRevenueTrends();
        fetchTestDistribution();
        fetchRevenueByStaff();
    }, [statusFilter, dateFilter]);

    return (
        <div className="report-page background">
            <div className="records-menu">
                {/* Navigation for filtering by status */}
                <div className="view-nav">
                    <div className="view-choices view-choice-name">
                        <button
                            className="text-medium-white view-choice-name"
                            style={{ fontWeight: viewChoice === 'scheduled' ? '600' : '400' }}
                            onClick={() => {
                                if (viewChoice !== 'scheduled') {
                                    setViewChoice('scheduled');
                                    setStatusFilter("appointment.status = 'Scheduled'");
                                    return;
                                }
                                setViewChoice("");
                                setStatusFilter("");
                            }}
                        >
                            SCHEDULED
                        </button>
                        <div className="view-divider"></div>
                        <button
                            className="text-medium-white view-choice-name"
                            style={{ fontWeight: viewChoice === 'completed' ? '600' : '400' }}
                            onClick={() => {
                                if (viewChoice !== 'completed') {
                                    setViewChoice('completed');
                                    setStatusFilter("appointment.status = 'Completed'");
                                    return;
                                }
                                setViewChoice("");
                                setStatusFilter("");
                            }}
                        >
                            COMPLETED
                        </button>
                        <div className="view-divider"></div>
                        <button
                            className="text-medium-white view-choice-name"
                            style={{ fontWeight: viewChoice === 'cancelled' ? '600' : '400' }}
                            onClick={() => {
                                if (viewChoice !== 'cancelled') {
                                    setViewChoice('cancelled');
                                    setStatusFilter("appointment.status = 'Cancelled'");
                                    return;
                                }
                                setViewChoice("");
                                setStatusFilter("");
                            }}
                        >
                            CANCELLED
                        </button>
                    </div>

                    {/* Sorting options */}
                    <div className="view-sort-by">
                        <div className="view-order">
                            <h3 className="text-medium-white-bold" style={{ marginRight: "auto", fontSize: '1.5rem' }}>
                                FILTER BY DATE
                            </h3>
                        </div>

                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="dropdown-item-2 detail-text-dark"
                        >
                            <option value=''>None</option>
                            <option value="DATEDIFF(NOW(), appointment.appointment_date) <= 7">Last Week</option>
                            <option value="DATEDIFF(NOW(), appointment.appointment_date) <= 30">Last Month</option>
                            <option value="DATEDIFF(NOW(), appointment.appointment_date) <= 365">Last Year</option>
                        </select>
                    </div>
                </div>

                {/* Graphs Section */}
                <div className="graph-collection">
                    {/* Line Graph - Appointments Over Time */}
                    <div className="line-graph">
                        <LineGraph
                            xaxis={appointmentsOverTime.map((item) => item.day)}
                            yaxis={appointmentsOverTime.map((item) => item.total_appointments)}
                            chart_label="Appointments Over Time"
                            xscale="time"
                            yscale="appointments"
                        />
                    </div>

                    {/* Line Graph - Revenue Trends Over Time */}
                    <div className="line-graph">
                        <LineGraph
                            xaxis={revenueTrends.map((item) => item.day)}
                            yaxis={revenueTrends.map((item) => item.total_revenue)}
                            chart_label="Revenue Trends Over Time"
                            xscale="time"
                            yscale="revenue"
                        />
                    </div>

                    {/* Pie Chart - Distribution of Test Types */}
                    <div className="pie-graph">
                        <PieChart
                            labels={testDistribution.map((item) => item.test_name)}
                            data={testDistribution.map((item) => item.total_revenue)}
                            chart_label="Test Type Distribution"
                        />
                    </div>

                    {/* Bar Chart - Revenue by Staff */}
                    <div className="line-graph">
                        <BarChart
                            labels={revenueByStaff.map((item) => item.staff_name)}
                            data={revenueByStaff.map((item) => item.total_revenue)}
                            chart_label="Revenue by Staff"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
