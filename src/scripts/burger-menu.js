$(document).ready(function() {
    $('.navigation__menu-burger').click(function() {
        $('.navigation__menu-burger').toggleClass('open-menu');
        $('.navbar').toggleClass('open-menu');
    });
});