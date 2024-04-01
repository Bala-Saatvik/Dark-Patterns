import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const { GoogleGenerativeAI } = require("@google/generative-ai");

const Detect = () => {
  const [imageUri, setImageUri] = useState(null);
  const [trueTerms, setTrueTerms] = useState([]);
  const [denote,setDenote]=useState(null);
  const [results, setResults] = useState(null);




  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImageUri(result.assets[0].uri);
        generateContent(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error Picking Image: ", error);
    }
  };

  const checkForTerms = (text) => {
    const urgencyRegex = /\b(urgency|limited time offer)\b/i;
    const scarcityRegex = /\b(scarcity|limited number of items)\b/i;
    const forcedActionRegex = /\b(forced action)\b/i;
    const socialProofRegex = /\b(social proof)\b/i;
    const misdirectionRegex = /\b(misdirection)\b/i;
    const obstructionRegex = /\b(obstruction)\b/i;
    const sneakingRegex = /\b(sneaking)\b/i;

    const termStyles = {
      urgency: urgencyRegex.test(text) ? styles.greenText : styles.redText,
      scarcity: scarcityRegex.test(text) ? styles.greenText : styles.redText,
      forcedAction: forcedActionRegex.test(text) ? styles.greenText : styles.redText,
      socialProof: socialProofRegex.test(text) ? styles.greenText : styles.redText,
      misdirection: misdirectionRegex.test(text) ? styles.greenText : styles.redText,
      obstruction: obstructionRegex.test(text) ? styles.greenText : styles.redText,
      sneaking: sneakingRegex.test(text) ? styles.greenText : styles.redText,
    };

    setResults(termStyles);
    setTrueTerms(Object.keys(termStyles).filter((term) => termStyles[term] === styles.greenText));
    setDenote(trueTerms.length);
    console.log(denote);
  };

  

  const generateContent = async (imageUri) => {
    try {
      const base64Data = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Replace 'YOUR_API_KEY' with the actual API key
      const API_KEY = 'Your API Key';

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });


      const prompt = "Is any dark patterns present in this webpage";

      const result = await model.generateContent([prompt, { inlineData: { data: base64Data, mimeType: 'image/jpeg' } }]);
      const response = await result.response;
      const text = response.text();
      // text = "- Urgency: The website creates a sense of urgency by displaying a limited number of items in stock and a countdown timer. This can pressure users into making a purchase before the item sells out* Social proof:* The website displays the number of people who have viewed and purchased the item.This can create a sense of social proof and pressure users into making a purchase.* Scarcity:* The website displays a limited number of items in stock.This can create a sense of scarcity and pressure users into making a purchase before the item sells out.Limited - time offer:* The website displays a limited - time offer of 10 % off if the user purchases the item within the next 24 hours.This can create a sense of urgency and pressure users into making a purchase.Free shipping:* The website offers free shipping on all orders over $50.This can be a persuasive incentive for users to make a purchase.";
      console.log(text);
      const results = checkForTerms(text);
      console.log(results);
    } catch (error) {
      console.error('Error generating content:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
        />
      )}
      <TouchableOpacity onPress={pickImage} style={[styles.button, { marginBottom: 40 }]}>
        <Text style={styles.buttonText}>Choose an Image</Text>
      </TouchableOpacity>

      {trueTerms.length > 0 ? (
        <View style={styles.resultsContainer}>
          <View className="bg-emerald-200 p-4 rounded-xl space-y-2">
            <View className="flex-row items-center space-x-4">
              <Image className="rounded-ful" source={require('../dpbh/assets/images/bot_f.jpg')} style={{ height: hp(4), width: hp(4) }} />
              <Text style={{ fontSize: wp(4.8) }} className="font-semibold text-gray-700">
                SmartAI DarkPattern Findings
              </Text>
            </View>
            <View className="space-y-3"></View>
            <Text style={{ fontSize: wp(4.8) }} className="text-gray-700 font-medium">
              {trueTerms.join(', ')}
            </Text>
            <View className="space-y-3"></View>
          </View>
        </View>
      ) : (
        <Text style={styles.noPatternsText}>No dark patterns found</Text>
      )}


      
    </ScrollView>
    
  );


};

export default Detect;


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 50,
  },

  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginTop: 20,

  },
  buttonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  greenText: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  redText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  outputtext: {
    fontSize: 16,
    marginBottom: 10,
  },
  address: {
    fontSize: 18,
    marginTop: 30,
    marginBottom: 20,
  },
});
