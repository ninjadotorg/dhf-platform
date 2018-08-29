$(function() {
  // ------------------------------------------------------ //
  // For demo purposes, can be deleted
  // ------------------------------------------------------ //

  var stylesheet = $('link#theme-stylesheet');
  $("<link id='new-stylesheet' rel='stylesheet'>").insertAfter(stylesheet);
  // var alternateColour = $('link#new-stylesheet');

  // if ($.cookie('theme_csspath')) {
  //   alternateColour.attr('href', $.cookie('theme_csspath'));
  // }

  // $('#colour').change(function() {
  //   if ($(this).val() !== '') {
  //     var theme_csspath = 'css/style.' + $(this).val() + '.css';

  //     alternateColour.attr('href', theme_csspath);

  //     $.cookie('theme_csspath', theme_csspath, {
  //       expires: 365,
  //       path: document.URL.substr(0, document.URL.lastIndexOf('/')),
  //     });
  //   }

  //   return false;
  // });

  // =====================================================
  //      NAVBAR
  // =====================================================
  var c,
    currentScrollTop = 0;
  $(window).on('scroll load', function() {
    if ($(window).scrollTop() >= 100) {
      $('.navbar').addClass('active');
    } else {
      $('.navbar').removeClass('active');
    }

    // Navbar functionality
    var a = $(window).scrollTop(),
      b = $('.navbar').height();

    currentScrollTop = a;
    if (c < currentScrollTop && a > b + b) {
      $('.navbar').addClass('scrollUp');
    } else if (c > currentScrollTop && !(a <= b)) {
      $('.navbar').removeClass('scrollUp');
    }
    c = currentScrollTop;
  });

  // =====================================================
  //      PREVENTING URL UPDATE ON NAVIGATION LINK
  // =====================================================
  $('.link-scroll').on('click', function(e) {
    var anchor = $(this);
    $('html, body')
      .stop()
      .animate(
        {
          scrollTop: $(anchor.attr('href')).offset().top - 100,
        },
        1000
      );

    e.preventDefault();
  });

  // =====================================================
  //      SCROLL SPY
  // =====================================================
  $('body').scrollspy({
    target: '#navbarSupportedContent',
    offset: 80,
  });
  $(window).scroll(function() {
    $('#log').toggle($(document).scrollTop() > 480);
  });

  $('.subscription-form-2').submit(function(event) {
    event.preventDefault();
    const email = $(this)
      .find('input')
      .val();
    const type = $(this)
      .find('select')
      .val();
    if (/\S+@\S+\.\S+/.test(email) == false) {
      $('.email-danger-2').removeClass('hide');
      return null;
    }
    var data = {
      email: email,
      product: 'ninjafunds',
      type: type,
    };
    console.log(data);
    jQuery
      .ajax({
        url: 'https://ninja.org/api/user/subscribe',
        method: 'POST',
        processData: true,
        data: data,
      })
      .done(function() {
        $('.subscribe-success-2').removeClass('hide');
        $('.input-group-2').addClass('hide');
      })
      .fail(function() {})
      .always(function() {
        $('.email-danger-2').addClass('hide');
      });
  });

  $('.subscription-form-1').submit(function(event) {
    event.preventDefault();
    const email = $(this)
      .find('input')
      .val();
    const type = $(this)
      .find('select')
      .val();

    if (/\S+@\S+\.\S+/.test(email) == false) {
      $('.email-danger-1').removeClass('hide');
      return null;
    }
    var data = {
      email: email,
      product: 'ninjafunds',
      type: type,
    };
    console.log(data);
    jQuery
      .ajax({
        url: 'https://ninja.org/api/user/subscribe',
        method: 'POST',
        processData: true,
        data: data,
      })
      .done(function() {
        $('.subscribe-success-1').removeClass('hide');
        $('.input-group-1').addClass('hide');
        $('.email-heading-1').addClass('hide');
      })
      .fail(function() {})
      .always(function() {
        $('.email-danger-1').addClass('hide');
      });
  });
  $('.email-field-1').keypress(function(event) {
    if (/\S+@\S+\.\S+/.test(event.target.value) == false) {
      $('.email-danger-1').removeClass('hide');
      return null;
    } else {
      $('.email-danger-1').addClass('hide');
    }
  });

  $('.email-field-2').keypress(function(event) {
    if (/\S+@\S+\.\S+/.test(event.target.value) == false) {
      $('.email-danger-2').removeClass('hide');
      return null;
    } else {
      $('.email-danger-2').addClass('hide');
    }
  });
});
