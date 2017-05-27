import { default as ShamUI, DI } from 'sham-ui';
import Audio from '../src/audio';
require('script!../path/to/your/script/twilio-client.js');
import wamock from 'web-audio-mock-api';

function AudioMock() {
    const obj = new  wamock.AudioNode();
    obj.play = () => {};
    obj.pause = () => {};
    return obj;
}

window.onload = () => {
    if ( typeof window.initMochaPhantomJS === 'function') {
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