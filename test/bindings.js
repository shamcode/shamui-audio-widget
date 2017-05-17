import Audio from '../src/audio';

export default function() {
    new Audio( '#audio-player', 'audio-player', {
        trackURL: [ 'assets/Jared_C_Balogh_-_09_-_Attempt_7.mp3' ],
        onPlay() {
            console.log( 'play' );
        },
        onPause() {
            console.log( 'pause' );
        },
        onTimingUpdate( time ) {
            console.log( 'update', time );
        },
        onLoading( player ) {
            console.log( player.audioList[ player.audioCurrentIndex ] );
        }
    } );
};
