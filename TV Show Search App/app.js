const baseURL = 'https://api.tvmaze.com/search/shows?q=';

const queryInput = document.querySelector('#query');
const submitButton = document.querySelector('#submit');
const showsList = document.querySelector('#showsList');

submitButton.addEventListener('click', executorFn = (event) => {
    event.preventDefault();

    const lis = document.querySelectorAll('li');
    for(let li of lis)li.remove();

    const query = queryInput.value;
    if(query.length == 0){
        alert("Please enter a valid query");
        return;
    }
    const url = `${baseURL}${query}`;

    fetch(url)
        .then(response => response.json())
        .then((movieArr) => {
            for(let movie of movieArr){
                const li = document.createElement('li');
                li.append(movie.show.name);
                showsList.append(li);
            }
        })
        .catch((error) => console.log(error));
});
