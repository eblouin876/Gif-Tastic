// Object templates
class Gif {
    constructor(rating, activeLink, inactiveLink, title, download) {
        this.rating = rating;
        this.activeLink = activeLink;
        this.inactiveLink = inactiveLink;
        this.title = title;
        this.download = download;
    }

    buildCard = (parentId) => {
        let card = $('<div>').addClass('card m-2');
        let img = $('<img>')
            .attr('src', this.inactiveLink)
            .addClass('card-img-top')
            .attr('alt', this.title)
            .attr('data-active', this.activeLink)
            .attr('data-inactive', this.inactiveLink)
            .attr('data-state', 'inactive');
        let body = $('<div>')
            .addClass('card-body text-center');
        let cardTitle = $('<h5>')
            .addClass('card-title')
            .text(this.title);
        let cardText = $('<p>')
            .addClass('card-text')
            .text('Rating: ' + this.rating);
        let cardDownload = $('<a>')
            .addClass('btn btn-primary')
            .text('Download')
            .attr('download', true)
            .attr('href', this.download);
        $(`#${parentId}`).append(card.append(img, body.append(cardTitle, cardText, cardDownload)));
    }
}

class Subject {
    constructor(subject) {
        this.subject = subject;
    }

    buildButton = (parentId) => {
        let title = this.subject;
        let button = $('<button>')
            .text(title)
            .addClass('subject m-2 btn btn-success w-75')
        $(`#${parentId}`).append(button)
    }
}


// Buttons of predetermined subjects
let subjects = ["cats", "dogs", "turtles", "fish", "goats", "llamas", "birds", "snakes", "lizards"]
let subjectButtons = []

subjects.forEach(element => {
    let button = new Subject(element)
    button.buildButton("buttons-box")
    subjectButtons.push(button)
});


// Functions for event listeners
let trigger = function () {
    if ($(this).attr('data-state') === 'inactive') {
        $(this).attr('src', $(this).attr('data-active'));
        $(this).attr('data-state', 'active');
    } else {
        $(this).attr('src', $(this).attr('data-inactive'));
        $(this).attr('data-state', 'inactive');
    }
}

let getGifs = function () {
    let search = $(this).text()
    let rand = Math.floor(Math.random() * 150)
    $.ajax({
        url: `https://api.giphy.com/v1/gifs/search?q=${search}&rating=g&offset=${rand}&api_key=V5ocWl5KK3sMT5VrH2fFjEVoaCuVfUru&limit=10`,
        success: (result) => {
            let gifs = [];
            let data = result.data;
            data.forEach(element => {
                let active = element.images.fixed_width.url;
                let inactive = element.images.fixed_width_still.url;
                let rating = element.rating;
                let title = element.title;
                let download = element.url;

                let gif = new Gif(rating, active, inactive, title, download);
                gif.buildCard("main-box");
                gifs.push(gif);
            });

        }
    })
}

let addSubject = function () {
    // Add an input box with submit button that will add to the predetermined list
}

let clearField = function () {
    // Add a button that clears the screen of all gifs
}

// Event listeners
$(document).on('click', 'img', trigger);

$(document).on('click', '.subject', getGifs);

$(document).on('click', '#sumbit', addSubject)

$(document).on('click', '#clear', clearField)