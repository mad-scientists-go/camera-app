import React, {Component} from 'react';
import DifCamEngine from './difEngine';
import ImageGrid from '../components/ImageGrid';
import { Grid, Image } from 'semantic-ui-react';
// const keys =  require('../../secrets');
if (process.env.NODE_ENV !== 'production') require('../../secrets')
const Kairos = require("kairos-api");
const client = new Kairos(process.env.KAIROS_ID, process.env.KAIROS_KEY);
export default class SiteCamReact extends Component {
  constructor(props) {
      super(props)
      this.state = {
          bestImages: [],
            disabled: false,
            btnClass: 'start',
            video: '',
            motion: '',
            motionScore: 0,
            history: [],
          status: 'disabled',
          motionScoreText: ''
      }
      this.Camera = DifCamEngine()
      this.init = this.init.bind(this)
      this.initSuccess = this.initSuccess.bind(this)
      this.toggleStreaming = this.toggleStreaming.bind(this)
      this.stopStreaming = this.stopStreaming.bind(this)
      this.startStreaming = this.startStreaming.bind(this)
      this.checkCapture = this.checkCapture.bind(this)
      this.stopConsidering = this.stopConsidering.bind(this)
      this.startChilling = this.startChilling.bind(this)
      this.stopChilling = this.stopChilling.bind(this)
      this.commit = this.commit.bind(this)
      this.stopConsideringTimeout = 0
      this.stopChillingTimeout = 0
      this.chillTime = 0
      this.considerTime = 10
      this.historyMax = 30
      this.bestCapture = undefined
  }
//tweaks is submit nums for cam diff
componentDidMount(){
  this.init()
}

init() {
  // make sure we're on https when in prod

  //let DiffCamEngine = DifCamEngine()
  var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  if (!isLocal && window.location.protocol === 'http:') {
      var secureHref = window.location.href.replace(/^http/, 'https');
      window.location.href = secureHref;

  }

  // don't want console logs from adapter.js
  adapter.disableLog(true);

  this.setState({status: 'disabled'})
  const vid = this.videoElement
  const motionCanvasEl = this.motionCanvas
  //const successInit
  this.Camera.init({
      video: vid,
      motionCanvas: motionCanvasEl,
      initSuccessCallback: this.initSuccess,
      startCompleteCallback: this.startStreaming,
      captureCallback: this.checkCapture
  });
}

initSuccess() {
  //setTweakInputs();
  // this.toggleBtn
  //     .on('click', this.toggleStreaming);
 // $tweaks
      // .on('submit', getTweakInputs)
      // .find('input').prop('disabled', false);
}

toggleStreaming() {
  console.log("started")
  if(!this.state.bestImages.length < 2) {
    console.log("inside first if", this.state.status)
    if (this.state.status === 'disabled' || this.state.status === 'watching') {
      // this will turn around and call startStreaming() on success
      this.Camera.start();
      console.log("started inside cam")
  } }
  else {
      this.stopStreaming();
      console.log("stopped from toggle")
  }
}

startStreaming() {
  this.startChilling();
  this.setState({btnClass: 'stop'})
}

stopStreaming() {
    this.Camera.stop();
    console.log("stopped from stopStream")
  clearTimeout(this.stopConsideringTimeout);
  clearTimeout(this.stopChillingTimeout);
  this.setState({status: 'disabled'});
  this.bestCapture = undefined;

  this.setState({motionScoreText: ''})
  this.setState({btnClass: 'start'})

}

checkCapture(capture) {
  this.setState({motionScoreText: capture.score})

  if (this.state.status === 'watching' && capture.hasMotion) {
      // this diff is good enough to start a consideration time window

    this.setState({status: 'considering'});
   this.bestCapture = capture;
      //picArray.push(this.bestCapture.getURL());
      this.stopConsideringTimeout = setTimeout(this.stopConsidering, this.considerTime);
  } else if (this.state.status === 'considering' && capture.score > this.bestCapture.score) {
      // this is the new this.best diff for this consideration time window
      this.bestCapture = capture;
  }
}

stopConsidering() {
  this.commit();
  this.startChilling();
}

startChilling() {
  this.setState({status: 'chilling'});
  this.stopChillingTimeout = setTimeout(this.stopChilling, this.chillTime);
}

stopChilling() {
  this.setState({status: 'watching'});
}

commit() {
  // prep values
  var bestCaptureUrl = this.bestCapture.getURL();
  var src = bestCaptureUrl;
  var time = new Date().toLocaleTimeString().toLowerCase();
  var score = this.bestCapture.score;
  // load html from template
  // var html = this.historyDiv.innerHTML;
  // var $newHistoryItem = $(html);

  // set values and add to page
  if (score > 300) {
  let fakeStatePics = this.state.bestImages.slice();
    fakeStatePics.push({src: src, time: time, score: score})
    this.setState({bestImages: fakeStatePics})
  }
  if (this.state.bestImages.length > 2) {
    //this.Camera.stop()
    this.stopStreaming()
    this.props.walkInKairos(this.state.bestImages)
    this.setState({bestImages: [], status: 'disabled'})
    console.log(this.state.status, 'checkstat')
    setTimeout(this.toggleStreaming, 5000)
  }
  this.bestCapture = undefined;
}

  render () {
    return (
      <div>
         <button className={this.state.btnClass} disabled={this.state.disabled} ref={(toggleBtn) => this.toggleBtn = toggleBtn} onClick={ this.toggleStreaming}>PLAY</button>
{/*
          <div>

              <form className="tweaks">
                  <label>
                      Pixel Diff Threshold
              <input id="pixel-diff-threshold" type="number" min="0" max="255" disabled />
                  </label>
                  <label>
                      Score Threshold
              <input id="score-threshold" type="number" min="0" disabled />
                  </label>

                  <input type="submit" tab-index="-1" className="submit-tweaks" disabled />
              </form>
          </div> */}

          {/* <div>
              <div className="status"></div>
              <div className="progress">
                  <div className="meter"></div>
              </div>
          </div> */}

          <div className="feedback">
              <figure>
                  <video className="video" ref={(video) => this.videoElement = video}></video>
                  <figcaption>Live Stream</figcaption>
              </figure>
              <figure>
                  <canvas className="motion" ref={(canvas) => this.motionCanvas = canvas}></canvas>
                  <figcaption>
                      Motion Heatmap
              <span className="motion-score"></span>
                  </figcaption>
              </figure>
          </div>

          <div className="history">
          </div>
          <Grid id="history-item-template" ref={(hist) => this.historyDiv = hist}>
        <Grid.Row padded="true" columns={3}>
            {
              this.state.bestImages.map(img => {
                return (
                  <Grid.Column key={img.src}>
                  <div >
                  <img style={{height: '192px', width: '256px'}}src={img.src}/>
                  <figcaption>
                    <div className="time">{img.time}</div>
                    <div className="score">{img.score}</div>
                  </figcaption>
                </div>
                </Grid.Column>
                )
              })
            }
            </Grid.Row>
            </Grid>
          </div>

    )
  }






}
