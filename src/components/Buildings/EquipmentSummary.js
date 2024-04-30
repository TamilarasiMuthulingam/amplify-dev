import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { getAllRecords2, getAllRecords3 } from "../../graphql/queries";

const client = generateClient();

function EquipmentSummary(BuildingData) {
    console.log('EquipmentName from summary', BuildingData?.location?.EquipmentName);
    let gSelectedEquipment = BuildingData?.location?.EquipmentName;
    const [Equipment, setEquipment] = useState([]);
    const [EquipmentProperties, setEquipmentProperties] = useState([]);
    const [Points, setPoints] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if(gSelectedEquipment !== undefined){
                try {
                    const result1 = await client.graphql({ query: getAllRecords2 });
                    const result2 = await client.graphql({ query: getAllRecords3 });
                    let lSelectedEquipment = result1?.data?.getAllRecords2?.filter((obj) => fetchSiteFamilyEquip(obj.ObjectMap) === gSelectedEquipment);
                    let lSelectedEquipmentPoints = result2?.data?.getAllRecords3?.filter((obj) => fetchSiteFamilyEquip(obj.PointMap) === gSelectedEquipment);
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
        let lName = Name.split('#')
        return lName[0] + "#" + lName[1] + "#" + lName[2];
    }

    const GetPointValueForProperty = (property) => {
        let lObject = fetchSiteFamilyEquip(Equipment?.ObjectMap) + "#" + property;
        let Propertylst = Points?.filter((ele) => ele.PointMap === lObject);
        if (Propertylst?.length > 0) {
            Propertylst.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));
            return Propertylst[0]?.Value;
        }
    }

    return (
        <>
            <div className="content-pane"><h4>Equipment Summary</h4></div>
            <table className="tblequipment" style={{"width":"50%", "margin-left":"310px"}} cellSpacing="0" cellPadding="0">
                <thead>
                    <th>Keyname</th>
                    <th>Current Value</th>
                </thead>
                <tbody className="cell_container">
                    {
                        EquipmentProperties?.map((obj, index) => (
                            <tr key={index}>
                                <td>{obj.keyname}</td>
                                <td>{GetPointValueForProperty(obj.keyname)}</td>
                            </tr>

                        ))
                    }
                </tbody>
            </table>
        </>
    )
}
export default EquipmentSummary;