$(document).ready(
  function() {

    // Creo la data iniziale
    var date = moment({
      year: 2018,
      month: 0,
      day: 1
    });

    // Invoco la funzione per stampare il mese
    monthsGenerate(date);

    // Invoco la funzione per integrare i giorni festivi al mese stampato
    holidaysGenerate(date);

    // Aggiungo l'evento click alla freccia destra per andare al mese successivo
    $('#next').on('click',
      function() {
        // Recupero la data corrente e la trasformo in oggetto moment
        var currentMonth = $('#currentMonth').attr('date-current-month');
        var momentCurrentMonth = moment(currentMonth);
        // Aggiungo un mese all'oggetto moment per stamapre il mese successivo
        var nextMonth = momentCurrentMonth.add(1, 'Months');
        // Se l'anno è ancora il 2018 invoco le funzioni
        if (nextMonth.year() === 2018) {
          // Invoco la funzione per stampare il mese
          monthsGenerate(nextMonth);
          // Invoco la funzione per integrare i giorni festivi al mese stampato
          holidaysGenerate(nextMonth);
        } else {  // Altrimenti do un messaggio di avviso
          alert('Puoi vedere solo l\'anno 2018');
        }
      }
    );

    // Aggiungo l'evento click alla freccia sinistra per andare al mese precedente
    $('#prev').on('click',
      function() {
        // Recupero la data corrente e la trasformo in oggetto moment
        var currentMonth = $('#currentMonth').attr('date-current-month');
        var momentCurrentMonth = moment(currentMonth);
        // Sottraggo un mese all'oggetto moment per stamapre il mese precedente
        var prevMonth = momentCurrentMonth.subtract(1, 'Months');
        // Se l'anno è ancora il 2018 invoco le funzioni
        if (prevMonth.year() === 2018) {
          // Invoco la funzione per stampare il mese
          monthsGenerate(prevMonth);
          // Invoco la funzione per integrare i giorni festivi al mese stampato
          holidaysGenerate(prevMonth);
        } else {  // Altrimenti do un messaggio di avviso
          alert('Puoi vedere solo l\'anno 2018');
        }
      }
    );


    // **************************  FUNCTIONS  *************************** //

    // Funzione che genera, tramite Handlebars, la stampa del mese selezionato
    // Argomenti:
    //            ==> date: Oggetto moment contenente la data iniziale
    // Non ritorna nulla
    function monthsGenerate(date) {
      // Stampo il mese e l'anno selezionato dentro l'h1
      $('#currentMonth').text(date.format('MMMM YYYY'));
      // Aggiungo la data all'attributo dell'h1
      $('#currentMonth').attr('date-current-month', date.format('YYYY-MM-DD'));
      // Resetto la lista dei giorni del calendario
      $('.calendarList').html('');
      // Calcolo quanti giorni ha il mese selezionato
      var numberDays = date.daysInMonth();
      // Seleziono il template e lo compilo con Handlebars
      var source = $("#calendar-template").html();
      var template = Handlebars.compile(source);
      // Tramite un ciclo for creo i giorni e li inserisco nel template
      for (var i = 1; i <= numberDays; i++) {
        var currentDate = moment({
          day: i,
          month: date.month(),
          year: date.year()
        });
        var context = {
          day_attr: currentDate.format('YYYY-MM-DD'),
          dayNumber: currentDate.format('D'),
          dayName: currentDate.format('dddd')
        };
        var html = template(context);
        $('.calendarList').append(html);
      }
    }

    // Funzione che effettua una chiamata Ajax all'API selezionata ed integra al calendario creato le festività
    // Argomenti:
    //            ==> date: Oggetto moment contenente la data iniziale
    // Non ritorna nulla
    function holidaysGenerate(date) {
      // Effettuo la chiamata Ajax all'API selezionata, con metodo GET e l'anno e il mese della data iniziale
      $.ajax(
        {
          url: 'https://flynn.boolean.careers/exercises/api/holidays',
          method: 'GET',
          data: {
            year: date.year(),
            month: date.month()
          },
          // Se la chiamata va a buon fine eseguo le istruzioni
          success: function(dataResponse) {
            // Se l'anno è il 2018 eseguo le istruzioni
            if (date.year() === 2018) {
              // Conservo in una variabile il risultato della chiamata
              var holidays = dataResponse.response;
              // Tramite un ciclo for estraggo le singole date
              for (var i = 0; i < holidays.length; i++) {
                var currentHoliday = holidays[i];

                // Conservo in una variabile la data festiva che trova una corrispondenza nel calendario gia creato
                var thisDateElement = $('.square[date-current-day="' + currentHoliday.date + '"]');
                // A questo elemento aggiungo la classe holiday
                thisDateElement.addClass('holiday');
                // Allo stesso elemento aggiungo anche il nome della festività
                thisDateElement.find('.holidayName').append(currentHoliday.name);

                // Faccio la stessa cosa però con un each

                // $('.square').each(function() {
                //   var thisDateElement = $(this);
                //   var thisDayAttr = $(this).attr('data-giorno-corrente');
                //
                //   if (thisDayAttr === currentHoliday.date) {
                //     thisDateElement.addClass('holiday');
                //     thisDateElement.find('.holidayName').append(currentHoliday.name);
                //   }
                // });
                
              }
            }
          },
          // Se la chiamata non va a buonfine stampo un errore
          error: function() {
            alert('C\'è stato un\'errore');
          }
        }
      );
    }
  }
);
