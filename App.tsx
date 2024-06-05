/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {PropsWithChildren, useEffect, useState} from 'react';
import {
  Button,
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import nacl from 'tweetnacl';
import {Buffer} from 'buffer';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const APP_INFO = {
  domain: 'https://mobile2mobile-example.petra.app',
  name: 'mobile2mobile-example',
};

const DAPP_LINK_BASE = 'mobile2mobile-example:///api/v1';
const PETRA_LINK_BASE = 'petra:///api/v1';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [secretKey, setSecretKey] = useState<Uint8Array | null>(null);
  const [publicKey, setPublicKey] = useState<Uint8Array | null>(null);
  const [sharedPublicKey, setSharedPublicKey] = useState<Uint8Array | null>(
    null,
  );

  const generateAndSaveKeyPair = () => {
    const keyPair = nacl.box.keyPair();

    setSecretKey(keyPair.secretKey);
    setPublicKey(keyPair.publicKey);

    return keyPair;
  };

  const connect = async () => {
    const keyPair = generateAndSaveKeyPair();

    const data = {
      appInfo: APP_INFO,
      redirectLink: `${DAPP_LINK_BASE}/connect`,
      dappEncryptionPublicKey: Buffer.from(keyPair.publicKey).toString('hex'),
    };

    await Linking.openURL(
      `${PETRA_LINK_BASE}/connect?data=${btoa(JSON.stringify(data))}`,
    );
  };

  const disconnect = () => {
    if (!publicKey) {
      throw new Error('Missing public key');
    }

    const data = {
      appInfo: APP_INFO,
      redirectLink: `${DAPP_LINK_BASE}/disconnect`,
      dappEncryptionPublicKey: Buffer.from(publicKey).toString('hex'),
    };

    Linking.openURL(
      `${PETRA_LINK_BASE}/disconnect?data=${btoa(JSON.stringify(data))}`,
    );

    setSecretKey(null);
    setPublicKey(null);
    setSharedPublicKey(null);
  };

  const signAndSubmitTransaction = () => {
    if (!sharedPublicKey) {
      throw new Error('Missing shared public key');
    }

    if (!publicKey) {
      throw new Error('Missing public key');
    }

    const payload = btoa(
      JSON.stringify({
        arguments: [
          '0x0000000000000000000000000000000000000000000000000000000000000001',
          10000000, // 0.1 APT
        ],
        function: '0x1::coin::transfer',
        type: 'entry_function_payload',
        type_arguments: ['0x1::aptos_coin::AptosCoin'],
      }),
    );

    const nonce = nacl.randomBytes(24);

    const encryptedPayload = nacl.box.after(
      Buffer.from(JSON.stringify(payload)),
      nonce,
      sharedPublicKey,
    );

    const data = btoa(
      JSON.stringify({
        appInfo: APP_INFO,
        payload: Buffer.from(encryptedPayload).toString('hex'),
        redirectLink: `${DAPP_LINK_BASE}/response`,
        dappEncryptionPublicKey: Buffer.from(publicKey).toString('hex'),
        nonce: Buffer.from(nonce).toString('hex'),
      }),
    );

    Linking.openURL(`${PETRA_LINK_BASE}/signAndSubmit?data=${data}`);
  };

  useEffect(() => {
    const handleConnectionApproval = (data: string | null) => {
      if (data === null) {
        throw new Error('Missing data from Petra response');
      }

      if (!secretKey) {
        throw new Error('Missing key pair');
      }

      const {petraPublicEncryptedKey} = JSON.parse(atob(data));

      const sharedEncryptionSecretKey = nacl.box.before(
        Buffer.from(petraPublicEncryptedKey.slice(2), 'hex'),
        secretKey,
      );
      setSharedPublicKey(sharedEncryptionSecretKey);
    };

    const handleConnectionRejection = () => {
      // TODO: Handle rejection
    };

    const handleConnection = (params: URLSearchParams) => {
      if (params.get('response') === 'approved') {
        handleConnectionApproval(params.get('data'));
      } else {
        handleConnectionRejection();
      }
    };

    const handleUrl = (url: string | null) => {
      if (!url) {
        return;
      }

      const urlObject = new URL(url);
      const params = new URLSearchParams(urlObject.search);

      switch (urlObject.pathname) {
        case '/api/v1/connect': {
          handleConnection(params);
          break;
        }
        default:
          break;
      }
    };

    Linking.getInitialURL().then(handleUrl);

    Linking.addEventListener('url', ({url}) => handleUrl(url));

    return () => {
      Linking.removeAllListeners('url');
    };
  }, [secretKey]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Connect to Petra">
            This Feature allows the dapp to connect to the petra wallet. If the
            Petra Wallet is already connected then it will invoke the redirect
            link without any further action needed from the user of the petra
            wallet.
            <Button
              title="Connect"
              onPress={connect}
              disabled={!!sharedPublicKey}
            />
          </Section>
          <Section title="Disconnect to Petra">
            This Feature allows the dapp to disconnect to the petra wallet. If
            the Petra Wallet is already disconnected then it will invoke the
            redirect link without any further action needed from the user of the
            petra wallet.
            <Button
              title="Disconnect"
              onPress={disconnect}
              disabled={!sharedPublicKey}
            />
          </Section>
          <Section title="Sign and Submit Transaction with Petra">
            This feature allows you to send a transaction to sign and submit
            directly to the petra wallet. If the Petra Wallet is not connect it
            will prompt the petra user to connect their wallet before signing
            and submitting transaction.
            <Button
              title="Sign and Submit Transaction"
              onPress={signAndSubmitTransaction}
              disabled={!sharedPublicKey}
            />
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
