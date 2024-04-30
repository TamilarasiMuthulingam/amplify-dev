import React, { useEffect, useState } from "react";
import { getAllRecords1 } from "../../graphql/queries";
import { generateClient } from "aws-amplify/api";
import { useHistory } from "react-router-dom";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import "../../Assets/styles/Building.css";
import Publish from "../../Publish";

const client = generateClient();

function Home() {
    const [siteData, setSiteData] = useState(null);
    const [showRightPanel, setShowRightPanel] = useState(false);

    const history = useHistory();

    useEffect(() => {
        const fetchSiteData = async () => {
            try {
                const result = await client.graphql({ query: getAllRecords1 });
                setSiteData(result.data.getAllRecords1);
            } catch (error) {
                console.error("Error fetching site data:", error);
            }
        };
        fetchSiteData();
    }, []);

    const toggleRightPanel = () => {
        setShowRightPanel((prevShowRightPanel) => !prevShowRightPanel);
    };

    const RedirectToEquipemtList = (SerialNumber) => {
        history.push({
            pathname: "/AllFamilyEquipments",
            SerialNumber: SerialNumber
        });
    }

    return (
        <div class='parentdiv'>
            <h2 className="headerBuilding">Buildings</h2>
            {
                siteData?.map((site, index) => {
                    const addressObject = JSON.parse(
                        site.Address.replace(/'/g, '"')
                    );
                    return <div className="childdiv buildingslide" key={index} onClick={() => RedirectToEquipemtList(site.SerialNumber)}>
                        <h1 className="building-name">{site.Name}</h1>
                        <p class="building-location">{`${addressObject.city}, ${addressObject.state}`}</p>
                    </div>
                })
            }
            {
                showRightPanel ? <Publish toggleRightPanel={toggleRightPanel} /> : <button className="home-arror-icon" onClick={toggleRightPanel}>
                    <KeyboardDoubleArrowRightIcon />
                </button> 
            }
        </div>
    )
}
export default Home;