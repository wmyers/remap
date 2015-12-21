import React from "react";
import AuthenticatedView from "./AuthenticatedView";
import SL_Map from "../components/SL_Map";
import SL_MapForm from "../components/SL_MapForm";

class Home extends React.Component {

  render() {

    return (
      <main>
        <SL_Map></SL_Map>
        <SL_MapForm></SL_MapForm>
      </main>
    );
  }
}

export default AuthenticatedView(Home);
