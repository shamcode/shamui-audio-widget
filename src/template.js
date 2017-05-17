export default `
    <div id="player">
		<p id="current"></p>
	</div>
	<div class="">
	    <div class="play-pause">
	        <i class="fa fa-play" aria-hidden="true"></i>
        </div>
		<div class="pre">
		    <i class="fa fa-backward"></i>
		</div>
		<input type="range" class="timing slider" min="0" max="1" value="0" name="range" step="0.1">
		<div class="next">
		    <i class="fa fa-forward"></i>
        </div>
		<input type="range" class="volume slider" min="0" max="1" value="1" name="range" step="0.01">
	</div>
`;
