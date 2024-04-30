import React, { useEffect, useState } from "react";
import image11 from "../../Assets/images/building.png";
import image10 from "../../Assets/images/trane.png";
import PersonIcon from '@mui/icons-material/Person';
import Home from '@mui/icons-material/Home';
import "../../Assets/styles/LeftNavigation.css";
import { generateClient } from "aws-amplify/api";
import { getAllRecords1, getAllRecords2 } from "../../graphql/queries";
import { useHistory } from 'react-router-dom';
import { Button, useAuthenticator } from "@aws-amplify/ui-react";

const client = generateClient();

const LeftNavigation = () => {
    const { user, signOut } = useAuthenticator((context) => [context.user]);
    const [expandedSites, setExpandedSites] = useState([]);
    const [isSiteExpanded, setIsSiteExpanded] = useState(false);
    const [isFamilyExpanded, setIsFamilyExpanded] = useState(false);

    const history = useHistory();
    console.log('user dt', user);

    useEffect(() => {
        let lSites = [];
        const fetchSiteList = async () => {
            try {
                const result = await client.graphql({ query: getAllRecords1 });
                lSites = result.data.getAllRecords1;
            } catch (error) {
                console.error("Error fetching site data:", error);
            }
        };
        const fetchEquipmentList = async () => {
            try {
                const result = await client.graphql({ query: getAllRecords2 });
                var ObjectsData = result.data.getAllRecords2;
                let lSiteAndFamily = [];
                lSites.forEach(site => {
                    let lFilteredSiteData = ObjectsData.filter((obj) => ParseObjectMap(obj.ObjectMap, 0) === site.SerialNumber);
                    let lUniqueFamilyTypes = [...new Set(lFilteredSiteData.map(obj => ParseObjectMap(obj.ObjectMap, 1)))];
                    let lFilteredObjects = [];
                    lUniqueFamilyTypes.forEach(Obj => {
                        let lFilteredEquipmentData = lFilteredSiteData.filter((obj) => ParseObjectMap(obj.ObjectMap, 1) === Obj);
                        let lEquipments = lFilteredEquipmentData.map(obj => ParseObjectMap(obj.ObjectMap, 2));
                        lFilteredObjects.push({ "FamilyType": Obj, "Equipments": lEquipments, "IsExpanded": false });
                    })
                    lSiteAndFamily.push({ "SerialNumber": site.SerialNumber, "Name": site.Name, "FamilyTypes": lFilteredObjects, "IsExpanded": false });
                });
                console.log('grouping lst', lSiteAndFamily);
                setExpandedSites(lSiteAndFamily);
            } catch (error) {
                console.error("Error fetching site data:", error);
            }
        };
        fetchSiteList();
        fetchEquipmentList();
    }, []);

    const handleBuildingToggle = (SerialNumber) => {
        setExpandedSites(expandedSites.map(p =>
            p.SerialNumber === SerialNumber ? { ...p, IsExpanded: !p.IsExpanded } : p
        ));
        setIsSiteExpanded(!isSiteExpanded);
    };

    const handleFamiliyTypeToggle = (SerialNumber, FamilyType) => {
        expandedSites.forEach((obj) => {
            if (obj.SerialNumber === SerialNumber) {
                obj.FamilyTypes.forEach((obj1) => {
                    if (obj1.FamilyType === FamilyType) {
                        obj1.IsExpanded = !obj1.IsExpanded;
                    }
                })
            }
        })
        setExpandedSites(expandedSites);
        setIsFamilyExpanded(!isFamilyExpanded);
    }

    const ParseObjectMap = (str, pos) => {
        const parts = str.split("#");
        return parts[pos];
    };

    const RedirectToAllEquipmentList = (serialNumber) => {
        history.push({
            pathname: "/AllFamilyEquipments",
            SerialNumber: serialNumber
        });
    }

    const RedirectToEquipmentList = (serialNumber, familyType) => {
        history.push({
            pathname: "/EquipmentList",
            SerialNumber: serialNumber,
            FamilyType: familyType
        });
    };

    const RedirectToEquipmentSummary = (serialNumber, familyType, equipmentName) => {
        history.push({
            pathname: "/EquipmentSummary",
            EquipmentName: serialNumber+"#"+familyType+"#"+equipmentName
        });
    };

    const handleSignOut = async() => {
        // console.log('calling..');
        history.push("/LoginPage");
        signOut();
    }

    const RedirectToHome = () => {
        history.push({
            pathname: "/Home"
        });
    }

    return (
        <>
            <div className="topcontainer">
                <div className="image-container">
                    <img src={image10} alt="trane" style={{"height":"46px"}} />
                </div>
                <h2 className="txt-trane">Tracer ® Ensemble™</h2>
                <div className="home-icon" onClick={() => RedirectToHome()}>
                    <Home style={{ position: 'relative', top: '6px', left: '3px' }} /> Home
                </div>
                <div className="signout-div">
                    <Button className="signout-btn" onClick={() => handleSignOut()}>Sign Out</Button>
                </div>
                <div className="user-icon">
                    <PersonIcon style={{ position: 'relative', top: '6px', left: '3px' }} /> {localStorage.getItem("LoggedInUserName")}
                </div>
            </div>
            <div className="navleft-panel">
                {
                    expandedSites?.map((site, index) => (
                        <div key={index}>
                            <div key={index} className="navhighlight" onClick={() => handleBuildingToggle(site.SerialNumber)}>
                                <div className="navsitename">
                                    <img src={image11} className="img-building" alt="Building" />{" "}
                                    <span onClick={() => RedirectToAllEquipmentList(site.SerialNumber)}>{site.Name}</span>
                                </div>
                            </div>
                            <>
                                {
                                    site.IsExpanded ? <div>
                                        {
                                            site.FamilyTypes.map((family) => (
                                                <div className="navcontainer" onClick={() => handleFamiliyTypeToggle(site.SerialNumber, family.FamilyType)}>
                                                    <div className="familycontainer navhighlight">
                                                        {family.IsExpanded ? "▼ " : "▶ "}  <span onClick={() => RedirectToEquipmentList(site.SerialNumber, family.FamilyType)}>{family.FamilyType}</span>
                                                    </div>
                                                    <>
                                                        {
                                                            family.IsExpanded ? <div>
                                                                {
                                                                    family.Equipments.map((Equip) => (
                                                                        <div className="objectcontainer navhighlight" onClick={() => RedirectToEquipmentSummary(site.SerialNumber, family.FamilyType, Equip)}>
                                                                            <span className="navobjname">{Equip}</span>
                                                                        </div>
                                                                    ))
                                                                }
                                                            </div> : <></>
                                                        }
                                                    </>
                                                </div>
                                            ))
                                        }
                                    </div>
                                        :
                                        <></>
                                }
                            </>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default LeftNavigation;