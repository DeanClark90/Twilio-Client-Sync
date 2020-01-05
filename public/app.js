const device = new Twilio.Device();
let syncClient;
window.onload = function initalize() {
  getSyncToken();
  getClientToken();
}

//Fetch client token and register callbacks
function getClientToken() {
  fetch('URL_TO_FETCH_CLIENT_TOKEN')
    .then(
      function (response) {
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' +
            response.status);
          return;
        }
        response.json()
          .then(function (data) {
            console.log(data);
            if (!device.isInitialized) {
              registerClient(data.token);
              registerClientCallbacks();
            } else {
              registerClient(data.token);
            }
          });
      }
    ) 
    .catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
}

function registerClient(token) {
  device.setup(token, {
    closeProtection: "Don't reload",
    enableRingingState: true,
    dscp: true,
    codecPreferences: ['opus', 'pcmu']
  });
}

function registerClientCallbacks() {
  
  device.on('ready', function (device) {
    setSoftPhoneDisplay(false,false);
    createMap();
    keypad.addEventListener('click', buttonPress); 
  });

  device.on('error', function (error) {
    setSoftPhoneDisplay(false,false);
    console.log('Twilio.Device Error: ' + error.message);
  });

  device.on('error', function(err){
    console.log(err);
  })

  device.on('connect', function (conn) {
    setSoftPhoneDisplay(true,false);
    console.log(conn)
    console.log("connection stastus", conn._status);
  });

  device.on('offline', function (device) {
    setSoftPhoneDisplay(false,false);
    getClientToken();
  });

  device.on('disconnect', function (conn) {
    setSoftPhoneDisplay(false,false);
  });

  device.on('incoming', function (conn) { 
    conn.accept();
  });
}

//Call controls
function callControls(e){
  let element = e.target.parentElement.id;
  if( element === 'btn-mute') {
    console.log("Mute call - Not implemented")
  } else if (element === 'btn-dialpad') {
    setSoftPhoneDisplay(true,true);
  } else if (element === 'btn-hold') {
    console.log("Hold Call - Not implemented")
  } else if (element === 'btn-conference') {
    console.log("Conference - Not implemented")
  } else if (element === 'btn-transfer') {
    console.log("Transfer Call - Not implemented")
  }
}

//on click event handler to initate/disconnect call
function dial(e) {
  let element = e.target.parentElement.id;
  if (element === 'btn-dial') {
    device.connect(
      {
        To: number.value
      }
    )
  } else if (element === 'btn-hangup') {
    device.disconnectAll();
  } else if (element === 'btn-close'){
    setSoftPhoneDisplay(true,false);
  }
}

//Handle dialpad on click events
function buttonPress(e) {
  const number = document.querySelector('#number');
  for (let element of e.target.childNodes) {
    if (element.parentElement.classList.contains('btn-number')) {
      const digit = element.parentElement.childNodes[0].data;
      if (!device.activeConnection()) {
        (number.value) ? number.value += digit: number.value = "+" + digit;
      } else {
        device.activeConnection()
          .sendDigits(digit);
      }
    } 
    e.preventDefault();
    return
  };
}

//Set soft phone-display
function setSoftPhoneDisplay(isConnected, isKeypad){
  
  const keypad = document.querySelector('#keypad');
  const callBtns = document.querySelector('#call-buttons');
  const controlBtns = document.querySelector('#call-control');
  const connectBtn = document.querySelector('#btn-dial');
  const disconnectBtn = document.querySelector('#btn-hangup');
  const closeBtn = document.querySelector('#btn-close');
  
  if (isConnected & !isKeypad){
    keypad.style.display = 'none';
    connectBtn.style.display = 'none';
    controlBtns.style.display = 'block';
    disconnectBtn.style.display = 'inline-block';
    closeBtn.style.display = 'none';
    controlBtns.addEventListener('click', callControls);
  } else if(isConnected & isKeypad){
    keypad.style.display = 'block'
    controlBtns.style.display = 'none';
    closeBtn.style.display = 'inline-block';
    disconnectBtn.style.display = 'none';
  } else{
    keypad.style.display = 'block';
    controlBtns.style.display = 'none';
    connectBtn.style.display = 'inline-block';
    disconnectBtn.style.display = 'none';
    closeBtn.style.display = 'none';
    callBtns.addEventListener('click', dial);
  }

}

//Fetch Sync token and register sync client
function getSyncToken(){
  fetch('URL_TO_FETCH_SYNC_TOKEN')
  .then(
    function (response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        return;
      }
      response.json()
        .then(function (data) {
          console.log(data)
          registerSyncClient(data.token);
        });
    }
  ) 
  .catch(function (err) {
    console.log(err);
  });
}

function registerSyncClient(token) {
  syncClient = new Twilio.Sync.Client(token, {
    logLevel: 'debug'
  });
  console.log(syncClient)
}


//Create sync and register event listener
function createMap(){
  syncClient.map("ActiveCall")
    .then(function(map){
      console.log(map)
      map.on('itemUpdated', function(event){
        map.get('Call').then(function(call){
          console.log(call.descriptor.data)
          console.log("Child Call Status: ", call.descriptor.data.ChildCall.status)
        })
      })
    })
}