$('#mako').click(()=>{
    if(+$('#mako').attr('sta')){
        $('#mako').attr('sta', 0)
        $('#mako').css('transform', 'rotateY(0deg)')
    }else{
        $('#mako').attr('sta', 1)
        $('#mako').css('transform', 'rotateY(360deg)')
    }
    $('#tt').css('color', 'rgb(250,233,145)')
    setTimeout(()=>{$('#tt').css('color', 'rgb(230,230,230)')}, 850)
})