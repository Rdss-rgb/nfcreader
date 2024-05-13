const scanButton = document.querySelector('#scan');
const stopScanButton = document.querySelector('#stop-scan');
const writeButton = document.querySelector('#write');
const makeReadOnlyButton = document.querySelector('#makeReadOnlyButton');
var scanning=false;

scanButton.addEventListener("click", async () => {
    console.log("User clicked scan button");
    document.getElementById('msg').innerText='';
    try {
      const ndef = new NDEFReader();

      ndef.addEventListener("readingerror", (e) => {
        console.log(`Cannot read data from the NFC tag. `, e);
        document.getElementById('status').innerText='Cannot read data from the NFC tag';
      });

      await ndef.scan();
      console.log("> Scan started");
      document.getElementById('loader').classList.remove('hidden');
  

  
      ndef.addEventListener("reading", async ({ message, serialNumber}) => {
        var mess=message.records[0]['data']['byteLength'];
        document.getElementById('status').innerText='Found';
        document.getElementById('loader').classList.add('hidden');
        console.log(`* Serial Number: ${serialNumber} `, message);
     if(message.records[0]['recordType']=='empty'){
      document.getElementById('output-nfc').innerText=`Serial Number: ${serialNumber} `+`\n`+ `Byte length:`+mess;
     }
     else{
      document.getElementById('output-nfc').innerText=`Serial Number: ${serialNumber}  `+`\n`+ `Byte length:`+mess;
      console.log(message.records[0]['data']['byteLength']) 
      console.log(message.records[0]['data']['byteLength'][[[Uint8Array]]])

     }
     console.log(message.records)

     // message ${message}
     scanning=true;
     document.getElementById('records').innerText=`Records: (${message.records.length})`;
       
      });
    } catch (error) {
      console.log("Argh! " + error);
    }
  });
  
  writeButton.addEventListener("click", async () => {
    console.log("User clicked write button");
    console.log(scanning)
    let byteMsg = new Uint8Array(128);
    for (var i = 0; i < byteMsg.byteLength; i++) {
      byteMsg[i] = i % 256
    }
    if(scanning == true){
      const ndef = new NDEFReader();
      ndef.write(byteMsg)
      
        .then(() => {
          console.log("Message written.");
          document.getElementById('msg1').innerText='Message written!';
        })
        .catch((error) => {
          console.log(`Write failed try again: ${error}.`);
          document.getElementById('msg').innerText=`Write failed try again: ${error}.`;
        });
    }
    else{
      document.getElementById('msg').innerText='Please Scan NFC First!';
    }
   
  });

  stopScanButton.addEventListener("click", async () => {
    console.log("User clicked write button");
    try {
      const ndef = new NDEFReader();
      await ndef.s;
      console.log("> scan stop");
      window.location.reload();
    } catch (error) {
      console.log("Argh! " + error);
    }
   
  });
  var url='https://api.restful-api.dev/objects';
  fetch(url)
  .then(response=>response.json())
  .then(response => {
    console.log(response);
  })
  .catch(error =>{
    console.error(error)
  })