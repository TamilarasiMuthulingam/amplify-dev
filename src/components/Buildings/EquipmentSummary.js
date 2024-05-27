import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { getAllEquipmentSummary, latestTimeStamp } from "../../graphql/queries";
import { useHistory } from 'react-router-dom';
import EnumData from "./EnumFile";
 
const client = generateClient();
 
function EquipmentSummary(BuildingData) {
    console.log('EquipmentName from summary', BuildingData?.location?.EquipmentName);
    let gSelectedEquipment = BuildingData?.location?.EquipmentName;
    const [Equipment, setEquipment] = useState([]);
    const [EquipmentProperties, setEquipmentProperties] = useState([]);
    const [Points, setPoints] = useState([]);
    const history = useHistory();
 
    useEffect(() => {
        const fetchData = async () => {
            if (gSelectedEquipment !== undefined) {
                try {
                    let serialNumber = gSelectedEquipment;
                    const result1 = await client.graphql({ query:getAllEquipmentSummary,variables: { serialNumber } });
                    const result2 = await client.graphql({ query: latestTimeStamp, variables: { serialNumber } });
 
                    let lSelectedEquipment = result1.data.getAllEquipmentSummary.items;
                    console.log("hii")

                    let lSelectedEquipmentPoints = result2.data.getAllRecords4.LatestTimestamp.items;
 
                    let lFormattedProperties = lSelectedEquipment[0]?.Points && JSON.parse(lSelectedEquipment[0]?.Points?.replace(/'/g, '"'));
                    setEquipment(lSelectedEquipment[0]);
                    setEquipmentProperties(lFormattedProperties);
                    setPoints(lSelectedEquipmentPoints);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchData();
    }, [gSelectedEquipment]);
 
    const fetchSiteFamilyEquip = (Name) => {
        let lName = Name.split('#');
        return lName[0] + "#" + lName[1] + "#" + lName[2];
    };
 
    const GetPointValueForProperty = (property) => {
        let lObject = fetchSiteFamilyEquip(Equipment?.ObjectMap) + "#" + property;
        let Propertylst = Points?.filter((ele) => ele.PointMap === lObject);
 
        if (Propertylst?.length > 0) {
            let value = Propertylst[0]?.Value;
            if (value !== undefined) {
                if (property.includes("heatCoolMode")) {
                   
                    return EnumData.HeatCoolMode("Mode." + value + ".Text");
                    
                } else if (property.includes("occupancyStatus")) {
                    return EnumData.PresentValue("PresentValue." + value + ".Text");
                }
                else if(property.includes("HeatCoolModeStatus")){
                    return EnumData.HeatCoolMode("Mode." + value + ".Text");
                }
                // console.log("value",EnumData.PresentValue("PresentValue." + value + ".Text"))
                // console.log("hi",EnumData.HeatCoolMode("Mode." + value + ".Text"))
                return parseFloat(value).toFixed(2);
            }
        }
        return "---";
    };
 
    const RedirectToChart = (keyname) => {
        history.push({ pathname: "/ChartData", keyname: keyname });
    };
 
    return (
        <>
            <div className="content-pane">
                <h4>Equipment Summary</h4>
            </div>
            <table className="tblequipment" style={{ width: "50%", marginLeft: "310px" }} cellSpacing="0" cellPadding="0">
                <thead>
                    <tr>
                        <th>Keyname</th>
                        <th>Current Value</th>
                    </tr>
                </thead>
                <tbody className="cell_container">
                    {EquipmentProperties?.map((obj, index) => (
                        <tr key={index}>
                            <td style={{ cursor: "pointer" }} onClick={() => RedirectToChart(obj.keyname)}>{obj.keyname}</td>
                            <td>{GetPointValueForProperty(obj.keyname)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
 
export default EquipmentSummary;
