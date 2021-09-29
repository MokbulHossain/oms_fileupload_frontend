import React, { useEffect, useState, Fragment } from "react";
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://18.170.176.135:9002";


export default function FileuploadComponent() {
  const [response, setResponse] = useState("");
  const [filename, setfilename] = useState("")
  const [File, setFile] = useState(null)


  useEffect(() => {

    const socket = socketIOClient(ENDPOINT); 

    if(File) {

        const FReader = new FileReader();

        let {name, size} = File
    
       name = name.split(' ').join('_')
         
        FReader.onload = (evnt) =>{

            console.log('evnt ') 
            socket.emit('Upload', { 'Name' : name, 'Data' : evnt.target.result });
    
        }
    
        socket.emit('Start', { 'Name' : name, 'Size' : size });
    
        socket.on('MoreData', function (data){
    
            UpdateBar(data['Percent']);
            var Place = data['Place'] * 131072; //The Next Blocks Starting Position
            var NewFile; //The Variable that will hold the new Block of Data
            
            NewFile = File.slice(Place, Place + Math.min(131072, (File.size-Place)))
        
            FReader.readAsBinaryString(NewFile);
            
        });

        socket.on("Done", data => {
            UpdateBar(data['Percent']);
            console.log("File uploaded successfully, access url: ",data['file_access_url']);
          });
    
        const  UpdateBar = (percent) =>{
            
            console.log('File.size ', File.size)
            const stylewidth = percent + '%';
            const inhtml = (Math.round(percent*100)/100) + '%';
            var MBDone = Math.round(((percent/100.0) * File.size) / 1048576);
        
            console.log('stylewidth ', stylewidth)
            console.log('inhtml ', inhtml)
            console.log('MBDone ', MBDone)
        
        }

    }

     // CLEAN UP THE EFFECT
     return () => socket.disconnect();

  }, [File]);





  const onChange = async(e) => {

    e.preventDefault();

    setFile(e.target.files[0])
     
  }

  return (
     <Fragment>
        <div id="UploadBox">
        <h2>Video Uploader</h2>
        <span id='UploadArea'>
        <label for="FileBox">Choose A File: </label>
                <input type="file" id="FileBox" onChange={onChange}/><br/>
				<label for="NameBox">Name: </label>
                <input type="text" id="NameBox" /><br/>

				<button	type='button' id='UploadButton' class='Button'>Upload</button>
			</span>
		</div>
    </Fragment>
  );
}