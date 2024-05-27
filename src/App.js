import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import BuildingData from "./components/Buildings/BuildingData";
import SelectedItem from "./components/Buildings/SelectedItem";
import EquipmentData from "./components/Buildings/EquipmentData"
import Loginpage from "./LoginPage";

import LeftNavigation from "./components/Navigation/LeftNavigation";
import Home from "./components/Buildings/Home";
import AllFamilyEquipments from "./components/Buildings/AllFamilyEquipments";
import EquipmentList from "./components/Buildings/EquipmentList";
import EquipmentSummary from "./components/Buildings/EquipmentSummary";
import { Authenticator } from '@aws-amplify/ui-react';

function App() {

    return (
  const DefaultContainer = () => (
    <>
      <LeftNavigation />
      <Route exact path="/Home" component={Home} />
      <Route exact path="/AllFamilyEquipments" component={AllFamilyEquipments} />
      <Route exact path="/EquipmentList" component={EquipmentList} />
      <Route exact path="/EquipmentSummary" component={EquipmentSummary} />
    </>
  )

  return (
    <Authenticator.Provider>
      <Router>
        <Switch>
          <Route exact path="/" component={Loginpage} />
          <Route exact path="/LoginPage" component={Loginpage} />
          <Route component={DefaultContainer}/>
        </Switch>
      </Router>
    </Authenticator.Provider>
  );
}

        <Router>


          <Switch>
          <Route exact path ="/" component={Loginpage}/>
            <Route exact path="/BuildingData" component={BuildingData} />
          <Route exact path="/SelectedItem" component={SelectedItem}/>
          <Route exact path="/EquipmentData" component={EquipmentData}/>

          </Switch>

        </Router>

    );
  }


export default App;
