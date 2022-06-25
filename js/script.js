$(document).ready(function() {

  function closeHeader(ele) {
    let i = $('#header .context .nav-item').length - 1
    $('#header').animate({'left': '-250px'}, 600)
    for(i; i >= 0; i--) {
      $('#header .context .nav-item').eq(i).animate({'top': '100%', 'left': '-100%'}, 300)
    }
    ele.html('<i class="fa-solid fa-align-justify"></i>')
  }
  
  function openHeader(ele) {
    $('#header').animate({'left': '0'}, 600, function() {
      $('#header .context .nav-item').css('left', '0')
      let i = 0
      setInterval(function() {
        $('#header .context .nav-item').eq(i).animate({'top': '0'}, 400)
        i++
      }, 150)
    })
    ele.html('<i class="fa-solid fa-xmark fa-xl"></i>')
  }
  
  $('#door-icon').click(function() {
    if($('#header').css('left') == '0px') closeHeader($(this))
    else openHeader($(this))
  })

  let apiTarget = 'now_playing'
  $('#header .nav-link').click(function(e) {
    apiTarget = e.target.dataset.api
    $('#movies').empty()
    getMoviesDetials()
  })

  async function getApiData(target, search) {
    const apiKey = 'eba8b9a7199efdcb0ca1f96879b83c44';
    let apiWithTarget = ''
    if(target == 'trending') {
      apiWithTarget = `https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`
    } else if(target == 'api_search') {
      apiTarget = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${search}`
    } else {
      apiWithTarget = `https://api.themoviedb.org/3/movie/${target}?api_key=${apiKey}`
    }
    let moviesAPI = await fetch(apiWithTarget)
    let moviesJSON = await moviesAPI.json()
    return moviesJSON.results
  }

  async function appendMovies(apiData) {
    for(let i = 0; i < apiData.length; i++) {
      $('#movies').append(`
      <div class="col-md-4">
        <div class="movie">
          <img class="img-fluid" src="https://image.tmdb.org/t/p/original/${apiData[i]['poster_path']}" alt="">
          <div class="overlay">
            <h2>${apiData[i]['original_title']}</h2>
            <p>${apiData[i]['overview']}</p>
            <div class="mb-3">rate: <span>${apiData[i]['vote_average']}</span></div>
            <div>${apiData[i]['release_date']}</div>
          </div>
        </div>
      </div>
      `)
    }
  }

  function searchMoviesHere(val) {
    getApiData(apiTarget).then(function(movies) {
      $('#movies').empty()
      let filterMovies = movies.filter(function(mov) {
        let movLower = mov['original_title'].toLowerCase()
        let valLower = val.toLowerCase()
        return movLower.includes(valLower)
      })
      appendMovies(filterMovies)
    })
  }

  $('#search-here').keyup(function() {
    searchMoviesHere($(this).val())
  })
  
  function searchMoviesApi(val) {
    getApiData('api_search', val).then(function(movies) {
      $('#movies').empty()
      console.log(movies)
      appendMovies(movies)
    })
  }

  $('#search-api').keyup(function() {
    searchMoviesApi($(this).val())
  })

  async function getMoviesDetials() {
    getApiData(apiTarget).then(function(movies) {
      
      appendMovies(movies)
      
      $('#content .movie').mouseenter(function() {
        $(this).find('.overlay').animate({'top': '0'}, 800)
      })
      
      $('#content .movie').mouseleave(function() {
        $(this).find('.overlay').animate({'top': '100%'}, 800)
      })
    })
  }

  getMoviesDetials()

  let validName = false
  let validEmail = false
  let validPhone = false
  let validAge = false
  let validPassword = false
  let validRepassword = false

  function validated() {
    if((validName && validEmail && validPhone && validAge && validPassword && validRepassword) == true)
      $('#submit').removeAttr('disabled')
    else $('#submit').attr('disabled', 'disabled')
  }

  $('#name').focusout(function() {
    if(!/^[a-zA-Z0-9]+$/g.test($(this).val())) {
      validName = false
      $(this).next().removeClass('d-none')
      validated()
    } else {
      validName = true
      $(this).next().addClass('d-none')
      validated()
    }
  })
  $('#email').focusout(function() {
    if(!/\w+@\w+.[a-z]{2,3}/g.test($(this).val())) {
      validEmail = false
      $(this).next().removeClass('d-none')
      validated()
    } else {
      validEmail = true
      $(this).next().addClass('d-none')
      validated()
    }
  })
  $('#phone').focusout(function() {
    if(!/01(0|1|2|5)[0-9]{8}/g.test($(this).val())) {
      validPhone = false
      $(this).next().removeClass('d-none')
      validated()
    } else {
      validPhone = true
      $(this).next().addClass('d-none')
      validated()
    }
  })
  $('#age').focusout(function() {
    if(!/^[1-9][0-9]?$|^100$/g.test($(this).val())) {
      validAge = false
      $(this).next().removeClass('d-none')
      validated()
    } else {
      validAge = true
      $(this).next().addClass('d-none')
      validated()
    }
  })
  $('#password').focusout(function() {
    if(!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/g.test($(this).val())) {
      validPassword = false
      $(this).next().removeClass('d-none')
      validated()
    } else {
      validPassword = true
      $(this).next().addClass('d-none')
      validated()
    }
  })
  $('#repassword').focusout(function() {
    if($(this).val() != $('#password').val()) {
      validRepassword = false
      $(this).next().removeClass('d-none')
      validated()
    } else {
      validRepassword = true
      $(this).next().addClass('d-none')
      validated()
    }
  })

  
})

