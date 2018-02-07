import React from "react";
import Webcam from "react-webcam";
if (process.env.NODE_ENV !== 'production') require('../secrets')
const Kairos = require("kairos-api");
const client = new Kairos(process.env.KAIROS_ID, process.env.KAIROS_KEY);


import VoicePlayerDemo from "./VoiceDemo.js"

export default class WebcamCapture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: []
    };
    this.sendToKairos = this.sendToKairos.bind(this);
    this.recogniz = this.recogniz.bind(this);
  }
  componentDidMount() {
    client
      .galleryView({ gallery_name: "gallerytest1" })
      .then(res => console.log('gallery', res));

  }
  setRef = webcam => {
    this.webcam = webcam;
  };
  sendToKairos = image => {
    this.setState({ images: [image] });
    let params = {
      image: image,
      subject_id: "John Legend",
      gallery_name: "gallerytest1",
      selector: "SETPOSE"
    };
    client.enroll(params).then(res =>  console.log('inituser', res)
  );
  };
  recogniz = image => {
    let params = {
      image: image,
      subject_id: "John Legend",
      gallery_name: "gallerytest1",
      selector: "SETPOSE"
    };
    client.recognize(params).then(res => {
      console.log('match', res)


// var voices = window.speechSynthesis.getVoices()
// console.log('voices', voices)
      var utterance = new SpeechSynthesisUtterance('Hello ' + res.body.images[0].transaction.subject_id  + ' , welcome to the store');
      window.speechSynthesis.speak(utterance);

    }
  );
  };
  capture = () => {
    let pic = this.webcam.getScreenshot();
    console.log(pic, 'this is the pic')
    this.setState({ images: [...this.state.images, pic] });

    setTimeout(() => {
      let pic = this.webcam.getScreenshot();
      this.setState({ images: [...this.state.images, pic] });
    }, 600);
    setTimeout(() => {
      let pic = this.webcam.getScreenshot();
      this.setState({ images: [...this.state.images, pic] });
    }, 900);
  };

  render() {
    return (
      <div>
        <Webcam
          audio={false}
          height={350}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={350}
        />
        <button onClick={this.capture}>Capture photo</button>
        {this.state.images &&
          this.state.images.map(image => {
            return (
              <div>
                <div
                  key={Math.random()}
                  onClick={() => this.sendToKairos(image)}
                >
                  <img src={image} />
                </div>
                <button onClick={() => this.recogniz(image)} />
              </div>
            );
          })}
        {/* <VoicePlayerDemo /> */}
      </div>
    );
  }
}
