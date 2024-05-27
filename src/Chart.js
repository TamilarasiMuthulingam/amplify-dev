import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { generateClient } from "aws-amplify/api";
import { getMonthRecords, getTodayRecords, getCustomRange } from "./graphql/queries";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
 
const client = generateClient();
 
const LineChart = ({location}) => {
    const [pointData, setPointData] = useState(null);
    const [selectedOption, setSelectedOption] = useState('today');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedPoint, setSelectedPoint] = useState(null);
 
    useEffect(() => {
        fetchData();
    }, [selectedOption, startDate, endDate]);
 
    useEffect(() => {
      if (location.keyname) {
          setSelectedPoint(location.keyname);
      }
  }, [location.keyname]);

    const fetchData = async () => {
        try {
            let result;
      
            if (selectedOption === 'today') {
                result = await client.graphql({ query: getTodayRecords});
                setPointData(result.data.getAllRecords4.todayRecords.items);
            } else if (selectedOption === 'thisMonth') {
                result = await client.graphql({ query: getMonthRecords  });
                setPointData(result.data.getAllRecords4.thisMonthRecords.items);
            } else {
                result = await client.graphql({ query: getCustomRange, variables: { startDate, endDate } });
                setPointData(result.data.getAllRecords4.CustomRange.items);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

 
    const handleOptionChange = (option) => {
        setSelectedOption(option);
    };
 
    const handleStartDateChange = (date) => {
        setStartDate(date);
    };
 
    const handleEndDateChange = (date) => {
        setEndDate(date);
    };
 
    const parseObject = () => {
        const groupedData = {};
        pointData?.forEach(pData => {
            const parts = pData.PointMap.split('#');
            const name = parts[3];
            const equipmentType = parts[1];
            const serialNumber=parts[0];
            if (!groupedData[name]) {
                groupedData[name] = [];
            }
            groupedData[name].push({ ...pData, equipmentType ,serialNumber});
        });
        return groupedData;
    };
 
    const formatChartData = () => {
        const groupedData = parseObject();
        const charts = [];
 
        if (selectedPoint && groupedData[selectedPoint]) {
            const filteredData = groupedData[selectedPoint];
            const categories = filteredData.map(point => point.Timestamp);
            const data = filteredData.map(point =>parseFloat( point.Value));
            console.log("data",data)
            const equipmentType = filteredData[0].equipmentType;
            const serialNumber=filteredData[0].serialNumber;
            const chartOptions = {
                chart: { type: 'line' },
                title: { text: `Chart for  ${equipmentType} - ${selectedPoint}` },
                xAxis: { categories: categories },
                series: [{ name: 'Value', data: data }]
            };
            charts.push(chartOptions);
        }
        return charts;
    };
 
    const options = formatChartData();
 
    return (
        <div className="content-pane">
            <h1> Highcharts </h1>
            <div>
                <select value={selectedOption} onChange={(e) => handleOptionChange(e.target.value)}>
                    <option value="today">Today</option>
                    <option value="thisMonth">This Month</option>
                    <option value="custom">Custom Range</option>
                </select>
                {selectedOption === 'custom' && (
                    <div>
                        <DatePicker selected={startDate} onChange={handleStartDateChange} />
                        <DatePicker selected={endDate} onChange={handleEndDateChange} />
                    </div>
                )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {options.length > 0 ? (
                    options.map((chartOptions, index) => (
                        <div key={index} style={{ marginBottom: "20px" }}>
                            <h2>{chartOptions.title.text}</h2>
                            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                        </div>
                    ))
                ) : (
                    <p  className='Text'>There is no data to display the chart.</p>
                )}
            </div>
        </div>
    );
};
 
export default LineChart;
