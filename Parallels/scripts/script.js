function testWebP(callback) {

var webP = new Image();
webP.onload = webP.onerror = function () {
callback(webP.height == 2);
};
webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

if (support == true) {
document.querySelector('body').classList.add('webp');
}else{
document.querySelector('body').classList.add('no-webp');
}
});
$(document).ready(function() {
    $('.navigation__menu-burger').click(function() {
        $('.navigation__menu-burger').toggleClass('open-menu');
        $('.navbar').toggleClass('open-menu');
    });
});
var slideNow = 1;
var slideCount = $('.slidewrapper').children().length;
var slideInterval = 3000;
var translateWidth = 0;

$(document).ready(function() {
    var switchInterval = setInterval(nextSlide, slideInterval);

    $('#next-btn').click(function() {
        nextSlide();
    });

    $('#prev-btn').click(function() {
        prevSlide();
    });
});


function nextSlide() {
    if (slideNow == slideCount || slideNow <= 0 || slideNow > slideCount) {
        $('.slidewrapper').css('transform', 'translate(0, 0)');
        slideNow = 1;
    } else {
        translateWidth = -$('.viewport').width() * (slideNow);
        $('.slidewrapper').css({
            'transform': 'translate(' + translateWidth + 'px, 0)',
        });
        slideNow++;
    }
}

function prevSlide() {
    if (slideNow == 1 || slideNow <= 0 || slideNow > slideCount) {
        translateWidth = -$('.viewport').width() * (slideCount - 1);
        $('.slidewrapper').css({
            'transform': 'translate(' + translateWidth + 'px, 0)',
        });
        slideNow = slideCount;
    } else {
        translateWidth = -$('.viewport').width() * (slideNow - 2);
        $('.slidewrapper').css({
            'transform': 'translate(' + translateWidth + 'px, 0)',
        });
        slideNow--;
    }
}
(function($) {
$(function() {
  
  $('ul.tabs__caption').on('click', 'li:not(.active)', function() {
    $(this)
      .addClass('active').siblings().removeClass('active')
      .closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');
  });
  
});
})(jQuery);


let gaugeElement = document.getElementsByClassName("gauge");

function setGaugeValue(gauge, value) {
  if (value < 0 || value > 1) {
    return;
  }
  let fill = gauge.children[0].getElementsByClassName("gauge__fill")[0];
  let cover = gauge.children[0].getElementsByClassName("gauge__cover")[0];

  fill.style.transform = `rotate(${value / 2 }turn)`;
  cover.textContent = `${Math.round(value * 100)}%`;
}

var offset = 800;
$(window).scroll(function(){
  var scrolltop = $(this).scrollTop();
  $('.gauge').each(function(){
    if(scrolltop >= $(this).offset().top - offset) {
		setGaugeValue(gaugeElement[0], 0.35);
		setGaugeValue(gaugeElement[1], 0.85);
		setGaugeValue(gaugeElement[2], 0.95);
		setGaugeValue(gaugeElement[3], 0.25);
		setGaugeValue(gaugeElement[4], 0.50);
    }
  });
});
