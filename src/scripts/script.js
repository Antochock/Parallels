@@include("checkWebpSupport.js")
@@include("burger-menu.js")
@@include("slider.js")
@@include("tabs.js")


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
