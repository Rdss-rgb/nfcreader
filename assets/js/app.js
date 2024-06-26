const scanButton = document.querySelector('#scan');
const stopScanButton = document.querySelector('#stop-scan');
const writeButton = document.querySelector('#write');
const makeReadOnlyButton = document.querySelector('#makeReadOnlyButton');
var scanning=true;


scanButton.addEventListener("click", async () => {
  document.getElementById('status').innerText=''
  document.getElementById('output-nfc').innerText=''
  document.getElementById('records').innerText=''
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
      
        if(message.records[0]['data']!=null){
          var mess=message.records[0]['data']['byteLength'];

              console.log(message.records[0])
              document.getElementById('status').innerText='Found';
              document.getElementById('loader').classList.add('hidden');
              console.log(`* Serial Number: ${serialNumber} `, message);
           if(message.records[0]['recordType']=='empty'){
            document.getElementById('output-nfc').innerText=`Serial Number: ${serialNumber} `+`\n`+ `Byte length:`+mess;
           }
           else{
            document.getElementById('output-nfc').innerText=`Serial Number: ${serialNumber}  `+`\n`+ `Byte length:`+mess;
            console.log(message.records[0]['data']['byteLength']) 
      
           }
        }
    
    else{
      var mess=message.records[0]['recordType'];
          document.getElementById('status').innerText='Found';
          document.getElementById('loader').classList.add('hidden');
          console.log(`* Serial Number: ${serialNumber} `, message);
       if(message.records[0]['recordType']=='empty'){
        document.getElementById('output-nfc').innerText=`Serial Number: ${serialNumber} `+`\n`+ `recordType:`+mess;
       }
       else{
        document.getElementById('output-nfc').innerText=`Serial Number: ${serialNumber}  `+`\n`+ `recordType:`+mess;
        console.log(message.records[0]['data']['byteLength']) 
  
       }
    }  
     console.log(message.records)
     ndef.write('OK')

     // message ${message}
     scanning=true;
     document.getElementById('records').innerText=`Records: (${message.records.length})`;
       
      });
    } catch (error) {
      console.log("Argh! " + error);
    }
  });
  
  var writeInterval;

  writeButton.addEventListener("click", async () => {
    var timex =document.getElementById('time').value;
    var pload =document.getElementById('payload').value;
    var fullMsg =document.getElementById('fullMsg').value;
    console.log("User clicked write button");
    console.log(scanning)
    // let fullMsg = "cHNidP8BAHEBAAAAAW0FSjCjaEybL+jpHuj6M4NaD3M3VWrd8G7TYGczj1R3AQAAAAD/////AqCGAQAAAAAAFgAUpkjmMa7S22pxLAt9bNkxQmkOquF4ZJc7AAAAABYAFOFg0PDOH4EtmaqlS5VfvAwT0xNNAAAAAAABAR88F5k7AAAAABYAFOFg0PDOH4EtmaqlS5VfvAwT0xNNIgYCBW2rLxIhzy/i9BSEd763zzXfEbOGxLHbCrLwKIVHbb4YOewbblQAAIAAAACAAAAAgAEAAAAAAAAAAAAA";
    // var tohex=Uint8Array.from(atob("cHNidP8BAHsCAAAAAhuVpgVRdOxkuC7wW2rvw4800OVxl+QCgezYKHtCYN7GAQAAAAD/////HPTH9wFgyf4iQ2xw4DIDP8t9IjCePWDjhqgs8fXvSIcAAAAAAP////8BigIAAAAAAAAWABTHctb5VULhHvEejvx8emmDCtOKBQAAAAAAAAAA"), c => c.charCodeAt(0))
    // var payloadlength = 200;
    var byteMsg = new Uint8Array(pload);
    var tohex = Uint8Array.from(atob(fullMsg), c => c.charCodeAt(0));

    // console.log(byteMsg);
    // let byteMsg = new Uint8Array(128);
    // for (var i = 0; i < byteMsg.byteLength; i++) {
    //   byteMsg[i] = i % 256
    // }
    if(scanning == true){
      const ndef = new NDEFReader();
      var index = 0;
      while (index < tohex.length) {
        console.log(index);
        
        if (index + pload < tohex.byteLength) {
          byteMsg = new Uint8Array(pload);
        }
        else {
          byteMsg = new Uint8Array(tohex.byteLength - index);
        }

        for (var i = 0; i < byteMsg.byteLength; i++) {
          // if (index + i < tohex.byteLength) {
            byteMsg[i] = tohex[i+index];
          // }
        }
        console.log(byteMsg);
        setTimeout(sendNFCData, (index/pload) * timex, index, ndef, byteMsg);
        
        

        index += pload;
      }
  
      // for (var i = 0; i < byteMsg.byteLength; i++) {
      //     byteMsg[i] = tohex[i];
      // }



      // ndef.write(byteMsg)
      
      //   .then(() => {
      //     console.log("Message written.");
      //     document.getElementById('msg1').innerText='Message written!';
      //   })
      //   .catch((error) => {
      //     console.log(`Write failed try again: ${error}.`);
      //     document.getElementById('msg').innerText=`Write failed try again: ${error}.`;
      //   });
    }
    else{
      document.getElementById('msg').innerText='Please Scan NFC First!';
    }
   
  });

  async function sendNFCData(index, ndef, byteMsg){
    console.log("We are writing");
    document.getElementById('msg1').innerText = `We are writing from ${index} to ${index + byteMsg.byteLength}`;
    try {
      await ndef.write(byteMsg);
      console.log(`message sent from ${index} to ${index + byteMsg.byteLength}`);
      document.getElementById('msg1').innerText = `message sent from ${index} to ${index + byteMsg.byteLength}`;
    } catch(error) {
      console.log(`Write failed try again: ${error}.`);
      document.getElementById('msg').innerText=`Write failed try again: ${error}.`;
    }
  }

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
  // var url='https://api.restful-api.dev/objects';
  // fetch(url)
  // .then(response=>response.json())
  // .then(response => {
  //   console.log(response);
  // })
  // .catch(error =>{
  //   console.error(error)
  // })