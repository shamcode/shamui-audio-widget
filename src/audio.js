import { Widget, options } from 'sham-ui';
import Template from './template';
import Player from 'audio-player-es6';

export default class Audio extends Widget {
    constructor() {
        super( ...arguments );

        const audio = new Player();
        Object.defineProperty( this, 'audio', {
            get() { return audio; }
        } );

        this.isPlaying = false;
    }

    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // Options
    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    @options
    static trackURL = null;

    @options
    static PLAY_PAUSE_BUTTON_SELECTOR = '.play-pause';

    @options
    static VOLUME_SLIDER_SELECTOR = '.volume';

    @options
    static CURRENT_TRACK_SELECTOR = '#current';

    @options
    static TIMING_SLIDER_SELECTOR = '.timing';

    @options
    static PLAY_BUTTON_CLASS = 'playing';

    @options
    static PAUSE_BUTTON_CLASS = 'paused';

    @options
    static PRE_BUTTON_SELECTOR = '.pre';

    @options
    static NEXT_BUTTON_SELECTOR = '.next';

    @options
    static actionSequence = [ 'render', 'bindEvents' ];

    @options
    onPlay() {}

    @options
    onPause() {}

    @options
    onTimingUpdate() {}

    @options
    onLoading() {}

    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // Elements
    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

    get playPauseButton() {
        return this.container.querySelector( this.options.PLAY_PAUSE_BUTTON_SELECTOR );
    }

    get volumeSlider() {
        return this.container.querySelector( this.options.VOLUME_SLIDER_SELECTOR );
    }

    get timingSlider() {
        return this.container.querySelector( this.options.TIMING_SLIDER_SELECTOR );
    }

    get preButton() {
        return this.container.querySelector( this.options.PRE_BUTTON_SELECTOR );
    }

    get nextButton() {
        return this.container.querySelector( this.options.NEXT_BUTTON_SELECTOR );
    }

    get currentTrack() {
        return this.container.querySelector( this.options.CURRENT_TRACK_SELECTOR );
    }

    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    // Handlers
    // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    playPauseHandler() {
        const buttonClassList = this.playPauseButton.classList;
        const iconClassList = this.playPauseButton.querySelector( '.fa' ).classList;
        if ( this.isPlaying ) {
            this.audio.pause();
            buttonClassList.remove( this.options.PLAY_BUTTON_CLASS );
            buttonClassList.add( this.options.PAUSE_BUTTON_CLASS );
            iconClassList.remove( 'fa-pause' );
            iconClassList.add( 'fa-play' );
            this.options.onPause( this.audio );
        } else {
            this.audio.play();
            buttonClassList.remove( this.options.PAUSE_BUTTON_CLASS );
            buttonClassList.add( this.options.PLAY_BUTTON_CLASS );
            iconClassList.remove( 'fa-play' );
            iconClassList.add( 'fa-pause' );
            this.options.onPlay( this.audio );
        }
        this.isPlaying = !this.isPlaying;
    }

    volumeHandler() {
        this.audio.setVolume( parseFloat( this.volumeSlider.value ) );
    }

    timingUpdate() {
        const context = this.audio.audioCurrent;
        const slider = this.timingSlider;
        slider.max = context.duration;
        slider.value = context.currentTime;
    }

    timingHandler() {
        this.audio.audioCurrent.currentTime = this.timingSlider.value;
        this.options.onTimingUpdate( this.audio.audioCurrent.currentTime, this.audio );
    }

    preButtonHandler() {
        this.audio.pre();
    }

    nextButtonHandler() {
        this.audio.next();
    }

    bindEvents() {
        super.bindEvents( ...arguments );
        const self = this;
        this.audio
            .src( this.options.trackURL )
            .setCallBack( {
                loading( state, player ) {
                    self.currentTrack.innerText = player.audioList[ player.audioCurrentIndex ];
                    self.options.onLoading( player )
                }
            } )
        ;

        this.bindedPlayPauserHandler = this.playPauseHandler.bind( this );
        this.playPauseButton.addEventListener( 'click', this.bindedPlayPauserHandler );
        this.bindedVolumeHandler = this.volumeHandler.bind( this );
        this.volumeSlider.addEventListener( 'input', this.bindedVolumeHandler );
        this.bindedTimingUpdate = this.timingUpdate.bind( this );
        this.audio.audioCurrent.addEventListener( 'timeupdate', this.bindedTimingUpdate );
        this.bindedTimingHandler = this.timingHandler.bind( this );
        this.timingSlider.addEventListener( 'input', this.bindedTimingHandler );
        this.bindedPreHandler = this.preButtonHandler.bind( this );
        this.preButton.addEventListener( 'click', this.bindedPreHandler );
        this.bindedNextHandler = this.nextButtonHandler.bind( this );
        this.nextButton.addEventListener( 'click', this.bindedNextHandler );
    }

    html() {
        return Template;
    }

    destroy() {
        super.destroy( ...arguments );
        this.playPauseButton.removeEventListener( 'click', this.bindedPlayPauserHandler );
        this.volumeSlider.removeEventListener( 'input', this.bindedVolumeHandler );
        this.audio.audioCurrent.removeEventListener( 'timeupdate', this.bindedTimingUpdate );
        this.timingSlider.removeEventListener( 'input', this.bindedTimingHandler );
        this.preButton.removeEventListener( 'click', this.bindedPreHandler );
        this.nextButton.removeEventListener( 'click', this.bindedNextHandler );
    }
}
