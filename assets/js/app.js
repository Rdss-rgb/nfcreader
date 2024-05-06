
// const scanButton = document.querySelector('#scan');
// const stopScanButton = document.querySelector('#stop-scan');
// const writeButton = document.querySelector('#write');
// const name = document.querySelector('#name');
// const age = document.querySelector('#age');
// const city = document.querySelector('#city');

// const nfcDiaconsole.log = document.querySelector('#nfc-diaconsole.log');
// const closeButton = document.querySelector('#close-diaconsole.log');

// let scanning = false;

// closeButton.addEventListener('click', () => {
//   nfcDiaconsole.log.close();
// });

// stopScanButton.disabled = true;

// const capitalize = string => `${string.substr(0, 1).toUpperCase()}${string.substr(1)}`;

// const showTagData = data => {
//   nfcDiaconsole.log.body = [...Object.entries(data)].reduce((html, [key, value]) => `${html}${capitalize(key)}: ${value}`, ``);

//   nfcDiaconsole.log.open();
// };

// const readTag = ({message}) => {
//   const {records} = message;

//   return records.map(record => {
//     const {id, recordType, mediaType, encoding, data} = record;

//     const decoder = encoding ? new TextDecoder(encoding) : new TextDecoder();

//     switch(data) {
//       case 'url':
//       case 'text':
//         console.console.log('data', decoder.decode(data));
//         break;

//       case 'mime':
//         showTagData(JSON.parse(decoder.decode(data)));

//         break;
//     }

//     return ['text'].includes(recordType) ? decoder.decode(data) : decoder.decode(data);
//   });
// };

// let abortController;

// const scanTag = () => {
//   scanButton.disabled = true;
//   stopScanButton.disabled = false;

//   return new Promise((resolve, reject) => {
//     try {
//       const reader = new NDEFReader();
//       abortController = new AbortController();

//       reader.scan({signal: abortController.signal});
//       scanning = true;

//       reader.addEventListener('reading', e => resolve(readTag(e)));

//       reader.addEventListener('readingerror', e => {
//         console.console.log('error reading tag', e);
//         reject(e);
//       });
//     }
//     catch(e) {
//       console.console.log('error scanning tag:', e);

//       scanButton.disabled = false;
//       stopScanButton.disabled = true;
//       scanning = false;

//       reject(e);
//     }
//   });
// };

// const stopScan = () => {
//   abortController.abort();

//   scanButton.disabled = false;
//   stopScanButton.disabled = true;
//   scanning = false;
// };

// const writeTag = async () => {
//   writeButton.disabled = true;

//   if(scanning) {
//     stopScan();
//   }
//   const encoder = new TextEncoder();

//   const data = {
//     name: name.value,
//     age: age.value,
//     city: city.value
//   };

//   const records = [];

//   records.push({
//     recordType: 'mime',
//     mediaType: 'application/json',
//     data: encoder.encode(JSON.stringify(data))
//   });

//   const reader = new NDEFReader();
//   abortController = new AbortController();

//   reader.scan({signal: abortController.signal});

//   try {
//     await reader.write({records}, {
//       overwrite: true
//     });

//     setTimeout(() => abortController.abort(), 3000);
//   }
//   catch(e) {
//     console.console.log('error writing tag', e);
//   }
//   finally {
//     writeButton.disabled = false;
//   }
// };

// scanButton.addEventListener('click', scanTag);
// stopScanButton.addEventListener('click', stopScan);
// writeButton.addEventListener('click', writeTag);    
    

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
        document.getElementById('status').innerText='Found';
        document.getElementById('loader').classList.add('hidden');
        console.log(`* Serial Number: ${serialNumber} `, message);

     if(message.records[0]['recordType']=='empty'){
      document.getElementById('output-nfc').innerText=`Serial Number: ${serialNumber} `+`\n`+ `Byte length:`;
     }
     else{
      document.getElementById('output-nfc').innerText=`Serial Number: ${serialNumber} `+`\n`;
      console.log(message.records[0]['data']['byteLength']) 
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
    let byteMsg = new ArrayBuffer(48)
    for (var i = 0; byteMsg.length; i++) {
      byteMsg[i] = i % 256
    }
    byteMsg
    if(scanning == true){
      const ndef = new NDEFReader();
      ndef
        // .write("0x2e 0x25 0xb5 0xa2 0x34 0xc0 0xaa 0xe1 0xa8 0xaa 0x31 0xdb 0xb3 0xaf 0x2e 0xcc 0x2e 0x6e 0xb1 0x3a 0x29 0xa1 0x2f 0xba 0xb5 0x63 0xac 0x19 0xb2 0x4b 0x30 0xa5 0x2a 0xa9 0x9e 0xd 0x31 0x3a 0x33 0xd3 0x1f 0x73 0x2e 0x48 0x31 0xb2 0x28 0x12 0xb0 0x86 0x20 0xf5 0xad 0x2 0xab 0xe0 0xb5 0xae 0x26 0x6a 0x31 0x2 0xac 0x16 0x27 0x42 0x2d 0xbc 0x2b 0x66 0x34 0x71 0x2a 0xbf 0x2f 0xb4 0x2c 0x4 0xa4 0x3f 0x30 0x8 0x30 0x2d 0xaf 0xf2 0xad 0xb8 0xac 0x5a 0x1f 0xf2 0x2a 0xc1 0x27 0x47 0x21 0x29 0x22 0xc4 0xa9 0xbf 0xa4 0x18 0xb0 0xed 0xab 0x2f 0xb0 0x3c 0xac 0x68 0xaf 0x3c 0x33 0xd7 0x30 0x26 0xa8 0xc3 0xb3 0x63 0xa4 0xb7 0xa5 0xb1 0xb6 0xb9")
        .write(byteMsg)
      
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
  
  // makeReadOnlyButton.addEventListener("click", async () => {
  //   console.log("User clicked make read-only button");
  
  //   try {
  //     const ndef = new NDEFReader();
  //     await ndef.makeReadOnly();
  //     console.log("> NFC tag has been made permanently read-only");
  //   } catch (error) {
  //     console.log("Argh! " + error);
  //   }
  // });




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