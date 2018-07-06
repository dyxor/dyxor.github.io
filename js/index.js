$('#mako').click(()=>{
    _mako = $('#mako')
    if(+_mako.attr('sta')){
        _mako.attr('sta', 0)
        _mako.css('transform', 'rotateY(0deg)')
    }else{
        _mako.attr('sta', 1)
        _mako.css('transform', 'rotateY(900deg)')
    }
    $('#tt').css('color', 'rgb(250,233,145)')
    $('#tt').css('font-size', '3em')
    setTimeout(()=>{
        $('#tt').css('color', 'rgb(230,230,230)')
        $('#tt').css('font-size', '2.5em')
    }, 550)
});

(()=>{
    let id = 0, navs = ''
    const s1 = '<li><a class="navs" href="#', s2 = '">', s3= '</a></li>'
    $('h3').each(function () {
        let str = 'jmp' + id.toString()
        $(this).attr('id', str)
        navs += s1 + str + s2 + $(this).html() + s3
        ++id
    })

    $('#nav').html($('#nav').html()+'<ol>'+navs+'</ol>')
    
})()
