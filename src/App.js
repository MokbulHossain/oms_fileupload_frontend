import React, { useState } from "react";
import FileuploadComponent from './fileUpload'

function App() {
  const [loadClient, setLoadClient] = useState(true);
  return (
    <>
      <FileuploadComponent />
    </>
  );
}

export default App;