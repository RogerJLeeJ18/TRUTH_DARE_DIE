import React, { Component } from 'react';
import MediaCapturer from 'react-multimedia-capture';


class WebcamCapture extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      granted: false,
      rejectedReason: '',
      recording: false,
      paused: false,
    };

    this.handleGranted = this.handleGranted.bind(this);
    this.handleDenied = this.handleDenied.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handleStop = this.handleStop.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleResume = this.handleResume.bind(this);
    this.setStreamToVideo = this.setStreamToVideo.bind(this);
    this.releaseStreamFromVideo = this.releaseStreamFromVideo.bind(this);
    this.downloadVideo = this.downloadVideo.bind(this);
  }
  setStreamToVideo(stream) {
    const video = this.refs.app.querySelector('video');

    if (window.URL) {
      video.src = window.URL.createObjectURL(stream);
    } else {
      video.src = stream;
    }
  }
  handleGranted() {
    this.setState({ granted: true });
    console.log('Permission Granted!');
  }
  handleDenied(err) {
    this.setState({ rejectedReason: err.name });
    console.log('Permission Denied!', err);
  }
  handleStart(stream) {
    this.setState({
      recording: true,
    });

    this.setStreamToVideo(stream);
    console.log('Recording Started.');
  }
  handleStop(blob) {
    this.setState({
      recording: false,
    });

    this.releaseStreamFromVideo();

    console.log('Recording Stopped.');
    this.downloadVideo(blob);
  }
  handlePause() {
    this.releaseStreamFromVideo();

    this.setState({
      paused: true,
    });
  }
  handleResume(stream) {
    this.setStreamToVideo(stream);

    this.setState({
      paused: false,
    });
  }
  handleError(err) {
    console.log(err);
  }
  releaseStreamFromVideo() {
    this.refs.app.querySelector('video').src = '';
  }
  downloadVideo(blob) {
    const videoData = new FormData();
    videoData.set('userVid', blob);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    this.props.userSendVideo(videoData);
  }
  render() {
    const { granted } = this.state;
    const { rejectedReason } = this.state;
    const { recording } = this.state;
    const { paused } = this.state;

    return (
      <div ref="app">
        <h3>Video Recorder</h3>
        <MediaCapturer
          constraints={{ audio: true, video: true }}
          timeSlice={10}
          onGranted={this.handleGranted}
          onDenied={this.handleDenied}
          onStart={this.handleStart}
          onStop={this.handleStop}
          onPause={this.handlePause}
          onResume={this.handleResume}
          onError={this.handleError}
          render={({
            start, stop, pause, resume
          }) =>
            (<div>
              <p>Granted: {granted.toString()}</p>
              <p>Rejected Reason: {rejectedReason}</p>
              <p>Recording: {recording.toString()}</p>
              <p>Paused: {paused.toString()}</p>
              <button onClick={start}>Start</button>
              <button onClick={stop}>Stop</button>
              <button onClick={pause}>Pause</button>
              <button onClick={resume}>Resume</button>

              <p>Streaming test</p>
              <video autoPlay></video>
            </div>)
          }
        />
      </div>
    );
  }
}

export { WebcamCapture };
