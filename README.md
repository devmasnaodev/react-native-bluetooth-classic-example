# Projeto de Exemplo - React Native Bluetooth Classic com Expo

Este é um projeto de exemplo que demonstra o uso da biblioteca [`react-native-bluetooth-classic`](https://github.com/kenjdavidson/react-native-bluetooth-classic) em um ambiente **Expo**. Ele fornece uma base para facilitar a compreensão do funcionamento da biblioteca, incluindo gerenciamento de permissões, busca de dispositivos Bluetooth, conexão, envio e recebimento de dados.

## 🚀 Tecnologias Utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [react-native-bluetooth-classic](https://github.com/kenjdavidson/react-native-bluetooth-classic)
- [TypeScript](https://www.typescriptlang.org/)

## 📋 Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- **Node.js** (versão recomendada: 16+)
- **Expo CLI** (`npm install -g expo-cli`)
- **Dispositivo ou emulador Android**

⚠️ **Importante:** A biblioteca `react-native-bluetooth-classic` não é compatível com o Expo Go. É necessário utilizar o **Expo Dev Client** ou ejectar para Bare Workflow.

## 📂 Estrutura do Projeto

1. Clone o repositório:

```sh
git clone https://github.com/seu-usuario/meu-projeto.git
cd bluetooth-classic
```

2. Instala as dependências

```sh
npm install
```

3. Instale o Expo Dev Client (caso ainda não tenha):

```sh
npx expo install expo-dev-client
```

4. Faça a pré-build para executar localmente

```sh
npx expo prebuild
```

5. Execute o projeto no seu dispositivo android.

```sh
npx expo run:android
```

⚠️ Para testes de Bluetooth utilize um dispositivo físico, ative o Modo Desenvolvedor e Depuração USB.

### 📱 Funcionalidades Implementadas

- ✅ Gerenciamento de permissões (Localização e Bluetooth)
- ✅ Busca de dispositivos Bluetooth Classic
- ✅ Conexão com um dispositivo selecionado
- ✅ Envio e recebimento de mensagens via Bluetooth
- ✅ Desconexão do dispositivo
