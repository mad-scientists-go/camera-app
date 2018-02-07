import React from "react";
import Webcam from "react-webcam";
import { connect } from "react-redux"
import { faceAuthWalkIn, kairosWalkOut } from "../store";
//import EnterExit from "./EnterExit";
import SiteCamReact from "../camFunctions/SiteCamReact";

if (process.env.NODE_ENV !== 'production') require('../../secrets')
const Kairos = require("kairos-api");
const client = new Kairos(process.env.KAIROS_ID, process.env.KAIROS_KEY);

class MotionLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      motionDetected: false,
      images: [],
      camMode: true,
      productMode: false
    };
    this.updateFaceAuthImagesForLogin = this.updateFaceAuthImagesForLogin.bind(
      this
    );
    this.handleClick = this.handleClick.bind(this);
    this.handleClickProductMode = this.handleClickProductMode.bind(this);
  }
  // componentDidMount() {
  //   // client
  //   //   .galleryView({ gallery_name: "go-gallery" })
  //   //   .then(res => console.log(res));
  // }

  handleMotionDetection() {
    console.log("motion detected");
    //do captures
    this.capture();
  }

  handleClick() {
    this.setState(prevState => ({
      camMode: !prevState.camMode
    }));
  }

  handleClickProductMode() {
    this.setState(prevState => ({
      productMode: !prevState.productMode
    }));
  }

  setRef = webcam => {
    this.webcam = webcam;
  };

  updateFaceAuthImagesForLogin(pics) {
    pics = pics.map(item => item.src);
    this.recogniz(pics);
    // this.setState({
    // 	images: pics
    // })
  }

  componentDidUpdate(newProp, newState) {
    console.log("updated with 3 pics", newState.images);
  }
  recogniz = pics => {
    // let params = {
    //   image: pics[0],
    //   gallery_name: "go-gallery"
    // };
    //post all three for best match.
    let promiseArr = [];
    pics.map(pic =>
      promiseArr.push(
        client.recognize({
          image: pic,
          gallery_name: "go-gallery-5"
        })
      )
    );
    Promise.all(promiseArr).then(results => {
      console.log("RESULTS", results);
      let removeErrArr = results.filter(arr => arr.body.images);
      console.log("REMOVEARRRRR", removeErrArr);
      let filterArr = removeErrArr.filter(
        arr => arr.body.images[0].transaction.confidence
      );
      console.log("FILTERARR", filterArr);

      //   if (results[0].body.Errors) {
      //     console.log("NO FACES FOUND");
      //     return
      //   }
      // //  results = results.filter(item => item.body.images[0].transaction.confidence)
      //   if (!results[0].body.images[0].transaction.confidence) {
      //     console.log("NO FACE MATCH");
      //     return
      //   } else {
      filterArr = filterArr.map(item => item.body.images[0].transaction);
      let mostProbableUser = { confidence: 0, subject_id: null };
      for (let image of filterArr) {
        if (image.confidence > mostProbableUser.confidence) {
          mostProbableUser.confidence = image.confidence;
          mostProbableUser.subject_id = image.subject_id;
        }
      }
      // TERNARY LOGIC

      if (mostProbableUser.confidence > 0.5 && mostProbableUser.subject_id) {
        // if (this.state.productMode) {
        //   /*productmode need to write thunk*/
        // } else {
          this.state.camMode
            ? this.props.walkInRedux(mostProbableUser.subject_id)
            : this.props.walkOutRedux(mostProbableUser.subject_id);
        // }
      } else if (removeErrArr.length > 0) {
        var utterance = new SpeechSynthesisUtterance(
          "No match found. Please sign up before entering the store or try backing up and entering again"
        );
        window.speechSynthesis.speak(utterance);
      } else {
        var utterance = new SpeechSynthesisUtterance(
          "No faces were detected. Please try backing up and entering again"
        );
        window.speechSynthesis.speak(utterance);
      }
      //}
      // client.recognize(params)
      // .then(res => res.body)
      // .then(res => {
      //     console.log(res)
      //     if (res.images[0].transaction.confidence > 0.8) this.props.login(res.images[0].transaction.subject_id)
      //     else console.log('replace with ui login err')
      // })
      // .catch(err => console.log(err))
    });
    //if at least one image is success or > 90% match let them login.

    //call login thunk and find user based on the returned subjectid
  };

  capture = () => {
    let pics = [this.webcam.getScreenshot()];
    setTimeout(() => {
      pics.push(this.webcam.getScreenshot());
    }, 300);
    setTimeout(() => {
      pics.push(this.webcam.getScreenshot());
      this.recogniz(pics);
    }, 600);
  };

  render() {
    console.log("this.camMode", this.state.camMode);
    return (
      <div>
        <button onClick={this.handleClickProductMode}>
          Product Mode: {`${this.state.productMode}`}
        </button>
        {this.state.productMode ? (
          <div />
        ) : (
          <button onClick={this.handleClick}>
            Mode:
            {this.state.camMode ? `WalkIn Mode` : `WalkOut Mode`}
          </button>
        )}
        <SiteCamReact walkInKairos={this.updateFaceAuthImagesForLogin} />
      </div>
    );
  }
}
const mapDispatch = dispatch => {
  return {
    walkInRedux(subject_id) {
      dispatch(faceAuthWalkIn(subject_id)); //look for this user and log them in.
    },
    walkOutRedux(subject_id) {
      dispatch(kairosWalkOut(subject_id));
    }
  };
};
export default connect(null, mapDispatch)(MotionLogin);
