import React, { Component } from 'react'
import { sounds, sequences } from 'config/config'

import Controls from 'components/Controls/Controls'
import Steps from 'components/Steps/Steps'
import Types from 'components/Types/Types'
import Keys from 'components/Keys/Keys'

import './DrumMachine.css'

class DrumMachine extends Component {

  state = {
    beat: sequences[0],
    currentStep: 0,
    tempo: 60,
    interval: null,
    status: 'stop' 
  }

  play = () => {
    const { tempo } = this.state
    const setTempo = (1000 / (tempo * 2) * 60)
    let currentStep = this.state.currentStep

    let playId = setInterval(() => {
      const { beat } = this.state

      for(let j = 0; j < 4; j++) { 
        if (beat[j][currentStep]) {
          sounds[j].play()
        }
      }
      if(currentStep < 15) {
        currentStep++
      } else if(currentStep >= 15) {
        currentStep = 0
      }
      this.setState({ currentStep })
    }, setTempo)

    this.setState({ 
      status: 'play',
      interval: playId 
    })
  }

  stop = () => {
    const { interval } = this.state
    this.setState({ 
      status: 'stop',
      currentStep: 0,
     })
    clearInterval(interval)
  }

  pause = () => {
    const { interval } = this.state
    this.setState({ status: 'pause' })
    clearInterval(interval)
  }

  clear = () => {
    this.stop()
    this.changeBeat(Array(4).fill(Array(16).fill(0)).map(r => r.slice()))
  }

  changeBeat = (beat) => {
    this.setState({ beat })
  }

  updateBeat = (row, column) => {
    let beat = this.state.beat
    beat[row][column] = +!this.state.beat[row][column]
    this.setState({ beat })
  }

  changeTempo = (e) => {
    const { status } = this.state
    this.pause()
    this.setState({ tempo: e.target.value }, () => {
      if (status === 'play') {
        this.play()
      }      
    })
  }

  changeVolume = (sound, volume) => {
    console.log(sound, volume)
    // sound.volume(value);
  }

  render() {
    const { beat, currentStep, status } = this.state

    return (
      <div className="container">
        <h1>JS-808 Sequencer</h1>
        <Controls 
          status={status}
          play={this.play}
          stop={this.stop}
          pause={this.pause}
          clear={this.clear}
          changeBeat={this.changeBeat}
          changeTempo={this.changeTempo}
        />
        <div className="drum-wrapper">
          <Steps status={status} currentStep={currentStep} />
          <Types changeVolume={this.changeVolume} />
          <Keys 
            beat={beat} 
            status={status} 
            currentStep={currentStep}
            updateBeat={this.updateBeat}
          />
        </div>
      </div>
    )
  }
}

export default DrumMachine
