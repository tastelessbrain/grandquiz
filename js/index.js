$( ".question-board button" ).click(function() {
  $( this ).toggleClass( "used" );
});

$('body').keyup(function(e){
  if (e.keyCode == 39 || e.keyCode == 37) {
    changeScreen();
  }
});

function changeScreen() {
  $( ".question-board" ).toggleClass( "active" );
  $( ".points" ).toggleClass( "active" );
  
  if ($(".screenBtn").attr('value') === "Spieler") {
    $(".screenBtn").attr('value', 'Fragen');
    
  } else {
    $(".screenBtn").attr('value', 'Spieler');
  }
}

function nextround() {
  if ($( ".question-board button" ).html() === "200") {
    $( ".question-board button" ).each( function() {
      let button = $(this);
      button.html(button.html() * 2);
    });
    $(".round-info").attr('value', 'Punkte halbieren');
  } else {
        $( ".question-board button" ).each( function() {
      let button = $(this);
      button.html(button.html() / 2);
      $(".round-info").attr('value', 'Punkte verdoppeln');
    });
  }
}