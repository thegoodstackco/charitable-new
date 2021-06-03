import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import PropTypes from 'prop-types';
import WebView from 'react-native-webview';
// const PUBLIC_KEY = 'pk_live_DmHTyMUeOLRAHEKup7l60Vp2004Z40bLWq';
const declinedRedirectUrl = 'charitable://cardDeclined';
const authSuccessUrl = 'charitable://authSuccess';

const stripeScriptTag = Platform.OS === 'ios' ? '' : 'async';

const PAYMENT_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Charitable Payment</title>
    <meta name="description" content="Stripe Payment" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script type="text/javascript" src="https://js.stripe.com/v3/" ${stripeScriptTag}></script>
    <style>
    PAYMENT_CSS
    </style>
</head>

<body>

  <div class="sr-root">
    <div class="sr-main">
      <div class="sr-result requires-auth">
        <div class="sr-result-container">
          <p>
            Please authenticate your
            <span id="card-brand">CARD_TYPE</span> card ending in
            <span id="last4">CARD_LAST_4_DIGIT</span> to authorize your purchase of
            <span id="order-amount">CUSTOM_AMOUNT</span>.
          </p>
        </div>
        <button id="authenticate">
          <div class="spinner hidden"></div>
          <span class="button-text">Authenticate purchase</span>
        </button>
      </div>
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
docReady(function(event) {
    // Event handler to prompt a customer to authenticate a previously provided card
    document
      .querySelector("#authenticate")
      .addEventListener("click", function(evt) {
        changeLoadingState(true, "#authenticate");
        try {
          stripe
          .confirmCardPayment('CLIENT_SECRET', {
            payment_method: 'PAYMENT_METHOD'
          })
          .then(function(stripeJsResult) {
            alert(JSON.stringify(stripeJsResult.error))
            changeLoadingState(false, "#authenticate");
            if (
              stripeJsResult.error &&
              stripeJsResult.error.code ===
                "payment_intent_authentication_failure"
            ) {
              // Authentication failed -- prompt for a new payment method since this one is failing to authenticate
              // hideEl(".requires-auth");
              window.location = 'declinedRedirectUrl';
              alert('require neww');
            } else if (
              stripeJsResult.paymentIntent &&
              stripeJsResult.paymentIntent.status === "succeeded"
            ) {
              alert('success');
              window.location = 'authSuccessUrl';
            }

          });
        } catch(err) {
          alert(JSON.stringify(err));
        }
    });  
    
    // Show a spinner on button click
    var changeLoadingState = function(isLoading, selector) {
      if (isLoading) {
        document.querySelector(selector).disabled = true;
        document.querySelector(selector + " .spinner").classList.remove("hidden");
        document.querySelector(selector + " .button-text").classList.add("hidden");
      } else {
        document.querySelector(selector).disabled = false;
        document.querySelector(selector + " .spinner").classList.add("hidden");
        document
          .querySelector(selector + " .button-text")
          .classList.remove("hidden");
      }
    };
});
} catch(err) {
// alert(err);
}
`;

const PaymentAuth = (props) => {
  const {
    route: { params: { paymentInfo = null, missionId = null } = {} },
  } = props;
  const [paymentHtml, setPaymentHtml] = useState('');
  const [injectedPaymentScript, setInjectedPaymentScript] = useState('');

  useEffect(() => {
    const paymentDetail = PAYMENT_HTML.replace('PAYMENT_CSS', paymentCSS)
      .replace('CUSTOM_AMOUNT', '$ 3000')
      .replace('CARD_TYPE', 'Visa')
      .replace('CARD_LAST_4_DIGIT', '3453');

    const injectedPayment = injectedJavaScript
      // .replace('PUBLIC_KEY', PUBLIC_KEY)
      .replace(
        'CLIENT_SECRET',
        'pi_1HEUJTAU5Ztqc65w6kfDzEwa_secret_jmzrO21uWmZNoVmysFvsXqSCr',
      )
      .replace('PAYMENT_METHOD', 'pm_1H9RfHAU5Ztqc65w982EA5bD')
      .replace('declinedRedirectUrl', declinedRedirectUrl)
      .replace('authSuccessUrl', authSuccessUrl);

    setPaymentHtml(paymentDetail);
    setInjectedPaymentScript(injectedPayment);
  }, [paymentInfo]);

  const handleResponse = (data) => {
    if (data.url === declinedRedirectUrl) {
      props.navigation.replace('Mission', {
        from: 'payments',
        paymentInfo,
        missionId,
      });
    } else if (data.url === authSuccessUrl) {
      props.navigation.replace('Mission', {
        from: 'payments',
        paymentInfo,
        missionId,
      });
    }
  };

  return (
    <WebView
      originWhitelist={['*']}
      source={{
        html: `${paymentHtml}`,
        baseUrl: 'https://3.137.203.182:8000/',
      }}
      injectedJavaScript={injectedPaymentScript}
      // onNavigationStateChange={(data) => handleResponse(data)}
      style={{
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
      }}
      onMessage={() => {}}
      javaScriptEnabled
      domStorageEnabled
      onNavigationStateChange={(data) => handleResponse(data)}
    />
  );
};

PaymentAuth.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};
export default PaymentAuth;

const paymentCSS = `
/* Variables */
:root {
  --body-color: rgb(247, 250, 252);
  --button-color: rgb(30, 166, 114);
  --accent-color: #0a721b;
  --link-color: #ffffff;
  --font-color: rgb(105, 115, 134);
  --body-font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  --radius: 6px;
  --form-width: 600px;
}

/* Base */
* {
  box-sizing: border-box;
}
body {
  font-family: var(--body-font-family);
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}

/* Layout */
.sr-root {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 980px;
  padding: 48px;
  align-content: center;
  justify-content: center;
  height: auto;
  min-height: 100vh;
  margin: 0 auto;
}
.sr-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  align-self: center;
  padding: 75px 50px;
  background: var(--body-color);
  width: var(--form-width);
  border-radius: var(--radius);
  box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
    0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
}

.sr-field-error {
  color: var(--font-color);
  text-align: left;
  font-size: 13px;
  line-height: 17px;
  margin-top: 12px;
}

/* Inputs */
.sr-input,
input[type="text"] {
  border: 1px solid var(--gray-border);
  border-radius: var(--radius);
  padding: 5px 12px;
  height: 44px;
  width: 100%;
  transition: box-shadow 0.2s ease;
  background: white;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
}
.sr-input:focus,
input[type="text"]:focus,
button:focus,
.focused {
  box-shadow: 0 0 0 1px rgba(50, 151, 211, 0.3), 0 1px 1px 0 rgba(0, 0, 0, 0.07),
    0 0 0 4px rgba(50, 151, 211, 0.3);
  outline: none;
  z-index: 9;
}
.sr-input::placeholder,
input[type="text"]::placeholder {
  color: var(--gray-light);
}
.sr-result {
  -webkit-transition: height 1s ease;
  -moz-transition: height 1s ease;
  -o-transition: height 1s ease;
  transition: height 1s ease;
  color: var(--font-color);
  overflow: auto;
}
.sr-result-container {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.sr-result-container img {
  width: 50px;
  margin-right: 5px;
}
.sr-result.code-preview {
  height: 44px;
}
.sr-result code {
  overflow: scroll;
}
.sr-result.expand {
  height: 350px;
}

.sr-combo-inputs-row {
  border-radius: 7px;
}
label {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 8px;
  display: inline-block;
}

/* Combo inputs */
.sr-combo-inputs {
  display: flex;
  flex-direction: column;
}
.sr-combo-inputs input,
.sr-combo-inputs .sr-select {
  border-radius: 0;
  border-bottom: 0;
}
.sr-combo-inputs > input:first-child,
.sr-combo-inputs > .sr-select:first-child {
  border-radius: var(--radius) var(--radius) 0 0;
}
.sr-combo-inputs > input:last-child,
.sr-combo-inputs > .sr-select:last-child {
  border-radius: 0 0 var(--radius) var(--radius);
  border-bottom: 1px solid var(--gray-border);
}
.sr-combo-inputs > .sr-combo-inputs-row:first-child input:first-child {
  border-radius: var(--radius) 0 0 0;
}
.sr-combo-inputs > .sr-combo-inputs-row:first-child input:last-child {
  border-radius: 0 var(--radius) 0 0;
}
.sr-combo-inputs-row:not(:first-of-type) .sr-input {
  border-radius: 0 0 var(--radius) var(--radius);
}
.sr-combo-inputs-row {
  width: 100%;
}

.sr-combo-inputs-row > input {
  width: 100%;
  border-radius: 0;
}

.sr-combo-inputs-row > input:first-child {
  border-right: 0;
}

.sr-input,
.sr-select,
input[type="text"] {
  border: 1px solid var(--gray-border);
  border-radius: var(--radius);
  padding: 5px 12px;
  height: 44px;
  width: 100%;
  transition: box-shadow 0.2s ease;
  background: white;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
}
.sr-input:focus,
input[type="text"]:focus,
button:focus,
.focused {
  box-shadow: 0 0 0 1px rgba(50, 151, 211, 0.3), 0 1px 1px 0 rgba(0, 0, 0, 0.07),
    0 0 0 4px rgba(50, 151, 211, 0.3);
  outline: none;
  z-index: 9;
}
.sr-input::placeholder,
input[type="text"]::placeholder {
  color: var(--gray-light);
}
/* Select */
.sr-select {
  display: block;
  height: 44px;
  margin: 0;
  background-image: url("../images/chevon-down.svg");
  background-repeat: no-repeat, repeat;
  background-position: right 12px top 50%, 0 0;
  background-size: 0.65em auto, 100%;
  box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
    0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
}
.sr-select::-ms-expand {
  display: none;
}
.sr-select:hover {
  cursor: pointer;
}
.sr-select:focus {
  box-shadow: 0 0 0 1px rgba(50, 151, 211, 0.3), 0 1px 1px 0 rgba(0, 0, 0, 0.07),
    0 0 0 4px rgba(50, 151, 211, 0.3);
  outline: none;
}
.sr-select option {
  font-weight: 400;
}
.sr-select:invalid {
  color: var(--gray-light);
  opacity: 0.4;
}
#card-element {
  background: white;
  padding: 10px;
  margin: 0px 1px;
  box-sizing: border-box;
  box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
    0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
}
/* Buttons and links */
button {
  background: var(--accent-color);
  border-radius: var(--radius);
  color: white;
  border: 0;
  padding: 12px 16px;
  margin-top: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: block;
  box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
  width: 100%;
}
button:hover {
  filter: contrast(115%);
}
button:active {
  transform: translateY(0px) scale(0.98);
  filter: brightness(0.9);
}
button:disabled {
  opacity: 0.5;
  cursor: none;
}

a {
  color: var(--link-color);
  text-decoration: none;
  transition: all 0.2s ease;
}

a:hover {
  filter: brightness(0.8);
}

a:active {
  filter: brightness(0.5);
}

/* Code block */
code,
pre {
  font-family: "SF Mono", "IBM Plex Mono", "Menlo", monospace;
  font-size: 12px;
}

/* Stripe Element placeholder */
.sr-card-element {
  padding-top: 12px;
}

/* Responsiveness */
@media (max-width: 720px) {
  .sr-root {
    flex-direction: column;
    justify-content: flex-start;
    padding: 48px 20px;
    min-width: 320px;
  }

  .sr-header__logo {
    background-position: center;
  }

  .sr-payment-summary {
    text-align: center;
  }

  .sr-content {
    display: none;
  }

  .sr-main {
    width: 100%;
    height: 305px;
    background: rgb(247, 250, 252);
    box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
      0px 2px 5px 0px rgba(50, 50, 93, 0.1),
      0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
    border-radius: 6px;
  }
}

.banner {
  max-width: 825px;
  margin: 0 auto;
  padding: 0 22px;
  font-size: 14px;
  background: white;
  color: #6a7c94;
  border-radius: 22px;
  box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
    0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 15px;
  line-height: 1.15;
  position: absolute;
  bottom: 5vh;
  left: 0;
  right: 0;
  text-align: center;
}

.banner span {
  display: inline-block;
  width: 100%;
}

.banner a {
  color: var(--accent-color);
}

/* todo: spinner/processing state, errors, animations */

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
  background: var(--accent-color);
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
  background: var(--accent-color);
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

/* Animated form */

.sr-root {
  animation: 0.4s form-in;
  animation-fill-mode: both;
  animation-timing-function: ease;
}

.hidden {
  display: none;
}

@keyframes field-in {
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.95);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
}

@keyframes form-in {
  0% {
    opacity: 0;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
`;
