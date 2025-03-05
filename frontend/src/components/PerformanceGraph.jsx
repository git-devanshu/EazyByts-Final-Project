import { Heading, Text } from "@chakra-ui/react";
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function PerformanceGraph({ data }) {
    const chartStyles = {
        padding: "10px 15px 5px 0",
        borderRadius: "10px",
        color: "white",
        textAlign: "center",
        border: "1px solid #d7d7d7",
        marginTop: "15px",
    };

    const customTooltipStyles = {
        backgroundColor: "#212738",
        padding: "5px",
        borderRadius: "5px",
        color: "white",
        border: "1px solid #d7d7d7",
    };

    if (!data || data.length === 0) {
        return (
            <div style={chartStyles}>
                <Text>No events added</Text>
            </div>
        );
    }

    // Transform data: Calculate total revenue for each event
    const chartData = data.map(event => ({
        eventName: event.eventName, // X-axis
        totalRevenue: event.bookings.reduce((sum, booking) => sum + booking.totalCost, 0), // Y-axis
    }));

    return (
        <div style={chartStyles}>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#d7d7d7", marginBottom: '15px' }}>Event-wise Revenue</p>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                    <XAxis dataKey="eventName" stroke="white" tick={false} />
                    <YAxis stroke="white" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={customTooltipStyles} />
                    <Line type="monotone" dataKey="totalRevenue" stroke="#3CB5FB" name="Total Revenue" strokeWidth={3} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
