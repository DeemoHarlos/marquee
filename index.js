var showbox   = d3.select('#showbox')
var notearea  = showbox.select('#notearea>.wrap')
var pianoroll = showbox.select('#pianoroll>.wrap')
var startNote = 21  // Must be on white-key
var endNote   = 108 // Must be on white-key
var verticalScale = 0.025
var speed = midifile.header.ticksPerBeat/midifile.tracks[0][0].microsecondsPerBeat*verticalScale

function isWhiteKey(i){
	var mod = i % 12
	return (mod==0 || mod==2 || mod==4 || mod==5 || mod==7 || mod==9 || mod==11)
}

var noteName  = ['C','C#','D','Eb','E','F','F#','G','G#','A','Bb','B']
var noteClass = ['C','Cs','D','Eb','E','F','Fs','G','Gs','A','Bb','B']
function getNoteName(i,esc){
	var mod = i % 12
	if(esc) return noteClass[mod]
	else    return noteName [mod]
}

function getWhiteKeyIndex(i){
	var whiteKey = i
	if(!isWhiteKey(i)) whiteKey++
	var mod = whiteKey%12
	var oct = Math.floor(whiteKey/12)
	var newmod = Math.floor(mod/2) + mod%2
	return 7*oct+newmod
}

function getLeftPos(i){
	var dist = getWhiteKeyIndex(i)-getWhiteKeyIndex(startNote)
	return 24*dist-(isWhiteKey(i)?0:6)
}

for(var i=startNote; i<=endNote; i++){
	if(isWhiteKey(i)){
		pianoroll.append('div')
			.attr('id','note'+i)
			.attr('class','note white-key '+getNoteName(i,true))
	}
	else {
		pianoroll.append('div')
			.attr('id','note'+i)
			.attr('class','note black-key '+getNoteName(i,true))
			.style('left',getLeftPos(i)+'px')
	}
}

var notes = []
var inproc = []
var time = 0

for(var e of midifile.tracks[0]){
	time += e.deltaTime
	var index = inproc.findIndex(note=>note.noteNumber==e.noteNumber)
	if (e.type === 'noteOn'){
		if(index>=0){
			var obj = inproc[index]
			obj.endTime = time
			obj.length = time - obj.startTime
			obj.id = notes.length
			notes.push(obj)
			inproc.splice(index,1)
		}
		var newObj = {}
		newObj.startTime = time
		newObj.channel = 0
		newObj.noteNumber = e.noteNumber
		newObj.velocity = e.velocity
		inproc.push(newObj)
	}
	else if (e.type === 'noteOff') {
		if(index>=0){
			var obj = inproc[index]
			obj.endTime = time
			obj.length = time - obj.startTime
			obj.id = notes.length
			notes.push(obj)
			inproc.splice(index,1)
		}
	}
	else {}
}

console.log(notes)

notes.forEach((e,i,a)=>{
	notearea.append('div')
		.attr('id','note'+e.id)
		.attr('class',`note ${isWhiteKey(e.noteNumber)?'white-key':'black-key'} ${getNoteName(e.noteNumber,true)} pitch${e.noteNumber}`)
		.style('height',e.length*verticalScale+'px')
		.style('bottom',e.startTime*verticalScale+'px')
		.style('left',getLeftPos(e.noteNumber)+'px')
})

window.addEventListener('load',function(){
	var start = Date.now()
	setInterval	(()=>{
		var now = Date.now()-start
		notearea.style('bottom',-now*1000*speed+'px')
	},1000/60)
})
