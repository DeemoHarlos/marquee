var text = '零元旅行 搭便車 往淡水'
var speed = 110
$('#text>span').style.fontSize = 80 + 'vh'

$('#text>span').innerText = text
var width = $('#text').clientWidth
var interval = width / speed * 100

window.addEventListener('load',function(){
	function move(){
		$('#text').style.transition = `none`
		$('#text').style.left = '100%'
		setTimeout(function(){
			$('#text').style.transition = `left linear ${interval}ms`
			$('#text').style.left = `-${width}px`
		},100)
	}
	move()
	setInterval(move,interval+100)
})
