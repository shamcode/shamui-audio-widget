import { default as ShamUI, DI } from 'sham-ui';
import Audio from '../src/audio';

class AudioMock {
    constructor(context, spec) {
        spec = spec || {};

        this.context = context;
        this.numberOfInputs = spec.numberOfInputs || 0;
        this.numberOfOutputs = spec.numberOfOutputs || 0;
        this.channelCount = spec.channelCount || 2;
        this.channelCountMode = spec.channelCountMode || "max";
        this.channelInterpretation = spec.channelInterpretation || "speakers";
    }

    connect(destination) {
        if (destination instanceof AudioMock) {
            return destination;
        }
    }

    disconnect() {}

    addEventListener() {}

    removeEventListener() {}

    dispatchEvent() {}

    play() {}

    pause() {}
}

window.onload = () => {
    if ( undefined === window.Audio ) {
        window.Audio = AudioMock;
    }

    mocha.ui( 'bdd' );
    mocha.reporter( 'html' );
    mocha.setup( {
        asyncOnly: true
    } );

    const expect = chai.expect;

    describe( 'Audio widget', () => {
        it( 'Play & pause work', ( done ) => {
            let playHandled = false;
            let pauseHandled = false;
            DI.bind( 'widget-binder', () => {
                new Audio( '#audio-player', 'audio-player', {
                    trackURL: [
                        'assets/Jared_C_Balogh_-_09_-_Attempt_7.mp3'
                    ],
                    onPlay() {
                        playHandled = true;
                    },
                    onPause() {
                        pauseHandled = true;
                    }
                } );
            } );
            const UI = new ShamUI();
            UI.render.one( 'RenderComplete', () => {
                const button = document.querySelector( '.play-pause' );
                button.click();
                expect( playHandled ).to.be.equal( true );
                button.click();
                expect( pauseHandled ).to.be.equal( true );
                done();
            } );
            UI.render.FORCE_ALL();
        } )
    } );

    mocha.run();
};