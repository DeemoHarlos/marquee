var text = [
	'零元旅行',
	'搭便車',
	'往淡水'
]
$a('.text>span').forEach(function(e,i,a){e.style.fontSize = 80 + 'vh'})
var speed = 110
var interval = 1200
var i = -1

window.addEventListener('load',function(){
	function move(){
		i++
		$('#text'+(i%2+1)).style.transition = `none`
		$('#text'+(i%2+1)).style.top = '-100vh'
		$('#text'+(i%2+1)+'>span').innerText = text[i%text.length]
		var width = $('#text'+(i%2+1)+'>span').clientWidth
		var widthRatio = document.body.clientWidth/width
		var height = $('#text'+(i%2+1)+'>span').clientHeight
		var heightRatio = document.body.clientHeight/height
		var ratio = widthRatio<heightRatio?widthRatio:heightRatio
		$('#text'+(i%2+1)).style.transform = `scale(${ratio>1?1:ratio})`
		setTimeout(function(){
			$('#text'+(i%2+1)).style.transition = `top linear 300ms`
			$('#text'+(i%2+1)).style.top = `0`
			$('#text'+((i+1)%2+1)).style.top = `100vh`
		},100)
	}
	move()
	setInterval(move,interval+100)
})
