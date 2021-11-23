const manifestUri2 = 'https://wvm.ezdrm.com/demo/dash/BigBuckBunny_320x180.mpd';//licenseServerPR2 licensServerWDV2 
    
const licenseServerWDV2 = 'https://widevine-dash.ezdrm.com/widevine-php/widevine-foreignkey.php?pX=B03B45';
const licenseServerPR2 = 'https://playready.ezdrm.com/cency/preauth.aspx?pX=E0183F';

function initApp() {
  // Install built-in polyfills to patch browser incompatibilities.
  shaka.polyfill.installAll();

  // Check to see if the browser supports the basic APIs Shaka needs.
  if (shaka.Player.isBrowserSupported()) {
    // Everything looks good!
    initPlayer();
  } else {
    // This browser does not have the minimum set of APIs we need.
    console.error('Browser not supported!');
  }
}

async function initPlayer() {
  // Create a Player instance.
  const video = document.getElementById('video');
  const player = new shaka.Player(video);

  // Attach player to the window to make it easy to access in the JS console.
  window.player = player;

  // Listen for error events.
  player.addEventListener('error', onErrorEvent);
  
  player.configure('streaming.jumpLargeGaps', true);
  player.configure({
    drm: {
      servers: { 
      'com.microsoft.playready' : licenseServerPR2 }
    }
  });
    /*
    // Asynchronous Credentials
    player.getNetworkingEngine().registerRequestFilter(function(type, request) {
    // Only add headers to license requests:
    if (type != shaka.net.NetworkingEngine.RequestType.LICENSE) return;

    // If we already know the token, attach it right away:
    if (authToken) {
      console.log('Have auth token, attaching to license request.');
      request.headers['X-AxDRM-Message'] = authToken13;
      return;
    }

    console.log('Need auth token.');
    // Start an asynchronous request, and return a Promise chain based on that.
    const authRequest = {
      uris: [authTokenServer],
      method: 'POST',
    };
    const requestType = shaka.net.NetworkingEngine.RequestType.APP;
    return player.getNetworkingEngine().request(requestType, authRequest)
        .promise.then(function(response) {
          // This endpoint responds with the value we should use in the header.
          authToken = shaka.util.StringUtils.fromUTF8(response.data);
          console.log('Received auth token', authToken);
          request.headers['X-AxDRM-Message'] = authToken;
          console.log('License request can now continue.');
        });
  });
  */
  // -- Asynchronous Credentials --
    
    
   /*// Parameter Autentication
  
    player.getNetworkingEngine().registerRequestFilter(function(type, request) {
    // Only add headers to license requests:
    if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
      // This is the specific parameter name and value the server wants:
      // Note that all network requests can have multiple URIs (for fallback),
      // and therefore this is an array. But there should only be one license
      // server URI in this tutorial.
      request.uris[0] += '?hdnts=st=1617623606~exp=1625399605~acl=/*~hmac=bc48fe38145c340c4af72798c039e5a3513bd60e6cacb4c8017fe397ec4425c7';
    }
  });
  
  // -- Parameter Autentication -- */
  
  /*
  //License Wrapping
  
  player.getNetworkingEngine().registerRequestFilter(function(type, request) {
    // Alias some utilities provided by the library.
    const StringUtils = shaka.util.StringUtils;
    const Uint8ArrayUtils = shaka.util.Uint8ArrayUtils;

    // Only manipulate license requests:
    if (type == shaka.net.NetworkingEngine.RequestType.LICENSE) {
      // Create the wrapped request structure.
      const wrapped = {};

      // Encode the raw license request in base64.
      // The server we are using in this tutorial expects this field and this
      // encoding for the raw request.
      wrapped.rawLicenseRequestBase64 =
          Uint8ArrayUtils.toBase64(new Uint8Array(request.body));

      // Add whatever else we want to communicate to the server.
      // None of these values are read by the server we are using in this
      // tutorial.
      // In practice, you would send what the server needs and the server would
      // react to it.
      wrapped.favoriteColor = 'blue';
      wrapped.Beatles = ['John', 'Paul', 'George', 'Ringo'];
      wrapped.bestBeatleIndex = 1;  // Paul, of course.
      wrapped.pEqualsNP = false;  // maybe?

      // Encode the wrapped request as JSON.
      const wrappedJson = JSON.stringify(wrapped);
      // Convert the JSON string back into an ArrayBuffer to replace the request
      // body.
      request.body = StringUtils.toUTF8(wrappedJson);
    }
  });
  
  */
  

  // Try to load a manifest.
  // This is an asynchronous process.
  try {
    await player.load(manifestUri2);
    // This runs if the asynchronous load is successful.
    console.log('The video has now been loaded!');
  } catch (e) {
    // onError is executed if the asynchronous load fails.
    onError(e);
  }
}

function onErrorEvent(event) {
  // Extract the shaka.util.Error object from the event.
  onError(event.detail);
}

function onError(error) {
  // Log the error.
  console.error('Error code', error.code, 'object', error);
}

document.addEventListener('DOMContentLoaded', initApp);
