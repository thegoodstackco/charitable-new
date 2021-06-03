import React from 'react';
import { Platform } from 'react-native';
import WebView from 'react-native-webview';
// import
// const paymentHtml = require('./payment.html');

const stripeScriptTag = Platform.OS === 'ios' ? '' : 'async';
const paymentHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Charitable Payment</title>
    <meta name="description" content="Stripe Payment" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script type="text/javascript" src="https://js.stripe.com/v3/" ${stripeScriptTag}></script>
    <style>
    ${paymentCSS}
    </style>
</head>

<body>
    <div class="sr-root">
        <div class="sr-main">
            <form id="payment-form" class="sr-payment-form">
                <div id="card-element">
                    <!-- Elements will create input elements here -->
                </div>
                <div id="card-errors" role="alert"></div>
                <button id="submit">
                    <div class="spinner hidden" id="spinner"></div>
                    <span id="button-text">Pay</span><span id="order-amount"></span>
                </button>
            </form>
        </div>
    </div>
</body>
</html>
`;

const injectedJavaScript = `
try {
function docReady(fn) {
  // see if DOM is already available
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    // call on next available tick
    setTimeout(fn, 0);
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

var stripe = Stripe('pk_live_DmHTyMUeOLRAHEKup7l60Vp2004Z40bLWq');
var elements = stripe.elements();
docReady(function(event) {
  var style = {
    base: {
      color: "#32325d",
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#32325d"
      }
    },
    invalid: {
      fontFamily: 'Arial, sans-serif',
      color: "#fa755a",
      iconColor: "#fa755a"
    }
  };

  var card = elements.create("card", { style: style, hidePostalCode: true });
  card.mount("#card-element");

  card.on('change', function(event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });
  var form = document.getElementById('payment-form');
  form.addEventListener('submit', function(ev) {
    ev.preventDefault();
    try {
    stripe.confirmCardPayment('pi_1H1mWrAU5Ztqc65wss7vIvWN_secret_cq26b9sRZE8axrA2Or68bz9gj', {
      payment_method: {
        card: card,
      }
    }).then(function(result) {
      if (result.error) {
        alert(JSON.stringify(result));

        // Show error to your customer (e.g., insufficient funds)
        console.log(result.error.message);
      } else {
        // The payment has been processed!
        alert('succeeeeee');
        if (result.paymentIntent.status === 'succeeded') {
          // Show a success message to your customer
          // There's a risk of the customer closing the window before callback
          // execution. Set up a webhook or plugin to listen for the
          // payment_intent.succeeded event that handles any business critical
          // post-payment actions.
        }
      }
    }).catch(function(err) {
      alert('failure');
    });
  } catch(err) {
    alert('waste');
  }
  });

})
} catch(err) {
alert(err);
}
`;

const CustomCardScreen = () => (
  <WebView
    originWhitelist={['*']}
    source={{
      html: `${paymentHtml}`,
      baseUrl: 'https://3.137.203.182:8000/',
    }}
    injectedJavaScript={injectedJavaScript}
    // onNavigationStateChange={(data) => handleResponse(data)}
    style={{
      height: '100%',
      width: '100%',
      resizeMode: 'contain',
    }}
    onMessage={() => {}}
    javaScriptEnabled
    domStorageEnabled
  />
);

CustomCardScreen.propTypes = {};
export default CustomCardScreen;

const paymentCSS = `/* Variables */
* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  display: flex;
  justify-content: center;
  align-content: center;
  height: 100vh;
  width: 100vw;
}

form {
  width: 30vw;
  min-width: 500px;
  align-self: center;
  box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
    0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
  border-radius: 7px;
  padding: 40px;
}

input {
  border-radius: 6px;
  margin-bottom: 6px;
  padding: 12px;
  border: 1px solid rgba(50, 50, 93, 0.1);
  height: 44px;
  font-size: 16px;
  width: 100%;
  background: white;
}

.result-message {
  line-height: 22px;
  font-size: 16px;
}

.result-message a {
  color: rgb(89, 111, 214);
  font-weight: 600;
  text-decoration: none;
}

.hidden {
  display: none;
}

#card-error {
  color: rgb(105, 115, 134);
  text-align: left;
  font-size: 13px;
  line-height: 17px;
  margin-top: 12px;
}

#card-element {
  border-radius: 4px 4px 0 0 ;
  padding: 12px;
  border: 1px solid rgba(50, 50, 93, 0.1);
  height: 44px;
  width: 100%;
  background: white;
}

#payment-request-button {
  margin-bottom: 32px;
}

/* Buttons and links */
button {
  background: #5469d4;
  color: #ffffff;
  font-family: Arial, sans-serif;
  border-radius: 0 0 4px 4px;
  border: 0;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: block;
  transition: all 0.2s ease;
  box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
  width: 100%;
}
button:hover {
  filter: contrast(115%);
}
button:disabled {
  opacity: 0.5;
  cursor: default;
}

/* spinner/processing state, errors */
.spinner,
.spinner:before,
.spinner:after {
  border-radius: 50%;
}
.spinner {
  color: #ffffff;
  font-size: 22px;
  text-indent: -99999px;
  margin: 0px auto;
  position: relative;
  width: 20px;
  height: 20px;
  box-shadow: inset 0 0 0 2px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}
.spinner:before,
.spinner:after {
  position: absolute;
  content: "";
}
.spinner:before {
  width: 10.4px;
  height: 20.4px;
  background: #5469d4;
  border-radius: 20.4px 0 0 20.4px;
  top: -0.2px;
  left: -0.2px;
  -webkit-transform-origin: 10.4px 10.2px;
  transform-origin: 10.4px 10.2px;
  -webkit-animation: loading 2s infinite ease 1.5s;
  animation: loading 2s infinite ease 1.5s;
}
.spinner:after {
  width: 10.4px;
  height: 10.2px;
  background: #5469d4;
  border-radius: 0 10.2px 10.2px 0;
  top: -0.1px;
  left: 10.2px;
  -webkit-transform-origin: 0px 10.2px;
  transform-origin: 0px 10.2px;
  -webkit-animation: loading 2s infinite ease;
  animation: loading 2s infinite ease;
}

@-webkit-keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes loading {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@media only screen and (max-width: 600px) {
  form {
    width: 80vw;
  }
}
`;
