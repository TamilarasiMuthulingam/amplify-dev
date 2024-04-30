
import React, { useEffect } from "react";
import "@aws-amplify/ui-react/styles.css";
import {
  withAuthenticator,
  Heading,
  View,
  Card
} from "@aws-amplify/ui-react";
import { useHistory } from 'react-router-dom';

function LoginPage({ signOut, user }) {
  const history = useHistory();

  useEffect(() => {
    if(user !== undefined && user !== null){
      localStorage.setItem("LoggedInUserName", user?.signInDetails?.loginId)
      history.push({
        pathname:"/Home"
      });
    }
  }, []);

  return (
    <View className="App">
      <Card>
        <Heading level={1}> </Heading>
      </Card>
    </View>
  );
}

export default withAuthenticator(LoginPage);