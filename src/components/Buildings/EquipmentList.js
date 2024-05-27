import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { getAllEquipmentList,  AllEquipmentList } from "../../graphql/queries"; // Import the  query
import EnumData from "./EnumFile";
 
const client = generateClient();
const headerMapping = {
  area: ["Name", "InsideTemperature", "ActiveSetpoint", "HeatCoolMode", "PresentValue"],
  space: ["Name", "ActiveSetPoint", "EquipmentType", "HeatCoolMode", "SpaceTemperatureActive"],
  chiller: ["Name", "EnteringWaterTemperature", "LeavingWaterTemperature", "RunningMode"],
  airhandler: ["Name", "DuctStaticPressure", "DuctStaticPressureSetpoint", "DischargeAirTemperature", "DischargeAirTemperatureSetpoint"],
  vas: ["Name", "Occupancy", "OperatingMode"],
  cpc: ["Name", "ChilledWaterSetpoint", "ReturnWaterTemperature", "SupplyWaterTemperature", "FlowStatus", "BypassFlow"]
}

function EquipmentList(BuildingData) {
  console.log('sSerialNumber', BuildingData?.location?.SerialNumber + BuildingData?.location?.FamilyType);
  let lSelectedFamilyType = BuildingData?.location?.FamilyType;
  const [Equipments, setEquipments] = useState([]);
 let latestTimestamp;
  useEffect(() => {
    fetchEquipmentList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [BuildingData?.location?.FamilyType]);
 console.log("data", BuildingData?.location?.FamilyType)
  const fetchEquipmentList = async () => {
    try {
      let lSerialNumber = BuildingData?.location?.SerialNumber;
      
      let lFamilyType = BuildingData?.location?.FamilyType;
      
 let serialNumber=lSerialNumber;
  let FamilyType=lFamilyType;
 const timestampResult = await client.graphql({ query: AllEquipmentList,variables: { serialNumber,FamilyType } });
 latestTimestamp = timestampResult.data.getAllRecords4.AllEquipmentList.items;
console.log("EquipmentData",latestTimestamp)

      const Objresult = await client.graphql({
        query:getAllEquipmentList,
        variables: { serialNumber,FamilyType}
      });
      let ObjectsNameLst = Objresult.data.getAllEquipmentList.items;
      console.log("objectData",ObjectsNameLst)
   
 

      FormtblRows(ObjectsNameLst,latestTimestamp,  lFamilyType, );
    } catch (error) {
      console.error("Error fetching site data:", error);
    }
  };

    const FormtblRows = (ObjectsNameLst,latestTimestamp , lFamilyType) => {
        let lFileredData = ObjectsNameLst.filter((obj) => ParseObjectMap(obj.ObjectMap, 1) === lFamilyType);
        let lFilteredData1 = latestTimestamp.filter((obj) => ParseObjectMap(obj.PointMap, 1) === lFamilyType);
        const groupedByObjectName = Map.groupBy(lFilteredData1, (obj) => ParseObjectMap(obj.PointMap, 2));
        let lNewLst = [];
        groupedByObjectName.forEach(Obj => {
            if (Obj?.length) {
                switch (lFamilyType) {
                    
                    case 'area':
                        lNewLst.push({
                            "Name": ParseObjectMap(Obj[0].PointMap, 2),
                            "InsideTemperature": GetPointValueForProperty(Obj, "spaceSetpoint") + " °F",
                            "ActiveSetpoint": GetPointValueForProperty(Obj, "activeSetpoint") + " °F",
                            "HeatCoolMode": EnumData.HeatCoolMode("Mode." + GetPointValueForProperty1(Obj, "heatCoolModeStatus") + ".Text"),
                            "PresentValue": EnumData.PresentValue("PresentValue." + GetPointValueForProperty1(Obj, "occupancyStatus") + ".Text")
                            
                        })
                        break;
                    
                    case 'space':
                        let lEquipmentType = lFileredData.filter(el => ParseObjectMap(el.ObjectMap, 2) === ParseObjectMap(Obj[0].PointMap, 2));
                        lNewLst.push({
                            "Name": ParseObjectMap(Obj[0].PointMap, 2),
                            "ActiveSetPoint": GetPointValueForProperty(Obj, "activeSetpoint") + " °F",
                            "EquipmentType": lEquipmentType[0] !== undefined ? ParseObjectMap(lEquipmentType[0].ObjectMap, 3) : "",
                            "HeatCoolMode": EnumData.HeatCoolMode("Mode." + GetPointValueForProperty1(Obj, "HeatCoolModeStatus") + ".Text"),
                            "SpaceTemperatureActive": GetPointValueForProperty(Obj, "SpaceTempSetpointActive") + " °F"
                        })
                        break;
                    case 'chiller':
                        lNewLst.push({
                            "Name": ParseObjectMap(Obj[0].PointMap, 2),
                            "EnteringWaterTemperature": GetPointValueForProperty(Obj, "ActiveSetPoint") + " °F",
                            "LeavingWaterTemperature": GetPointValueForProperty(Obj, "EquipmentType") + " °F",
                            "RunningMode": GetPointValueForProperty(Obj, "HeatCoolMode")
                        })
                        break;
                    case 'airhandler':
                        lNewLst.push({
                            "Name": ParseObjectMap(Obj[0].PointMap, 2),
                            "DuctStaticPressure": GetPointValueForProperty(Obj, "DuctStaticPressure") + " in(H₂O)",
                            "DuctStaticPressureSetpoint": GetPointValueForProperty(Obj, "DuctStaticPressureSetpoint") + " in(H₂O)",
                            "DischargeAirTemperature": GetPointValueForProperty(Obj, "DischargeAirTemperature") + " °F",
                            "DischargeAirTemperatureSetpoint": GetPointValueForProperty(Obj, "DischargeAirTemperatureSetpoint") + " °F"
                        })
                        break;
                    case 'vas':
                        lNewLst.push({
                            "Name": ParseObjectMap(Obj[0].PointMap, 2),
                            "Occupancy": GetPointValueForProperty(Obj, "Occupancy"),
                            "OperatingMode": GetPointValueForProperty(Obj, "OperatingMode")
                        })
                        break;
                    case 'cpc':
                        lNewLst.push({
                            "Name": ParseObjectMap(Obj[0].PointMap, 2),
                            "ChilledWaterSetpoint": GetPointValueForProperty(Obj, "ChilledWaterSetpoint") + " °F",
                            "ReturnWaterTemperature": GetPointValueForProperty(Obj, "ReturnWaterTemperature") + " °F",
                            "SupplyWaterTemperature": GetPointValueForProperty(Obj, "SupplyWaterTemperature") + " °F",
                            "FlowStatus": GetPointValueForProperty(Obj, "FlowStatus"),
                            "BypassFlow": GetPointValueForProperty(Obj, "BypassFlow")
                        })
                        break;
                    default:
                        return "";
                }
            }
        });
       
        lFileredData.forEach(Obj => {
            let lName = ParseObjectMap(Obj.ObjectMap, 2);
            let IsExists = lNewLst.filter((item) => item.Name === lName);
            if (IsExists !== undefined && IsExists !== null && IsExists.length < 1) {
                switch (lFamilyType) {
                    case 'area':
                        lNewLst.push({
                            "Name": lName,
                            "InsideTemperature": "---",
                            "ActiveSetpoint": "---",
                            "HeatCoolMode": "---",
                            "PresentValue": "---"
                        })
                        break;
                    case 'space':
                        lNewLst.push({
                            "Name": lName,
                            "ActiveSetPoint": "---",
                            "EquipmentType": ParseObjectMap(Obj.ObjectMap, 3),
                            "HeatCoolMode": "---",
                            "SpaceTemperatureActive": "---"
                        })
                        break;
                    case 'chiller':
                        lNewLst.push({
                            "Name": lName,
                            "EnteringWaterTemperature": "---",
                            "LeavingWaterTemperature": "---",
                            "RunningMode": "---"
                        })
                        break;
                    case 'airhandler':
                        lNewLst.push({
                            "Name": lName,
                            "DuctStaticPressure": "---",
                            "DuctStaticPressureSetpoint": "---",
                            "DischargeAirTemperature": "---",
                            "DischargeAirTemperatureSetpoint": "---"
                        })
                        break;
                    case 'vas':
                        lNewLst.push({
                            "Name": lName,
                            "Occupancy": "---",
                            "OperatingMode": "---"
                        })
                        break;
                    case 'cpc':
                        lNewLst.push({
                            "Name": lName,
                            "ChilledWaterSetpoint": "---",
                            "ReturnWaterTemperature": "---",
                            "SupplyWaterTemperature": "---",
                            "FlowStatus": "---",
                            "BypassFlow": "---"
                        })
                        break;
                    default:
                        return "";
                }
            }
        })
        setEquipments(lNewLst);
    }

    const GetPointValueForProperty = (record, property) => {
        let Propertylst = record.filter((obj) => ParseObjectMap(obj.PointMap, 3) === property);
        if (Propertylst?.length > 0) {
            const latestTimestampValue = latestTimestamp.find(item => item.PointMap.includes(property))?.Value;
           
            if (latestTimestampValue !== undefined && latestTimestampValue !== '') {
                return parseFloat(latestTimestampValue).toFixed(2);
            }
        }
     
    };
   
    const GetPointValueForProperty1= (record, property) => {
        let Propertylst = record.filter((obj) => ParseObjectMap(obj.PointMap, 3) === property);
        if (Propertylst?.length > 0) {
            const latestTimestampValue = latestTimestamp.find(item => item.PointMap.includes(property))?.Value;
           
            if (latestTimestampValue !== undefined && latestTimestampValue !== '') {
                return latestTimestampValue;
            }
        }
     
    };
  

    const ParseObjectMap = (str, pos) => {
        const parts = str.split("#");
        return parts[pos];
    };


    return (
        <div className="content-pane">
            {
                Equipments?.length > 0 ?
                    <><h4 className="header_margin">Equipment List -- {lSelectedFamilyType.toUpperCase()}</h4>
                        <table className="tblequipment" cellSpacing="0" cellPadding="0">
                            <thead>
                                {headerMapping[lSelectedFamilyType].map((header, index) => (<th key={index}>{header}</th>))}
                            </thead>
                            <tbody className="cell_container">
                                {
                                    lSelectedFamilyType === "area" ?
                                        Equipments?.map((obj, index) => (
                                            <tr key={index}>
                                                <td>{obj.Name}</td>
                                                <td>{obj.InsideTemperature === 'undefined °F' ? "---" : obj.InsideTemperature}</td>
                                                <td>{obj.ActiveSetpoint === 'undefined °F' ? "---" : obj.ActiveSetpoint}</td>
                                                <td>{obj.HeatCoolMode}</td>
                                                <td>{obj.PresentValue === undefined ? "---" : obj.PresentValue}</td>
                                            </tr>

                                        )) : ""
                                }
                                {
                                    lSelectedFamilyType === "space" ?
                                        Equipments?.map((obj, index) => (
                                            <tr key={index}>
                                                <td>{obj.Name}</td>
                                                <td>{obj.ActiveSetPoint === 'undefined °F' ? "---" : obj.ActiveSetPoint}</td>
                                                <td>{obj.EquipmentType}</td>
                                                <td>{obj.HeatCoolMode}</td>
                                                <td>{obj.SpaceTemperatureActive === 'undefined °F' ? "---" : obj.SpaceTemperatureActive}</td>
                                            </tr>
                                        )) : ""
                                }
                                {
                                    lSelectedFamilyType === "chiller" ?
                                        Equipments?.map((obj, index) => (
                                            <tr key={index}>
                                                <td>{obj.Name}</td>
                                                <td>{obj.EnteringWaterTemperature === 'undefined °F' ? "---" : obj.EnteringWaterTemperature}</td>
                                                <td>{obj.LeavingWaterTemperature === 'undefined °F' ? "---" : obj.LeavingWaterTemperature}</td>
                                                <td>{obj.RunningMode}</td>
                                            </tr>
                                        )) : ""
                                }
                                {
                                    lSelectedFamilyType === "airhandler" ?
                                        Equipments?.map((obj, index) => (
                                            <tr key={index}>
                                                <td>{obj.Name}</td>
                                                <td>{obj.DuctStaticPressure === 'undefined in(H₂O)' ? "---" : obj.DuctStaticPressure}</td>
                                                <td>{obj.DuctStaticPressureSetpoint === 'undefined in(H₂O)' ? "---" : obj.DuctStaticPressureSetpoint}</td>
                                                <td>{obj.DischargeAirTemperature === 'undefined °F' ? "---" : obj.DischargeAirTemperature}</td>
                                                <td>{obj.DischargeAirTemperatureSetpoint === 'undefined °F' ? "---" : obj.DischargeAirTemperatureSetpoint}</td>
                                            </tr>
                                        )) : ""
                                }
                                {
                                    lSelectedFamilyType === "vas" ?
                                        Equipments?.map((obj, index) => (
                                            <tr key={index}>
                                                <td>{obj.Name}</td>
                                                <td>{obj.Occupancy}</td>
                                                <td>{obj.OperatingMode}</td>
                                            </tr>
                                        )) : ""
                                }
                                {
                                    lSelectedFamilyType === "cpc" ?
                                        Equipments?.map((obj, index) => (
                                            <tr key={index}>
                                                <td>{obj.Name}</td>
                                                <td>{obj.ChilledWaterSetpoint === 'undefined °F' ? "---" : obj.ChilledWaterSetpoint}</td>
                                                <td>{obj.ReturnWaterTemperature === 'undefined °F' ? "---" : obj.ReturnWaterTemperature}</td>
                                                <td>{obj.SupplyWaterTemperature === 'undefined °F' ? "---" : obj.SupplyWaterTemperature}</td>
                                                <td>{obj.FlowStatus}</td>
                                                <td>{obj.BypassFlow}</td>
                                            </tr>
                                        )) : ""
                                }
                            </tbody>
                        </table>
                    </> : <></>
            }
        </div>
    )
}
export default EquipmentList;
