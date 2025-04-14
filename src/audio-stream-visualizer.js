export default class AudioStreamVisualizer {
  constructor(stream, canvas) {
    this.canvas = canvas
    this.canvasCtx = canvas.getContext('2d')
    this.width = canvas.width
    this.height = canvas.height

    this.smoothing = 0.8
    this.fftSize = 2048

    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    if (!this.audioCtx) {
      console.warn('Web Audio API is not supported in this browser.')
      return
    }

    const source = this.audioCtx.createMediaStreamSource(stream)
    this.analyser = this.audioCtx.createAnalyser()
    this.analyser.minDecibels = -140
    this.analyser.maxDecibels = 0
    this.analyser.smoothingTimeConstant = this.smoothing
    this.analyser.fftSize = this.fftSize

    source.connect(this.analyser)

    const bufferLength = this.analyser.frequencyBinCount
    this.freqs = new Uint8Array(bufferLength)
    this.times = new Uint8Array(bufferLength)

    this.animationId = null
  }

  start() {
    if (!this.animationId) {
      this.draw()
    }
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  draw() {
    this.analyser.getByteFrequencyData(this.freqs)
    this.analyser.getByteTimeDomainData(this.times)

    this.canvas.width = this.width
    this.canvas.height = this.height
    this.canvasCtx.clearRect(0, 0, this.width, this.height)

    const barWidth = this.width / this.freqs.length

    for (let i = 0; i < this.freqs.length; i++) {
      const value = this.freqs[i]
      const height = (value / 256) * this.height
      const y = this.height - height - 1

      this.canvasCtx.fillStyle = 'rgba(0, 255, 0, 0.5)'
      this.canvasCtx.fillRect(i * barWidth, y, barWidth, height)
    }

    for (let i = 0; i < this.times.length; i++) {
      const value = this.times[i]
      const height = (value / 256) * this.height
      const y = this.height - height - 1

      this.canvasCtx.fillStyle = 'rgba(0, 255, 0, 1)'
      this.canvasCtx.fillRect(i * barWidth, y, 1, 2)
    }

    this.animationId = requestAnimationFrame(this.draw.bind(this))
  }
}
