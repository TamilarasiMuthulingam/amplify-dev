import React, { useEffect, useState } from "react";
import { generateClient } from "aws-amplify/api";
import { getAllEquipmentNamesBySerialNumber, getAllEquipmentsBySerialNumber } from "../../graphql/queries";
import EnumData from "./EnumFile";

const client = generateClient();
const headerMapping = {
    area: ["Name", "InsideTemperature", "ActiveSetpoint", "HeatCoolMode", "PresentValue"],
    space: ["Name", "ActiveSetPoint", "EquipmentType", "HeatCoolMode", "SpaceTemperatureActive"],
    chiller: ["Name", "EnteringWaterTemperature", "LeavingWaterTemperature", "RunningMode"],
    airhandler: ["Name", "DuctStaticPressure", "DuctStaticPressureSetpoint", "DischargeAirTemperature", "DischargeAirTemperatureSetpoint"]
}

function AllFamilyEquipments(BuildingData) {
    console.log('sSerialNumber', BuildingData?.location?.SerialNumber); //"E08E60850"
    const [areaData, setareaData] = useState([]);
    const [spaceData, setspaceDataData] = useState([]);
    const [chillerData, setchillerData] = useState([]);
    const [airhandlerData, setairhandlerData] = useState([]);

    useEffect(() => {
        const fetchEquipmentList = async () => {
            try {
                let lSerialNumber = BuildingData?.location?.SerialNumber; 
                const Objresult = await client.graphql({
                    query: getAllEquipmentNamesBySerialNumber, variables: {
                        ObjectMap: { beginsWith: lSerialNumber }
                    }
                });
                let ObjectsNameLst = Objresult.data.getAllEquipmentNamesBySerialNumber.items;
                let ObjectsName = ObjectsNameLst.filter((obj) => ParseObjectMap(obj.ObjectMap, 0) === lSerialNumber);
                console.log('ObjectNamesData lst', ObjectsNameLst);

                const result = await client.graphql({
                    query: getAllEquipmentsBySerialNumber, variables: {
                        PointMap: { beginsWith: lSerialNumber }
                    }
                });
                var ObjectsDataLst = result.data.getAllEquipmentsBySerialNumber.items;
                var ObjectsData = ObjectsDataLst.filter((obj) => ParseObjectMap(obj.PointMap, 0) === lSerialNumber);
                console.log('ObjectsData lst', ObjectsData);

                let lFileredArea = ObjectsName.filter((obj) => ParseObjectMap(obj.ObjectMap, 1) === "area");
                let lFilteredAreaData = ObjectsData.filter((obj) => ParseObjectMap(obj.PointMap, 1) === "area");
                const groupedByObjectName1 = Map.groupBy(lFilteredAreaData, (obj) => ParseObjectMap(obj.PointMap, 2));
                let lNewAreaLst = [];
                groupedByObjectName1.forEach(Obj => {
                    if (Obj?.length) {
                        lNewAreaLst.push({
                            "Name": ParseObjectMap(Obj[0].PointMap, 2),
                            "InsideTemperature": GetPointValueForProperty(Obj, "spaceSetpoint") + " °F",
                            "ActiveSetpoint": GetPointValueForProperty(Obj, "activeSetpoint") + " °F",
                            "HeatCoolMode": EnumData.HeatCoolMode("Mode." + GetPointValueForProperty(Obj, "heatCoolModeStatus") + ".Text"),
                            "PresentValue": EnumData.PresentValue("PresentValue." + GetPointValueForProperty(Obj, "occupancyStatus") + ".Text")
                        })
                    }
                });
                lFileredArea.forEach(Obj => {
                    let lName = ParseObjectMap(Obj.ObjectMap, 2);
                    let IsExists = lNewAreaLst.filter((item) => item.Name === lName);
                    if (IsExists !== undefined && IsExists !== null && IsExists.length < 1) {
                        lNewAreaLst.push({
                            "Name": lName,
                            "InsideTemperature": "---",
                            "ActiveSetpoint": "---",
                            "HeatCoolMode": "---",
                            "PresentValue": "---"
                        })
                    }
                })
                setareaData(lNewAreaLst);

                let lFileredSpace = ObjectsName.filter((obj) => ParseObjectMap(obj.ObjectMap, 1) === "space");
                let lFilteredSpaceData = ObjectsData.filter((obj) => ParseObjectMap(obj.PointMap, 1) === "space");
                const groupedByObjectName2 = Map.groupBy(lFilteredSpaceData, (obj) => ParseObjectMap(obj.PointMap, 2));
                let lNewSpace = [];
                groupedByObjectName2.forEach(Obj => {
                    if (Obj?.length) {
                        let lEquipmentType = lFileredSpace.filter(el => ParseObjectMap(el.ObjectMap, 2) === ParseObjectMap(Obj[0].PointMap, 2));
                        lNewSpace.push({
                            "Name": ParseObjectMap(Obj[0].PointMap, 2),
                            "ActiveSetPoint": GetPointValueForProperty(Obj, "activeSetpoint") + " °F",
                            "EquipmentType": lEquipmentType[0] !== undefined ? ParseObjectMap(lEquipmentType[0].ObjectMap, 3) : "",
                            "HeatCoolMode": EnumData.HeatCoolMode("Mode." + GetPointValueForProperty(Obj, "HeatCoolModeStatus") + ".Text"),
                            "SpaceTemperatureActive": GetPointValueForProperty(Obj, "SpaceTempSetpointActive") + " °F"
                        })
                    }
                });
                lFileredSpace.forEach(Obj => {
                    let lName = ParseObjectMap(Obj.ObjectMap, 2);
                    let IsExists = lNewAreaLst.filter((item) => item.Name === lName);
                    if (IsExists !== undefined && IsExists !== null && IsExists.length < 1) {
                        lNewSpace.push({
                            "Name": lName,
                            "ActiveSetPoint": "---",
                            "EquipmentType": ParseObjectMap(Obj.ObjectMap, 3),
                            "HeatCoolMode": "---",
                            "SpaceTemperatureActive": "---"
                        })
                    }
                })
                setspaceDataData(lNewSpace);

                let lFileredChiller = ObjectsName.filter((obj) => ParseObjectMap(obj.ObjectMap, 1) === "chiller");
                let lFilteredChillerData = ObjectsData.filter((obj) => ParseObjectMap(obj.PointMap, 1) === "chiller");
                const groupedByObjectName3 = Map.groupBy(lFilteredChillerData, (obj) => ParseObjectMap(obj.PointMap, 2));
                let lChiller = [];
                groupedByObjectName3.forEach(Obj => { 
                    if (Obj?.length) {
                        lChiller.push({
                            "Name": ParseObjectMap(Obj[0].PointMap, 2),
                            "EnteringWaterTemperature": GetPointValueForProperty(Obj, "ActiveSetPoint") + " °F",
                            "LeavingWaterTemperature": GetPointValueForProperty(Obj, "EquipmentType") + " °F",
                            "RunningMode": GetPointValueForProperty(Obj, "HeatCoolMode")
                        })
                    }
                });
                lFileredChiller.forEach(Obj => {
                    let lName = ParseObjectMap(Obj.ObjectMap, 2);
                    let IsExists = lChiller.filter((item) => item.Name === lName);
                    if (IsExists !== undefined && IsExists !== null && IsExists.length < 1) {
                        lChiller.push({
                            "Name": lName,
                            "EnteringWaterTemperature": "---",
                            "LeavingWaterTemperature": "---",
                            "RunningMode": "---"
                        })
                    }
                })
                setchillerData(lChiller);

                let lFileredAirHandler = ObjectsName.filter((obj) => ParseObjectMap(obj.ObjectMap, 1) === "airhandler");
                let lFilteredAirHandlerData = ObjectsData.filter((obj) => ParseObjectMap(obj.PointMap, 1) === "airhandler");
                const groupedByObjectName4 = Map.groupBy(lFilteredAirHandlerData, (obj) => ParseObjectMap(obj.PointMap, 2));
                let lAirHandler = [];
                groupedByObjectName4.forEach(Obj => { 
                    if (Obj?.length) {
                        lAirHandler.push({
                            "Name": ParseObjectMap(Obj[0].PointMap, 2),
                            "DuctStaticPressure": GetPointValueForProperty(Obj, "DuctStaticPressure") + " in(H₂O)",
                            "DuctStaticPressureSetpoint": GetPointValueForProperty(Obj, "DuctStaticPressureSetpoint") + " in(H₂O)",
                            "DischargeAirTemperature": GetPointValueForProperty(Obj, "DischargeAirTemperature") + " °F",
                            "DischargeAirTemperatureSetpoint": GetPointValueForProperty(Obj, "DischargeAirTemperatureSetpoint") + " °F"
                        })
                    }
                });
                lFileredAirHandler.forEach(Obj => {
                    let lName = ParseObjectMap(Obj.ObjectMap, 2);
                    let IsExists = lAirHandler.filter((item) => item.Name === lName);
                    if (IsExists !== undefined && IsExists !== null && IsExists.length < 1) {
                        lAirHandler.push({
                            "Name": lName,
                            "DuctStaticPressure": "---",
                            "DuctStaticPressureSetpoint": "---",
                            "DischargeAirTemperature": "---",
                            "DischargeAirTemperatureSetpoint": "---"
                        })
                    }
                })
                setairhandlerData(lAirHandler);
            } catch (error) {
                console.error("Error fetching site data:", error);
            }
        };
        fetchEquipmentList();

        const GetPointValueForProperty = (record, property) => {
            let Propertylst = record.filter((obj) => ParseObjectMap(obj.PointMap, 3) === property);
            if (Propertylst?.length > 0) {
                Propertylst.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));
                return Propertylst[0]?.Value;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const ParseObjectMap = (str, pos) => {
        const parts = str.split("#");
        return parts[pos];
    };

    return (
        <div className="content-pane">
            {
                areaData?.length > 0 ?
                    <><h4 className="header_margin">Areas</h4>
                    <table className="tblequipment" cellSpacing="0" cellPadding="0">
                        <thead>
                            {headerMapping.area.map((header, index) => (<th key={index}>{header}</th>))}
                        </thead>
                        <tbody className="cell_container">
                            {
                                areaData?.map((obj, index) => (
                                    <tr key={index}>
                                        <td>{obj.Name}</td>
                                        <td>{obj.InsideTemperature === 'undefined °F' ? "---" : obj.InsideTemperature}</td>
                                        <td>{obj.ActiveSetpoint === 'undefined °F' ? "---" : obj.ActiveSetpoint}</td>
                                        <td>{obj.HeatCoolMode}</td>
                                        <td>{obj.PresentValue === undefined ? "---" : obj.PresentValue}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table></> : <></>
            }
            {
                spaceData?.length > 0 ?
                    <><h4 className="header_margin">Spaces</h4>
                    <table className="tblequipment" cellSpacing="0" cellPadding="0">
                        <thead>
                            {headerMapping.space.map((header, index) => (<th key={index}>{header}</th>))}
                        </thead>
                        <tbody className="cell_container">
                            {
                                spaceData?.map((obj, index) => (
                                    <tr key={index}>
                                        <td>{obj.Name}</td>
                                        <td>{obj.ActiveSetPoint === 'undefined °F' ? "---" : obj.ActiveSetPoint}</td>
                                        <td>{obj.EquipmentType}</td>
                                        <td>{obj.HeatCoolMode}</td>
                                        <td>{obj.SpaceTemperatureActive === 'undefined °F' ? "---" : obj.SpaceTemperatureActive}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table></> : <></>
            }
            {
                chillerData?.length > 0 ?
                    <><h4 className="header_margin">Chiller Plants</h4>
                    <table className="tblequipment" cellSpacing="0" cellPadding="0">
                        <thead>
                            <tr>
                                {headerMapping.chiller.map((header, index) => (<th key={index}>{header}</th>))}
                            </tr>
                        </thead>
                        <tbody className="cell_container">
                            {
                                chillerData?.map((obj, index) => (
                                    <tr key={index}>
                                        <td>{obj.Name}</td>
                                        <td>{obj.EnteringWaterTemperature === 'undefined °F' ? "---" : obj.EnteringWaterTemperature}</td>
                                        <td>{obj.LeavingWaterTemperature === 'undefined °F' ? "---" : obj.LeavingWaterTemperature}</td>
                                        <td>{obj.RunningMode}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table></> : <></>
            }
            {
                airhandlerData?.length > 0 ?
                    <><h4 className="header_margin">Air Handlers</h4>
                    <table className="tblequipment" cellSpacing="0" cellPadding="0">
                        <thead>
                            <tr>
                                {headerMapping.airhandler.map((header, index) => (<th key={index}>{header}</th>))}
                            </tr>
                        </thead>
                        <tbody className="cell_container">
                            {
                                airhandlerData?.map((obj, index) => (
                                    <tr key={index}>
                                        <td>{obj.Name}</td>
                                        <td>{obj.DuctStaticPressure === 'undefined in(H₂O)' ? "---" : obj.DuctStaticPressure}</td>
                                        <td>{obj.DuctStaticPressureSetpoint === 'undefined in(H₂O)' ? "---" : obj.DuctStaticPressureSetpoint}</td>
                                        <td>{obj.DischargeAirTemperature === 'undefined °F' ? "---" : obj.DischargeAirTemperature}</td>
                                        <td>{obj.DischargeAirTemperatureSetpoint === 'undefined °F' ? "---" : obj.DischargeAirTemperatureSetpoint}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table></> : <></>
            }
        </div>
    )
}
export default AllFamilyEquipments;