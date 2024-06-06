This is a [**React Native**](https://reactnative.dev) project of a dApp example for deep-link transaction signing through Petra mobile app, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding. You can also [mise-en-place](https://github.com/jdx/mise) to easily setup your development environment.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
yarn android
```

### For iOS

```bash
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Get the Petra Mobile App

Download the Petra mobile app from the [App Store](https://apps.apple.com/us/app/petra-wallet/id6446259840) or [Google Play Store](https://play.google.com/store/apps/details?id=com.aptoslabs.petra.wallet) to interact with the dApp example. Follow the app instructions to create a new wallet or import an existing one. For testing, switch to the `Testnet` network in the app settings and request testnet tokens from the faucet.

<div>
  <img alt="Android download Petra mobile app" width="49%" src="docs/assets/android-download-petra-mobile-app.gif">
  <img alt="iOS download Petra mobile app" width="49%" src="docs/assets/ios-download-petra-mobile-app.gif">
</div>

## Step 4: Testing the dApp Example

### Connect

Open the dApp example in your emulator/simulator and click the `Connect` button. Note that only the `Connect` button will be enabled on the screen, while the `Disconnect` and `Sign and Submit Transaction with Petra` buttons will be disabled. This will prompt the Petra mobile app to approve the connection. Approve the connection to proceed, and Petra will redirect you back to the dApp example. Now, the `Disconnect` and `Sign and Submit Transaction with Petra` buttons will be enabled, while the `Connect` button will be disabled.

<div>
  <img alt="Android connect" width="49%" src="docs/assets/android-connect.gif">
  <img alt="iOS connect" width="49%" src="docs/assets/ios-connect.gif">
</div>

### Sign and Submit Transaction with Petra

Click on `Sign and Submit Transaction with Petra`. This will prompt the Petra mobile app to approve a transaction. The transaction involves a simple transfer of 0.1 APT to the address `0xb693adc2b70c693019217e95b539a7a3fdd92a033dc491745c0d3ec464807fb1`. You will notice the balance decrease to 0.9 APT, and an activity will be added to the list of activities.
<div>
  <img alt="Android sign and submit transaction with Petra" width="49%" src="docs/assets/android-sign-and-submit-transaction-with-petra.gif">
  <img alt="iOS sign and submit transaction with Petra" width="49%" src="docs/assets/ios-sign-and-submit-transaction-with-petra.gif">
</div>

### Disconnect

Click on the `Disconnect` button to disconnect the dApp example from the Petra mobile app. This will quickly redirect you to Petra, then back to the initial screen where the `Connect` button will be enabled, and the `Disconnect` and `Sign and Submit Transaction with Petra` buttons will be disabled.

<div>
  <img alt="Android disconnect" width="49%" src="docs/assets/android-disconnect.gif">
  <img alt="iOS disconnect" width="49%" src="docs/assets/ios-disconnect.gif">
</div>

## Congratulations! :tada:

You've successfully run and tested a dApp that signs transactions through Petra. :partying_face:

### Now what?

- You can fork this repository and build your own dApp.
- You can read through the code to understand how to integrate Petra into your own existing dApp. Start by looking at the `App.tsx` file.

# Learn More

To learn more about deep-linking to mobile app, [take a look at our documentation](https://petra.app/docs/mobile-deeplinks).
