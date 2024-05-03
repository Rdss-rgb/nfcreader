
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
      document.getElementById('output-nfc').innerText=`Serial Number: ${serialNumber} `+`\n`+ `Byte length: ${message.records[0]['data']['byteLength']}`;
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
    if(scanning == true){
      const ndef = new NDEFReader();
      ndef
        .write("Hello World")
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